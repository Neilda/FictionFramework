import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { World } from '../types';

const WORLD_ASPECTS = [
  {
    key: 'geography_climate' as keyof World,
    title: 'Geography & Climate',
    description: 'Physical layout, climate zones, and weather patterns',
  },
  {
    key: 'history_mythology' as keyof World,
    title: 'History & Mythology',
    description: 'Major events, wars, migrations, myths, and legends',
  },
  {
    key: 'culture_society' as keyof World,
    title: 'Culture & Society',
    description: 'Customs, traditions, languages, religions, and daily life',
  },
  {
    key: 'politics_economy' as keyof World,
    title: 'Politics & Economy',
    description: 'Governance, power structures, and economic systems',
  },
  {
    key: 'technology_magic' as keyof World,
    title: 'Technology & Magic',
    description: 'Technological advancement or magical systems and their rules',
  },
  {
    key: 'ecosystems_biology' as keyof World,
    title: 'Ecosystems & Biology',
    description: 'Flora, fauna, and biodiversity',
  },
  {
    key: 'infrastructure_urban' as keyof World,
    title: 'Infrastructure & Urban Design',
    description: 'City planning, architecture, and transportation',
  },
  {
    key: 'internal_logic' as keyof World,
    title: 'World\'s Internal Logic',
    description: 'Rules and consistencies that govern the world',
  },
];

function createEmptyWorld(storyId: string): Omit<World, 'id'> {
  return {
    story_id: storyId,
    geography_climate: '',
    history_mythology: '',
    culture_society: '',
    politics_economy: '',
    technology_magic: '',
    ecosystems_biology: '',
    infrastructure_urban: '',
    internal_logic: '',
  };
}

export default function WorldBuilding() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [world, setWorld] = useState<(World | Omit<World, 'id'>) | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingAspect, setEditingAspect] = useState<keyof World | null>(null);

  useEffect(() => {
    fetchWorld();
  }, [id]);

  async function fetchWorld() {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('worlds')
        .select('*')
        .eq('story_id', id);

      if (error) throw error;

      // Initialize with empty world if none exists
      setWorld(data?.[0] || createEmptyWorld(id));
    } catch (error) {
      console.error('Error fetching world:', error);
      // Initialize with empty world on error
      setWorld(createEmptyWorld(id));
    } finally {
      setLoading(false);
    }
  }

  async function saveWorld() {
    if (!world || !id) return;

    try {
      const worldData = {
        ...world,
        story_id: id,
      };

      // Remove the id field if it's a new world
      if ('id' in worldData && !worldData.id) {
        delete (worldData as any).id;
      }

      const { data, error } = await supabase
        .from('worlds')
        .upsert(worldData)
        .select();

      if (error) throw error;

      if (data?.[0]) {
        setWorld(data[0]);
      }
      setEditingAspect(null);
    } catch (error) {
      console.error('Error saving world:', error);
    }
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
          <h1 className="text-3xl font-bold text-novelry-900">World Building</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {WORLD_ASPECTS.map((aspect) => (
          <div
            key={aspect.key}
            className="bg-white rounded-lg shadow-sm border border-novelry-200 p-6"
          >
            <h3 className="text-lg font-medium text-novelry-900">{aspect.title}</h3>
            <p className="mt-1 text-sm text-novelry-500">{aspect.description}</p>

            {editingAspect === aspect.key ? (
              <div className="mt-4">
                <textarea
                  value={world?.[aspect.key] || ''}
                  onChange={(e) =>
                    setWorld(world ? { ...world, [aspect.key]: e.target.value } : null)
                  }
                  className="w-full h-32 p-2 border border-novelry-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                  placeholder={`Describe ${aspect.title.toLowerCase()}...`}
                />
                <div className="mt-2 flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingAspect(null)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveWorld}
                    className="btn-primary"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setEditingAspect(aspect.key)}
                className="mt-4 p-4 bg-novelry-50 rounded-md cursor-pointer hover:bg-novelry-100"
              >
                {world?.[aspect.key] ? (
                  <p className="text-novelry-700 whitespace-pre-wrap">{world[aspect.key]}</p>
                ) : (
                  <p className="text-novelry-400 italic">Click to add content...</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}