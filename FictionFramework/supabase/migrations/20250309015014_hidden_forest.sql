/*
  # Update RLS policies for public access
  
  1. Changes
    - Enable public access to stories table
    - Enable public access to beats table
    - Enable public access to characters table
    - Enable public access to worlds table
    
  2. Security
    - Remove user-based policies
    - Add public access policies
*/

-- Update stories table policies
DROP POLICY IF EXISTS "Users can create their own stories" ON stories;
DROP POLICY IF EXISTS "Users can delete their own stories" ON stories;
DROP POLICY IF EXISTS "Users can manage their own stories" ON stories;
DROP POLICY IF EXISTS "Users can read their own stories" ON stories;
DROP POLICY IF EXISTS "Users can update their own stories" ON stories;

CREATE POLICY "Enable public access to stories"
  ON stories
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Update beats table policies
DROP POLICY IF EXISTS "Users can manage beats through story ownership" ON beats;

CREATE POLICY "Enable public access to beats"
  ON beats
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Update characters table policies
DROP POLICY IF EXISTS "Users can manage characters through story ownership" ON characters;

CREATE POLICY "Enable public access to characters"
  ON characters
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Update worlds table policies
DROP POLICY IF EXISTS "Users can manage world building through story ownership" ON worlds;

CREATE POLICY "Enable public access to worlds"
  ON worlds
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Make user_id nullable since we don't need it anymore
ALTER TABLE stories ALTER COLUMN user_id DROP NOT NULL;