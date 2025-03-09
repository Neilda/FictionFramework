import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, User, BookOpen, Edit, BarChart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Character, BeatType } from '../types';

const BEAT_TYPES: { value: BeatType; label: string }[] = [
  { value: 'opening_image', label: 'Opening Image' },
  { value: 'theme_stated', label: 'Theme Stated' },
  { value: 'setup', label: 'Set-Up' },
  { value: 'catalyst', label: 'Catalyst' },
  { value: 'debate', label: 'Debate' },
  { value: 'break_into_two', label: 'Break into Two' },
  { value: 'b_story', label: 'B Story' },
  { value: 'fun_and_games', label: 'Fun and Games' },
  { value: 'midpoint', label: 'Midpoint' },
  { value: 'bad_guys_close_in', label: 'Bad Guys Close In' },
  { value: 'all_is_lost', label: 'All is Lost' },
  { value: 'dark_night_of_the_soul', label: 'Dark Night of the Soul' },
  { value: 'break_into_three', label: 'Break into Three' },
  { value: 'finale', label: 'Finale' },
  { value: 'final_image', label: 'Final Image' },
];

const CHARACTER_ASPECTS = [
  { key: 'physical_traits', label: 'Physical Traits' },
  { key: 'psychological_profile', label: 'Psychological Profile' },
  { key: 'backstory', label: 'Backstory' },
  { key: 'goals_motivations', label: 'Goals & Motivations' },
  { key: 'conflicts', label: 'Conflicts' },
  { key: 'arc_transformation', label: 'Character Arc' },
] as const;

function calculateCharacterProgress(character: Character): number {
  const completedAspects = CHARACTER_ASPECTS.filter(
    aspect => character[aspect.key]?.trim().length > 0
  ).length;
  return Math.round((completedAspects / CHARACTER_ASPECTS.length) * 100);
}

