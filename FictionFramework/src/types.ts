export interface Story {
  id: string;
  title: string;
  description: string;
  created_at: string;
  user_id?: string;
}

export interface Beat {
  id: string;
  story_id: string;
  type: BeatType;
  content: string;
  characters: string[];
}

export type BeatType =
  | 'opening_image'
  | 'theme_stated'
  | 'setup'
  | 'catalyst'
  | 'debate'
  | 'break_into_two'
  | 'b_story'
  | 'fun_and_games'
  | 'midpoint'
  | 'bad_guys_close_in'
  | 'all_is_lost'
  | 'dark_night_of_the_soul'
  | 'break_into_three'
  | 'finale'
  | 'final_image';

export interface Character {
  id: string;
  story_id: string;
  name: string;
  physical_traits: string;
  psychological_profile: string;
  backstory: string;
  goals_motivations: string;
  conflicts: string;
  arc_transformation: string;
  beats: BeatType[];
  photo_url: string;
  generated_photo_url: string;
  photo_prompt: string;
}

export interface World {
  id: string;
  story_id: string;
  geography_climate: string;
  history_mythology: string;
  culture_society: string;
  politics_economy: string;
  technology_magic: string;
  ecosystems_biology: string;
  infrastructure_urban: string;
  internal_logic: string;
}