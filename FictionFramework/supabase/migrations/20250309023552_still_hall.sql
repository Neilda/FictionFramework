/*
  # Add story description

  1. Changes
    - Add `description` column to stories table for storing story descriptions
    
  2. Security
    - No changes to RLS policies needed as this is just an additional column
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'stories' AND column_name = 'description'
  ) THEN
    ALTER TABLE stories 
    ADD COLUMN description text DEFAULT '';
  END IF;
END $$;