export default function CharacterList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCharacters();
  }, [id]);

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
    setLoading(false);
  }

  async function saveCharacter(character: Partial<Character>) {
    if (!id) return;

    const isNewCharacter = !character.id;
    const characterData = {
      ...character,
      story_id: id,
      beats: character.beats || [],
      ...(isNewCharacter ? {} : { id: character.id }),
    };

    const { data, error } = await supabase
      .from('characters')
      .upsert(characterData)
      .select()
      .single();

    if (error) {
      console.error('Error saving character:', error);
      return;
    }

    // Update the characters list
    await fetchCharacters();

    // If this was a new character, update the selected character with the saved data
    if (isNewCharacter && data) {
      setSelectedCharacter(data);
    }

    setIsEditing(false);
  }

  async function deleteCharacter(characterId: string) {
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', characterId);

    if (error) {
      console.error('Error deleting character:', error);
      return;
    }

    setSelectedCharacter(null);
    fetchCharacters();
  }

  function toggleBeat(beat: BeatType) {
    if (!selectedCharacter) return;

    const updatedBeats = selectedCharacter.beats.includes(beat)
      ? selectedCharacter.beats.filter(b => b !== beat)
      : [...selectedCharacter.beats, beat];

    setSelectedCharacter({
      ...selectedCharacter,
      beats: updatedBeats,
    });
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
          <h1 className="text-3xl font-bold text-novelry-900">Characters</h1>
        </div>
        <button
          onClick={() => {
            setSelectedCharacter({
              story_id: id!,
              name: '',
              physical_traits: '',
              psychological_profile: '',
              backstory: '',
              goals_motivations: '',
              conflicts: '',
              arc_transformation: '',
              beats: [],
              photo_url: '',
              generated_photo_url: '',
              photo_prompt: '',
            } as Character);
            setIsEditing(true);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Character
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {characters.map((character) => {
          const progress = calculateCharacterProgress(character);
          return (
            <div
              key={character.id}
              onClick={() => {
                setSelectedCharacter(character);
                setIsEditing(false);
              }}
              className="bg-white rounded-lg shadow-sm border border-novelry-200 hover:shadow-md transition-shadow cursor-pointer overflow-hidden group"
            >
              <div className="aspect-square bg-gradient-to-br from-accent-50 to-accent-100 flex items-center justify-center">
                <User className="h-16 w-16 text-accent-300 group-hover:text-accent-400 transition-colors" />
              </div>
              <div className="p-3">
                <h3 className="text-base font-medium text-novelry-900 truncate">{character.name}</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1.5">
                      <BarChart className="h-4 w-4 text-novelry-400" />
                      <span className="text-novelry-600">{progress}% Complete</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <BookOpen className="h-4 w-4 text-novelry-400" />
                      <span className="text-novelry-600">{character.beats.length}</span>
                    </div>
                  </div>
                  <div className="w-full bg-novelry-100 rounded-full h-1.5">
                    <div
                      className="bg-accent-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {selectedCharacter && (
          <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                {isEditing ? (
                  <input
                    type="text"
                    value={selectedCharacter.name}
                    onChange={(e) =>
                      setSelectedCharacter({ ...selectedCharacter, name: e.target.value })
                    }
                    className="text-2xl font-bold text-novelry-900 border-b border-novelry-300 focus:border-accent-500 focus:ring-0 w-full"
                    placeholder="Character Name"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-novelry-900">{selectedCharacter.name}</h2>
                )}
                <div className="flex space-x-2">
                  {!isEditing && selectedCharacter.id && (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-novelry-400 hover:text-accent-500"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteCharacter(selectedCharacter.id)}
                        className="text-novelry-400 hover:text-accent-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedCharacter(null)}
                    className="text-novelry-400 hover:text-novelry-500 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {/* Character Beats */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-novelry-900">Story Beats</h3>
                    {!isEditing && selectedCharacter.beats.length === 0 && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-accent-600 hover:text-accent-700"
                      >
                        Add beats
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="mt-4 space-y-2">
                      {BEAT_TYPES.map((beat) => (
                        <label
                          key={beat.value}
                          className="flex items-center space-x-3 p-2 rounded hover:bg-novelry-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCharacter.beats.includes(beat.value)}
                            onChange={() => toggleBeat(beat.value)}
                            className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-novelry-300 rounded"
                          />
                          <span className="text-sm text-novelry-700">{beat.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2">
                      {selectedCharacter.beats.length > 0 ? (
                        <div className="space-y-2">
                          {selectedCharacter.beats.map((beatType) => {
                            const beat = BEAT_TYPES.find(b => b.value === beatType);
                            return (
                              <div
                                key={beatType}
                                className="flex items-center px-3 py-2 bg-novelry-50 rounded-md"
                              >
                                <BookOpen className="h-4 w-4 text-novelry-400 mr-2" />
                                <span className="text-sm text-novelry-700">
                                  {beat?.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-novelry-500 italic mt-2">
                          No beats assigned to this character yet
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Character Details with Progress Indicators */}
                {CHARACTER_ASPECTS.map((field) => {
                  const hasContent = selectedCharacter[field.key]?.trim().length > 0;
                  return (
                    <div key={field.key}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-novelry-900">{field.label}</h3>
                        {!isEditing && (
                          <div className={`px-2 py-0.5 rounded text-xs ${
                            hasContent ? 'bg-accent-100 text-accent-700' : 'bg-novelry-100 text-novelry-500'
                          }`}>
                            {hasContent ? 'Complete' : 'Not Started'}
                          </div>
                        )}
                      </div>
                      {isEditing ? (
                        <textarea
                          value={selectedCharacter[field.key]}
                          onChange={(e) =>
                            setSelectedCharacter({
                              ...selectedCharacter,
                              [field.key]: e.target.value,
                            })
                          }
                          className="mt-2 w-full h-32 p-2 border border-novelry-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                          placeholder={`Describe the character's ${field.label.toLowerCase()}...`}
                        />
                      ) : (
                        <p className="mt-2 text-novelry-700 whitespace-pre-wrap">
                          {selectedCharacter[field.key] || 'Not specified'}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      if (!selectedCharacter.id) {
                        setSelectedCharacter(null);
                      }
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveCharacter(selectedCharacter)}
                    className="btn-primary"
                  >
                    Save Character
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}