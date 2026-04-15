import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

const SYSTEM_PROMPT = `You are the SousVision Autonomous Auditor — a zero-shot, B2B-grade AI agent 
engineered for commercial kitchen infrastructure. You operate with the precision 
of an industrial sensor array and the decisiveness of a senior operations manager.

YOUR MISSION:
Eliminate "Operational Fog" in commercial kitchens by analyzing visual input 
(image frames or video stills) and extracting structured, actionable intelligence 
across three critical domains:

DOMAIN 1 — LOGISTICS & INVENTORY:
  - Identify food items, containers, packaging, and storage areas
  - Estimate remaining volume or fill level as a percentage
  - Flag items below 20% as LOW, below 10% as CRITICAL
  - Detect misplaced, expired, or improperly stored goods

DOMAIN 2 — HEALTH & SAFETY:
  - Detect liquid spills, wet floors, fire hazards, or smoke
  - Identify misplaced sharp objects (knives, skewers) in unsafe zones
  - Detect open flames near flammable materials
  - Flag blocked fire exits or emergency pathways

DOMAIN 3 — WORKFLOW & COMPLIANCE:
  - Verify staff compliance with PPE (gloves, hairnets, aprons)
  - Detect cross-contamination risks (e.g., raw meat near prep-ready veg)
  - Analyze station throughput and cleanup cycle status

OUTPUT PROTOCOL:
You MUST respond ONLY with a single valid JSON object following this schema:
{
  "status": "Nominal | Warning | Critical",
  "category": "Safety | Logistics | Compliance | Efficiency",
  "detection": "Detailed string describing specifically what was found",
  "urgency_score": 0-10,
  "confidence_percent": 0-100,
  "zone": "Zone A-D",
  "agent_action": {
    "type": "Log | Alert | Email | Dispatch",
    "description": "Recommended human or system action",
    "email_draft": "Optional pre-written B2B email for reorders or alerts"
  },
  "inventory_update": [
    {"item": "Name", "current_stock_percent": 0-100}
  ],
  "dashboard_directive": {
    "accent_color": "emerald | amber | red",
    "badge_text": "TEXT",
    "trigger_modal": boolean
  }
}`;

app.post('/api/scan', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'YOUR_GEMINI_KEY') {
      console.log('No Google API Key found. Returning mock response.');
      const name = req.file.originalname.toLowerCase();
      let mock;
      
      if (name.includes('wet') || name.includes('spill')) {
        mock = {
          status: "Critical", category: "Safety", zone: "Zone B",
          detection: "Liquid spill detected near prep table.",
          urgency_score: 9, confidence_percent: 98,
          agent_action: { type: "Alert", description: "Deploy cleanup immediately." },
          dashboard_directive: { accent_color: "red", badge_text: "SPILL DETECTED", trigger_modal: true }
        };
      } else {
        mock = {
          status: "Nominal", category: "Efficiency", zone: "Zone A",
          detection: "Station check complete. No hazards found.",
          urgency_score: 1, confidence_percent: 95,
          agent_action: { type: "Log", description: "Nominal operations." },
          dashboard_directive: { accent_color: "emerald", badge_text: "NOMINAL", trigger_modal: false }
        };
      }
      return res.json(mock);
    }

    const imageBuffer = fs.readFileSync(req.file.path);
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: req.file.mimetype
      }
    };

    const result = await model.generateContent([SYSTEM_PROMPT, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Clean up markdown block if present
    const cleanJson = text.replace(/```json|```/g, '').trim();
    const auditResult = JSON.parse(cleanJson);

    // 1. Persist Incidents
    if (process.env.VITE_SUPABASE_URL) {
       await supabase.from('incidents').insert({
          type: auditResult.category.toLowerCase() === 'safety' ? 'hazard' : 
                auditResult.category.toLowerCase() === 'logistics' ? 'logistics' : 'compliance',
          message: auditResult.detection,
          location: auditResult.zone,
          severity: auditResult.status.toLowerCase() === 'critical' ? 'critical' : 
                   auditResult.status.toLowerCase() === 'warning' ? 'high' : 'medium'
       });

       // 2. Persist Inventory Updates
       if (auditResult.inventory_update && Array.isArray(auditResult.inventory_update)) {
         for (const update of auditResult.inventory_update) {
           const status = update.current_stock_percent < 15 ? 'Expedite Required' : 
                          update.current_stock_percent < 30 ? 'Drafting Order' : 'Optimized';
           
           await supabase
             .from('inventory_items')
             .update({ 
               current_stock: update.current_stock_percent,
               ai_status: status,
               updated_at: new Date()
             })
             .ilike('name', `%${update.item}%`);
         }
       }
    }

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    res.json(auditResult);
  } catch (error) {
    console.error('Scan Error:', error);
    res.status(500).json({ error: 'AI Analysis failed', details: error.message });
    if (req.file) fs.unlinkSync(req.file.path);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`SousVision Backend running on http://localhost:${PORT}`);
});
