import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, BookOpen } from 'lucide-react';
import { useStoryStore } from '../store/storyStore';

export default function StoryList() {
  const { stories, deleteStory } = useStoryStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-novelry-900">Your Stories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div
            key={story.id}
            className="bg-white rounded-lg shadow-sm border border-novelry-200 overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className="aspect-video bg-gradient-to-br from-accent-50 to-accent-100 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-accent-300 group-hover:text-accent-400 transition-colors" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3
                  className="text-xl font-medium text-novelry-900 cursor-pointer hover:text-accent-700"
                  onClick={() => navigate(`/story/${story.id}`)}
                >
                  {story.title}
                </h3>
                <button
                  onClick={() => deleteStory(story.id)}
                  className="text-novelry-400 hover:text-accent-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              {story.description && (
                <p className="mt-2 text-novelry-600 line-clamp-3">{story.description}</p>
              )}
              <p className="mt-4 text-sm text-novelry-500">
                Created: {new Date(story.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}

        {stories.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-novelry-600">No stories yet. Click "Create Story" to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}