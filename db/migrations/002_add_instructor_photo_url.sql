-- Add photo_url column to instructors table
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500);
