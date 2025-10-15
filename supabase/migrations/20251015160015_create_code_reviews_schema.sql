/*
  # Code Review Assistant Database Schema

  1. New Tables
    - `code_reviews`
      - `id` (uuid, primary key) - Unique identifier for each review
      - `filename` (text) - Name of the uploaded file
      - `code_content` (text) - The source code that was reviewed
      - `language` (text) - Programming language detected
      - `review_result` (jsonb) - Complete review analysis from Gemini
      - `created_at` (timestamptz) - When the review was created
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `code_reviews` table
    - Add policy for anyone to insert reviews (public access)
    - Add policy for anyone to read reviews (public access)
*/

CREATE TABLE IF NOT EXISTS code_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  code_content text NOT NULL,
  language text DEFAULT 'unknown',
  review_result jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE code_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create code reviews"
  ON code_reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read code reviews"
  ON code_reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS code_reviews_created_at_idx ON code_reviews(created_at DESC);