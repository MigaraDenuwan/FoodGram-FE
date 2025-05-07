import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { getStories, viewStory, deleteStory, Story } from '../services/storyService';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';

const StoryView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const storiesData = await getStories();
        if (storiesData.length === 0) {
          setError('No stories available');
          navigate('/');
        } else {
          setStories(storiesData);
        }
      } catch (error) {
        setError('Error fetching stories');
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (stories.length > 0 && id) {
      const index = stories.findIndex(story => story.id === id);
      if (index !== -1) {
        setCurrentIndex(index);
      } else {
        setError('Story not found');
        navigate('/');
      }
    }
  }, [id, stories, navigate]);

  useEffect(() => {
    if (loading || !user || !stories.length) return;

    const currentStory = stories[currentIndex];
    if (!currentStory) return;

    if (!currentStory.viewedBy.includes(user.id)) {
      viewStory(currentStory.id, user.id)
        .then(() => {
          setStories(prev =>
            prev.map(s =>
              s.id === currentStory.id
                ? { ...s, viewedBy: [...s.viewedBy, user.id] }
                : s
            )
          );
        })
        .catch(error => {
          console.error('Error marking story as viewed:', error);
          setError('Failed to mark story as viewed');
        });
    }

    setProgress(0);
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          if (currentIndex < stories.length - 1) {
            navigate(`/story/${stories[currentIndex + 1].id}`);
          } else {
            navigate('/');
          }
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [currentIndex, loading, navigate, stories, user]);

  const handleClose = () => navigate('/');
  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      navigate(`/story/${stories[currentIndex + 1].id}`);
    } else {
      navigate('/');
    }
  };
  const handlePrevious = () => {
    if (currentIndex > 0) {
      navigate(`/story/${stories[currentIndex - 1].id}`);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;

    try {
      await deleteStory(stories[currentIndex].id);
      navigate('/');
    } catch (err) {
      console.error('Error deleting story:', err);
      setError('Failed to delete story. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <LoadingSpinner color="text-white" size="large" />
      </div>
    );
  }

  if (error || !stories.length) {
    return <div className="text-red-500 p-4">{error || 'No stories available'}</div>;
  }

  const currentStory = stories[currentIndex];
  if (!currentStory) {
    navigate('/');
    return null;
  }

  const isOwnStory = user && currentStory.userId === user.id;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white z-10"
      >
        <X className="h-8 w-8" />
      </button>
      {currentIndex > 0 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}
      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}
      {isOwnStory && (
        <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
          <Link
            to={`/story/${currentStory.id}/edit`}
            className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
            title="Edit Story"
          >
            <Edit2 className="h-5 w-5" />
          </Link>

          <button
            onClick={handleDelete}
            className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
            title="Delete Story"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      )}
      <div className="w-full max-w-md mx-auto h-full max-h-screen">
        <div className="absolute top-4 left-4 right-4 flex space-x-1">
          {stories.map((story, i) => (
            <div
              key={story.id}
              className="h-1 bg-gray-600 rounded-full flex-1 overflow-hidden"
            >
              <div
                className={`h-full bg-white ${
                  i < currentIndex ? 'w-full' : i === currentIndex ? '' : 'w-0'
                }`}
                style={{
                  width: i === currentIndex ? `${progress}%` : i < currentIndex ? '100%' : '0%',
                  transition: i === currentIndex ? 'width linear 50ms' : 'none',
                }}
              />
            </div>
          ))}
        </div>
        <div className="absolute top-8 left-4 right-4 flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden">
            <img
              src={`https://ui-avatars.com/api/?name=${currentStory.username}&background=random`}
              alt={currentStory.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-2">
            <p className="text-white font-medium">{currentStory.username}</p>
            <p className="text-gray-300 text-xs">
              {formatDistanceToNow(new Date(currentStory.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="h-full flex items-center justify-center">
          <img
            src={currentStory.imageUrl}
            alt={currentStory.content}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="absolute text-center bottom-8 left-4 right-4 bg-black bg-opacity-50 p-4 rounded-lg">
          <p className="text-white">{currentStory.content}</p>
        </div>
      </div>
    </div>
  );
};

export default StoryView;