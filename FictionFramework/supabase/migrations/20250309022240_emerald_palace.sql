/*
  # Add character photos

  1. Changes
    - Add `photo_url` column to characters table for storing uploaded photos
    - Add `generated_photo_url` column for AI-generated photos
    - Add `photo_prompt` column to store the prompt used for generation

  2. Security
    - No changes to RLS policies needed as these are just additional columns
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'characters' AND column_name = 'photo_url'
  ) THEN
    ALTER TABLE characters 
    ADD COLUMN photo_url text DEFAULT '',
    ADD COLUMN generated_photo_url text DEFAULT '',
    ADD COLUMN photo_prompt text DEFAULT '';
  END IF;
END $$;