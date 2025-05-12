import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getPosts } from '../services/postService';
import type { Post } from '../services/postService';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await getPosts(searchQuery);
        setResults(data);
      } catch (err: any) {
        console.error('Search failed:', err);
        setError('Failed to fetch search results.');
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [searchQuery]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for "{searchQuery}"
      </h1>

      {results.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {results.map((post) => (
            <Link
              key={post.id}
              to={`/recipe/${post.id}`}
              className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-[1.01]"
            >
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/400x300?text=Image+Unavailable`;
                  }}
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 line-clamp-1">{post.title}</h2>
                <p className="text-gray-600 line-clamp-3">{post.content}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
