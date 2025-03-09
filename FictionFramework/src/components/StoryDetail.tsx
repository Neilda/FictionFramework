import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, Users, Globe, Edit, Check, X, BarChart as ChartBar, Trash2 } from 'lucide-react';
import { useStoryStore } from '../store/storyStore';
import { supabase } from '../lib/supabase';
import { Beat, Character, World } from '../types';

interface ProgressData {
  beats: {
    total: number;
    completed: number;
  };
  characters: number;
  world: {
    total: number;
    completed: number;
  };
}

export default function StoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { stories, updateStory, deleteStory } = useStoryStore();
  const story = stories.find(s => s.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(story?.title || '');
  const [editedDescription, setEditedDescription] = useState(story?.description || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [progressData, setProgressData] = useState<ProgressData>({
    beats: { total: 15, completed: 0 },
    characters: 0,
    world: { total: 8, completed: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProgressData();
    }
  }, [id]);

  async function fetchProgressData() {
    if (!id) return;

    try {
      // Fetch beats
      const { data: beats } = await supabase
        .from('beats')
        .select('content')
        .eq('story_id', id);

      // Fetch characters
      const { data: characters } = await supabase
        .from('characters')
        .select('id')
        .eq('story_id', id);

      // Fetch world building aspects
      const { data: world } = await supabase
        .from('worlds')
        .select('*')
        .eq('story_id', id)
        .single();

      const completedBeats = beats?.filter(beat => beat.content?.trim()).length || 0;
      
      const completedWorldAspects = world ? Object.values(world).filter(
        value => typeof value === 'string' && value.trim().length > 0
      ).length - 2 : 0; // Subtract 2 to account for id and story_id fields

      setProgressData({
        beats: {
          total: 15,
          completed: completedBeats,
        },
        characters: characters?.length || 0,
        world: {
          total: 8,
          completed: completedWorldAspects,
        },
      });
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    if (!id) return;
    await updateStory(id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteStory(id);
    navigate('/');
  };

  if (!story) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-novelry-900">Story not found</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-accent-600 hover:text-accent-700"
        >
          Return to stories
        </button>
      </div>
    );
  }

  const navigationCards = [
    {
      title: 'Beat Sheet',
      description: 'Plan your story structure using the 15 key story beats',
      icon: BookOpen,
      path: `beats`,
      progress: progressData.beats,
    },
    {
      title: 'Characters',
      description: 'Manage your story characters and their development',
      icon: Users,
      path: `characters`,
      characterCount: progressData.characters,
    },
    {
      title: 'World Building',
      description: 'Develop and organize your story world details',
      icon: Globe,
      path: `world`,
      progress: progressData.world,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-novelry-200 pb-5">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex-1 space-y-4">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-3xl font-bold text-novelry-900 w-full bg-transparent border-b border-accent-300 focus:border-accent-500 focus:ring-0 px-0"
                placeholder="Story Title"
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full text-novelry-600 bg-transparent border rounded-md border-novelry-200 focus:border-accent-500 focus:ring-accent-200 p-2"
                placeholder="Add a description for your story..."
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setEditedTitle(story.title);
                    setEditedDescription(story.description);
                    setIsEditing(false);
                  }}
                  className="btn-secondary"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button onClick={handleSave} className="btn-primary">
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-novelry-900">{story.title}</h1>
                <button
                  onClick={() => {
                    setEditedTitle(story.title);
                    setEditedDescription(story.description);
                    setIsEditing(true);
                  }}
                  className="text-novelry-400 hover:text-accent-600"
                >
                  <Edit className="h-5 w-5" />
                </button>
              </div>
              {story.description && (
                <p className="mt-2 text-novelry-600">{story.description}</p>
              )}
              <p className="mt-2 text-sm text-novelry-500">
                Created on {new Date(story.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {navigationCards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            className="bg-white rounded-lg shadow-sm border border-novelry-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0">
                <card.icon className="h-8 w-8 text-accent-600 group-hover:text-accent-700" />
              </div>
              {'progress' in card && (
                <div className="flex items-center space-x-2">
                  <ChartBar className="h-4 w-4 text-novelry-400" />
                  <span className="text-sm text-novelry-600">
                    {card.progress.completed}/{card.progress.total}
                  </span>
                </div>
              )}
              {'characterCount' in card && (
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-novelry-400" />
                  <span className="text-sm text-novelry-600">
                    {card.characterCount}
                  </span>
                </div>
              )}
            </div>
            <h3 className="mt-4 text-lg font-medium text-novelry-900">{card.title}</h3>
            <p className="mt-2 text-sm text-novelry-500">{card.description}</p>
            {'progress' in card && (
              <div className="mt-4">
                <div className="w-full bg-novelry-100 rounded-full h-2">
                  <div
                    className="bg-accent-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(card.progress.completed / card.progress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-novelry-200">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center text-accent-600 hover:text-accent-700"
        >
          <Trash2 className="h-5 w-5 mr-2" />
          Delete Story
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-novelry-900">Delete Story</h3>
            <p className="mt-2 text-novelry-600">
              Are you sure you want to delete "{story.title}"? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-primary bg-accent-600 hover:bg-accent-700"
              >
                Delete Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}