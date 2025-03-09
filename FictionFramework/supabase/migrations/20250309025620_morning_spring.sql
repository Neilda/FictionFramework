/*
  # Create storage bucket for character photos

  1. New Storage Bucket
    - Create a public bucket for character photos
    - Enable public access for authenticated users
*/

-- Create a new storage bucket for character photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('character-photos', 'character-photos', true);

-- Allow public access to the bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'character-photos');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'character-photos');

-- Allow users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'character-photos');

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'character-photos');