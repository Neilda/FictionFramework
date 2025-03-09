/*
  # Add RLS policies for stories table

  1. Security
    - Enable RLS on stories table
    - Add policies for authenticated users to:
      - Create their own stories
      - Read their own stories
      - Update their own stories
      - Delete their own stories
*/

-- Enable RLS
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Allow users to create their own stories
CREATE POLICY "Users can create their own stories"
ON stories
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own stories
CREATE POLICY "Users can read their own stories"
ON stories
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to update their own stories
CREATE POLICY "Users can update their own stories"
ON stories
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own stories
CREATE POLICY "Users can delete their own stories"
ON stories
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);