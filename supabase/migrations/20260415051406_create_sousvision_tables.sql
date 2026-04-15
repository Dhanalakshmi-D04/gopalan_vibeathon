/*
  # SousVision AI – Kitchen Infrastructure Tables

  1. New Tables
    - `incidents`
      - `id` (uuid, primary key)
      - `type` (text: hazard | logistics | compliance)
      - `message` (text)
      - `location` (text)
      - `severity` (text: low | medium | high | critical)
      - `created_at` (timestamptz)
    - `inventory_items`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `current_stock` (integer, 0-100 percent)
      - `unit` (text)
      - `supplier` (text)
      - `supplier_email` (text)
      - `ai_status` (text: Drafting Order | Optimized | Expedite Required)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Allow authenticated users to read and insert incidents
    - Allow authenticated users to read and update inventory items
*/

CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('hazard', 'logistics', 'compliance')),
  message text NOT NULL,
  location text NOT NULL DEFAULT '',
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read incidents"
  ON incidents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert incidents"
  ON incidents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  current_stock integer NOT NULL DEFAULT 100 CHECK (current_stock >= 0 AND current_stock <= 100),
  unit text NOT NULL DEFAULT 'kg',
  supplier text NOT NULL DEFAULT '',
  supplier_email text NOT NULL DEFAULT '',
  ai_status text NOT NULL DEFAULT 'Optimized' CHECK (ai_status IN ('Drafting Order', 'Optimized', 'Expedite Required')),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read inventory"
  ON inventory_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update inventory"
  ON inventory_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO inventory_items (name, category, current_stock, unit, supplier, supplier_email, ai_status) VALUES
  ('All-Purpose Flour', 'Dry Goods', 72, 'kg', 'PrimeBake Supplies', 'orders@primebake.com', 'Optimized'),
  ('Olive Oil (EVOO)', 'Oils & Fats', 45, 'L', 'MediterraFoods Ltd', 'supply@mediterra.com', 'Drafting Order'),
  ('Chicken Breast', 'Proteins', 28, 'kg', 'FarmFirst Proteins', 'bulk@farmfirst.io', 'Expedite Required'),
  ('Roma Tomatoes', 'Produce', 61, 'kg', 'GreenPath Organics', 'orders@greenpath.com', 'Optimized'),
  ('Heavy Cream', 'Dairy', 18, 'L', 'Alpine Dairy Co.', 'orders@alpinedairy.com', 'Expedite Required'),
  ('Kosher Salt', 'Seasonings', 88, 'kg', 'PrimeBake Supplies', 'orders@primebake.com', 'Optimized'),
  ('Arborio Rice', 'Grains', 55, 'kg', 'ItalFoods Import', 'orders@italfoods.com', 'Drafting Order'),
  ('Atlantic Salmon', 'Seafood', 12, 'kg', 'OceanDirect Ltd', 'fresh@oceandirect.com', 'Expedite Required')
ON CONFLICT DO NOTHING;