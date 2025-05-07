import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getStories, viewStory } from '../services/storyService';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { mockStories } from '../utils/mockData';

const StoryView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [stories, setStories] = useState(mockStories);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const storiesData = await getStories();
        setStories(storiesData); // <- remove fallback to mockStories
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, []);
  
  
  // Find current story index from the id
  useEffect(() => {
    if (stories.length > 0 && id) {
      const index = stories.findIndex(story => story.id === id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [id, stories]);
  
  // Mark story as viewed and progress bar
  useEffect(() => {
    if (loading || !user || !stories.length) return;
    
    const currentStory = stories[currentIndex];
    if (!currentStory) return;
    
    // Mark as viewed
    if (!currentStory.viewedBy.includes(user.id)) {
      try {
        viewStory(currentStory.id, user.id);
        
        // Update local state
        setStories(prev => 
          prev.map(s => 
            s.id === currentStory.id 
              ? { ...s, viewedBy: [...s.viewedBy, user.id] } 
              : s
          )
        );
      } catch (error) {
        console.error('Error marking story as viewed:', error);
      }
    }
    
    // Progress bar
    setProgress(0);
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          // Go to next story
          if (currentIndex < stories.length - 1) {
            navigate(`/story/${stories[currentIndex + 1].id}`);
          } else {
            navigate('/');
          }
          return 0;
        }
        return prev + 1;
      });
    }, 50); // 5 seconds total (50ms * 100)
    
    return () => clearInterval(timer);
  }, [currentIndex, loading, navigate, stories, user]);
  
  const handleClose = () => {
    navigate('/');
  };
  
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
  
  if (loading || !stories.length) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <LoadingSpinner color="text-white" size="large" />
      </div>
    );
  }
  
  const currentStory = stories[currentIndex];
  if (!currentStory) {
    navigate('/');
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white z-10"
      >
        <X className="h-8 w-8" />
      </button>
      
      {/* Navigation buttons */}
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
      
      {/* Content */}
      <div className="w-full max-w-md mx-auto h-full max-h-screen">
        {/* Progress bars */}
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
                  transition: i === currentIndex ? 'width linear 50ms' : 'none'
                }}
              />
            </div>
          ))}
        </div>
        
        {/* User info */}
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
        
        {/* Story image */}
        <div className="h-full flex items-center justify-center">
          <img
            src={currentStory.imageUrl}
            alt={currentStory.content}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        
        {/* Story content */}
        <div className="absolute bottom-8 left-4 right-4 bg-black bg-opacity-50 p-4 rounded-lg">
          <p className="text-white">{currentStory.content}</p>
        </div>
      </div>
    </div>
  );
};

export default StoryView;