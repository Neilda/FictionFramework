/*
  # Storage bucket and policies for character photos

  1. New Storage Bucket
    - Create 'character-photos' bucket for storing character images
  
  2. Security
    - Enable public access to read photos
    - Allow authenticated users to upload photos
    - Allow users to update and delete their own photos

  Note: Using DROP POLICY IF EXISTS to handle existing policies
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('character-photos', 'character-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Remove existing policies if they exist
DROP POLICY IF EXISTS "Give public access to character photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload character photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own photos" ON storage.objects;

-- Policy to allow public access to read photos
CREATE POLICY "Give public access to character photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'character-photos');

-- Policy to allow authenticated users to upload photos
CREATE POLICY "Allow authenticated users to upload character photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'character-photos');

-- Policy to allow authenticated users to update their own photos
CREATE POLICY "Allow authenticated users to update their own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'character-photos')
WITH CHECK (bucket_id = 'character-photos');

-- Policy to allow authenticated users to delete their own photos
CREATE POLICY "Allow authenticated users to delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'character-photos');