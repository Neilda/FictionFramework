import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Beat, BeatType, Character } from '../types';

const BEAT_DESCRIPTIONS: Record<BeatType, { title: string; description: string }> = {
  opening_image: {
    title: 'Opening Image',
    description: 'A visual that represents the struggle & tone of the story',
  },
  theme_stated: {
    title: 'Theme Stated',
    description: 'A statement that hints at what the story is really about',
  },
  setup: {
    title: 'Set-Up',
    description: 'Expand on the main character\'s world and what needs to change',
  },
  catalyst: {
    title: 'Catalyst',
    description: 'The moment that changes everything',
  },
  debate: {
    title: 'Debate',
    description: 'The protagonist wrestles with the change',
  },
  break_into_two: {
    title: 'Break into Two',
    description: 'The protagonist makes a choice and enters a new world',
  },
  b_story: {
    title: 'B Story',
    description: 'A secondary plot that often carries the theme',
  },
  fun_and_games: {
    title: 'Fun and Games',
    description: 'The protagonist explores the new world',
  },
  midpoint: {
    title: 'Midpoint',
    description: 'A false victory or false defeat that raises the stakes',
  },
  bad_guys_close_in: {
    title: 'Bad Guys Close In',
    description: 'External and internal pressures mount',
  },
  all_is_lost: {
    title: 'All is Lost',
    description: 'The opposite of the midpoint - a major setback',
  },
  dark_night_of_the_soul: {
    title: 'Dark Night of the Soul',
    description: 'The protagonist\'s darkest moment',
  },
  break_into_three: {
    title: 'Break into Three',
    description: 'The solution is discovered',
  },
  finale: {
    title: 'Finale',
    description: 'The protagonist proves they\'ve changed and succeeds',
  },
  final_image: {
    title: 'Final Image',
    description: 'A bookend to the opening image that shows change',
  },
};

export default function BeatSheet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [beats, setBeats] = useState<Beat[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBeat, setEditingBeat] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchBeats(), fetchCharacters()]).then(() => setLoading(false));
  }, [id]);

  async function fetchBeats() {
    if (!id) return;
    
    const { data, error } = await supabase
      .from('beats')
      .select('*')
      .eq('story_id', id)
      .order('type');

    if (error) {
      console.error('Error fetching beats:', error);
      return;
    }

    const existingBeats = data as Beat[];
    const allBeats = Object.keys(BEAT_DESCRIPTIONS).map(type => {
      const existingBeat = existingBeats.find(b => b.type === type);
      return existingBeat || {
        id: crypto.randomUUID(),
        story_id: id,
        type: type as BeatType,
        content: '',
        characters: [],
      };
    });

    setBeats(allBeats);
  }

  async function fetchCharacters() {
    if (!id) return;

    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('story_id', id)
      .order('name');

    if (error) {
      console.error('Error fetching characters:', error);
      return;
    }

    setCharacters(data);
  }

  async function saveBeat(beat: Beat) {
    const { error } = await supabase
      .from('beats')
      .upsert({
        story_id: beat.story_id,
        type: beat.type,
        content: beat.content,
        characters: beat.characters,
      });

    if (error) {
      console.error('Error saving beat:', error);
      return;
    }

    setEditingBeat(null);
    fetchBeats();
  }

  function getCharactersInBeat(beatType: BeatType): Character[] {
    return characters.filter(character => character.beats.includes(beatType));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-novelry-200 pb-5">
        <div className="flex items-center">
          <button
            onClick={() => navigate(`/story/${id}`)}
            className="mr-4 text-novelry-400 hover:text-novelry-500"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-bold text-novelry-900">Beat Sheet</h1>
        </div>
      </div>

      <div className="space-y-8">
        {beats.map((beat) => {
          const charactersInBeat = getCharactersInBeat(beat.type);
          
          return (
            <div
              key={beat.type}
              className="bg-white rounded-lg shadow-sm border border-novelry-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-novelry-900">
                    {BEAT_DESCRIPTIONS[beat.type].title}
                  </h3>
                  <p className="mt-1 text-sm text-novelry-500">
                    {BEAT_DESCRIPTIONS[beat.type].description}
                  </p>
                </div>
                {charactersInBeat.length > 0 && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-novelry-400" />
                    <div className="flex -space-x-2">
                      {charactersInBeat.map((character) => (
                        <div
                          key={character.id}
                          className="h-6 w-6 rounded-full bg-accent-100 border border-white flex items-center justify-center"
                          title={character.name}
                        >
                          <span className="text-xs text-accent-600">
                            {character.name.charAt(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-novelry-500">
                      {charactersInBeat.length} character{charactersInBeat.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              {editingBeat === beat.type ? (
                <div className="mt-4">
                  <textarea
                    value={beat.content}
                    onChange={(e) => {
                      const updatedBeat = { ...beat, content: e.target.value };
                      setBeats(beats.map(b => b.type === beat.type ? updatedBeat : b));
                    }}
                    className="w-full h-32 p-2 border border-novelry-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                    placeholder="Describe this beat..."
                  />
                  <div className="mt-2 flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingBeat(null)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveBeat(beat)}
                      className="btn-primary"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setEditingBeat(beat.type)}
                  className="mt-4 p-4 bg-novelry-50 rounded-md cursor-pointer hover:bg-novelry-100"
                >
                  {beat.content ? (
                    <p className="text-novelry-700 whitespace-pre-wrap">{beat.content}</p>
                  ) : (
                    <p className="text-novelry-400 italic">Click to add content...</p>
                  )}
                </div>
              )}

              {/* Character List */}
              {charactersInBeat.length > 0 && (
                <div className="mt-4 pt-4 border-t border-novelry-100">
                  <h4 className="text-sm font-medium text-novelry-700">Characters in this beat:</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {charactersInBeat.map(character => (
                      <span
                        key={character.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800"
                      >
                        {character.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}