import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getStories, updateStory } from '../../services/storyService';

const StoryEdit: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    getStories().then(stories => {
      const story = stories.find(s => s.id === id);
      if (story && story.userId === user?.id) {
        setContent(story.content);
        setImageUrl(story.imageUrl);
      }
    });
  }, [id, user]);

  const handleUpdate = async () => {
    await updateStory(id!, { content, imageUrl });
    navigate('/');
  };

  return (
    <div className="p-4">
      <h2>Edit Story</h2>
      <input
        className="block mb-2 p-2 border"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Story content"
      />
      <input
        className="block mb-2 p-2 border"
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
        placeholder="Image URL"
      />
      <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">
        Update Story
      </button>
    </div>
  );
};

export default StoryEdit;
