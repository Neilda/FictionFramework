/*
  # Initial Schema Setup for Story Organizer

  1. New Tables
    - stories
      - id (uuid, primary key)
      - title (text)
      - created_at (timestamp)
      - user_id (uuid, references auth.users)
    
    - beats
      - id (uuid, primary key)
      - story_id (uuid, references stories)
      - type (text)
      - content (text)
      - characters (text[])

    - characters
      - id (uuid, primary key)
      - story_id (uuid, references stories)
      - name (text)
      - physical_traits (text)
      - psychological_profile (text)
      - backstory (text)
      - goals_motivations (text)
      - conflicts (text)
      - arc_transformation (text)
      - beats (text[])

    - worlds
      - id (uuid, primary key)
      - story_id (uuid, references stories)
      - geography_climate (text)
      - history_mythology (text)
      - culture_society (text)
      - politics_economy (text)
      - technology_magic (text)
      - ecosystems_biology (text)
      - infrastructure_urban (text)
      - internal_logic (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create stories table
CREATE TABLE stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

-- Create beats table
CREATE TABLE beats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES stories ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  content text DEFAULT '',
  characters text[] DEFAULT '{}'::text[]
);

-- Create characters table
CREATE TABLE characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES stories ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  physical_traits text DEFAULT '',
  psychological_profile text DEFAULT '',
  backstory text DEFAULT '',
  goals_motivations text DEFAULT '',
  conflicts text DEFAULT '',
  arc_transformation text DEFAULT '',
  beats text[] DEFAULT '{}'::text[]
);

-- Create worlds table
CREATE TABLE worlds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES stories ON DELETE CASCADE NOT NULL,
  geography_climate text DEFAULT '',
  history_mythology text DEFAULT '',
  culture_society text DEFAULT '',
  politics_economy text DEFAULT '',
  technology_magic text DEFAULT '',
  ecosystems_biology text DEFAULT '',
  infrastructure_urban text DEFAULT '',
  internal_logic text DEFAULT ''
);

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE beats ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE worlds ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own stories"
  ON stories
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage beats through story ownership"
  ON beats
  USING (EXISTS (
    SELECT 1 FROM stories 
    WHERE stories.id = beats.story_id 
    AND stories.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage characters through story ownership"
  ON characters
  USING (EXISTS (
    SELECT 1 FROM stories 
    WHERE stories.id = characters.story_id 
    AND stories.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage world building through story ownership"
  ON worlds
  USING (EXISTS (
    SELECT 1 FROM stories 
    WHERE stories.id = worlds.story_id 
    AND stories.user_id = auth.uid()
  ));