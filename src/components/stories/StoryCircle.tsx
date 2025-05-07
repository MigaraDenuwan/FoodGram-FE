import React from 'react';
import { Link } from 'react-router-dom';
import { Story } from '../../services/storyService';
import { useAuth } from '../../contexts/AuthContext';

interface StoryCircleProps {
  story: Story;
  isFirst?: boolean;
}

const StoryCircle: React.FC<StoryCircleProps> = ({ story, isFirst = false }) => {
  const { user } = useAuth();
  const hasViewed = user && story.viewedBy.includes(user.id);

  return (
    <Link
      to={`/story/${story.id}`}
      className={`flex flex-col items-center ${isFirst ? 'ml-4' : 'ml-2'} mr-2`}
    >
      <div
        className={`${
          hasViewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-accent-500 to-primary-500'
        } p-0.5 rounded-full`}
      >
        <div className="bg-white p-0.5 rounded-full">
          <div
            className="w-16 h-16 rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url(${story.imageUrl})` }}
          />
        </div>
      </div>
      <span className="text-xs mt-1 truncate w-16 text-center">
        {story.username}
      </span>
    </Link>
  );
};

export default StoryCircle;