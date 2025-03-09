/*
  # Add photo columns to characters table

  1. Changes
    - Add photo_url column for uploaded photos
    - Add generated_photo_url column for AI-generated photos
    - Add photo_prompt column to store the prompt used for generation
*/

ALTER TABLE characters
ADD COLUMN IF NOT EXISTS photo_url text DEFAULT '',
ADD COLUMN IF NOT EXISTS generated_photo_url text DEFAULT '',
ADD COLUMN IF NOT EXISTS photo_prompt text DEFAULT '';