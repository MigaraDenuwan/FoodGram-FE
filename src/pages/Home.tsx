import React, { useState, useEffect } from 'react';
import { getPosts } from '../services/postService';
import { getStories } from '../services/storyService';
import StoriesRow from '../components/stories/StoriesRow';
import RecipeCard from '../components/recipes/RecipeCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { mockPosts, mockStories } from '../utils/mockData';

const Home: React.FC = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [stories, setStories] = useState(mockStories);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        // Try to fetch real data, fall back to mock data
        try {
          const [postsData, storiesData] = await Promise.all([
            getPosts(),
            getStories()
          ]);
          
          setPosts(postsData.length > 0 ? postsData : mockPosts);
          setStories(storiesData.length > 0 ? storiesData : mockStories);
        } catch (error) {
          console.warn('Using mock data due to API error:', error);
          setPosts(mockPosts);
          setStories(mockStories);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  return (
    <div className="pt-4 pb-8">
      {/* Stories */}
      <StoriesRow stories={stories} />
      
      {/* Recipe Feed */}
      <div className="mt-4">
        {posts.map(post => (
          <RecipeCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;