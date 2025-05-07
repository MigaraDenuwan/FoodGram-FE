import React, { useState, useEffect } from 'react';
import { getPosts } from '../services/postService';
import { getStories } from '../services/storyService';
import StoriesRow from '../components/stories/StoriesRow';
import RecipeCard from '../components/recipes/RecipeCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsData, storiesData] = await Promise.all([
          getPosts('your-token-here'), // Replace with actual token or auth mechanism
          getStories(),
        ]);
        setPosts(postsData);
        setStories(storiesData);
      } catch (error: any) {
        setError(error.message || 'Failed to load data');
        console.error('Error fetching data:', error);
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

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
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