-- Allow authenticated users to insert posts
CREATE POLICY "Authenticated users can insert posts" 
ON posts FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Optional: Allow users to update their own posts (requires author_id column later, but for now simple)
-- CREATE POLICY "Users can update their own posts" 
-- ON posts FOR UPDATE 
-- TO authenticated 
-- USING (auth.uid() = author_id);
