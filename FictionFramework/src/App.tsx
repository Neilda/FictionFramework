import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Plus, PenTool } from 'lucide-react';
import StoryList from './components/StoryList';
import StoryDetail from './components/StoryDetail';
import BeatSheet from './components/BeatSheet';
import CharacterList from './components/CharacterList';
import WorldBuilding from './components/WorldBuilding';
import { useStoryStore } from './store/storyStore';

function CreateStoryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { createStory } = useStoryStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createStory(title, description);
    setTitle('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-novelry-900/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold text-novelry-900 mb-4">Create New Story</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-novelry-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 input-field"
              placeholder="Enter story title..."
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-novelry-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 input-field h-32"
              placeholder="Enter story description..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Story
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Navigation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center group">
                <PenTool className="h-8 w-8 text-accent-700 group-hover:text-accent-800 transition-colors" />
                <span className="ml-3 text-2xl font-serif font-bold text-novelry-900">
                  Fiction<span className="text-accent-700 group-hover:text-accent-800 transition-colors">Framework</span>
                </span>
              </Link>
            </div>
            {isHomePage && (
              <div className="flex items-center">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Story
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <CreateStoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-novelry-50">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<StoryList />} />
            <Route path="/story/:id" element={<StoryDetail />} />
            <Route path="/story/:id/beats" element={<BeatSheet />} />
            <Route path="/story/:id/characters" element={<CharacterList />} />
            <Route path="/story/:id/world" element={<WorldBuilding />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;