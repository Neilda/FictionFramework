import { create } from 'zustand';
import { Story } from '../types';
import { supabase } from '../lib/supabase';

interface StoryState {
  stories: Story[];
  currentStory: Story | null;
  loading: boolean;
  fetchStories: () => Promise<void>;
  createStory: (title: string, description: string) => Promise<void>;
  updateStory: (id: string, updates: Partial<Story>) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
  setCurrentStory: (story: Story | null) => void;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  stories: [],
  currentStory: null,
  loading: false,

  fetchStories: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stories:', error);
      return;
    }

    set({ stories: data as Story[], loading: false });
  },

  createStory: async (title: string, description: string) => {
    const { data, error } = await supabase
      .from('stories')
      .insert([{ title, description }])
      .select()
      .single();

    if (error) {
      console.error('Error creating story:', error);
      return;
    }

    set((state) => ({
      stories: [data as Story, ...state.stories],
    }));
  },

  updateStory: async (id: string, updates: Partial<Story>) => {
    const { data, error } = await supabase
      .from('stories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating story:', error);
      return;
    }

    set((state) => ({
      stories: state.stories.map((story) =>
        story.id === id ? { ...story, ...data } : story
      ),
    }));
  },

  deleteStory: async (id: string) => {
    const { error } = await supabase.from('stories').delete().eq('id', id);

    if (error) {
      console.error('Error deleting story:', error);
      return;
    }

    set((state) => ({
      stories: state.stories.filter((story) => story.id !== id),
      currentStory: state.currentStory?.id === id ? null : state.currentStory,
    }));
  },

  setCurrentStory: (story) => set({ currentStory: story }),
}));