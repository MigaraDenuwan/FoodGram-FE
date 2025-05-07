import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Story } from '../../services/storyService';
import StoryCircle from './StoryCircle';
import { useAuth } from '../../contexts/AuthContext';

interface StoriesRowProps {
  stories: Story[];
}

const StoriesRow: React.FC<StoriesRowProps> = ({ stories }) => {
  const { user } = useAuth();
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex overflow-x-auto scrollbar-hide">
        {/* Create story button */}
        {user && (
          <Link
            to="/story/create"
            className="flex flex-col items-center ml-4 mr-2"
          >
            <div className="bg-gray-100 p-0.5 rounded-full">
              <div className="bg-white p-0.5 rounded-full">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <PlusCircle className="h-8 w-8 text-accent-500" />
                </div>
              </div>
            </div>
            <span className="text-xs mt-1 text-center">Create</span>
          </Link>
        )}

        {/* Story circles */}
        {stories.map((story, index) => (
          <StoryCircle key={story.id} story={story} isFirst={index === 0} />
        ))}
      </div>
    </div>
  );
};

export default StoriesRow;