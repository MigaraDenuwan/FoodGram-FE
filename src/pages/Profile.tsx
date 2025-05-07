import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Grid, List, Settings, Plus } from 'lucide-react';
import { getProfile } from '../services/profileService';
import { getPosts } from '../services/postService';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  // Define the ProfileType interface
  interface ProfileType {
    id: string;
    name: string;
    bio: string;
    avatarUrl?: string;
    recipeCount: number;
    followers: number;
    following: number;
  }
  
    const [profile, setProfile] = useState<ProfileType | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]); // Replace with actual Post interface
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const isCurrentUser = user?.id === id;

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        const [profileData, postsData] = await Promise.all([
          getProfile(id),
          getPosts(),
        ]);

        setProfile(profileData);
        setUserPosts(postsData.filter((p) => p.userId === id));
      } catch (error) {
        console.error('Error fetching data:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">Profile not found</p>
          {isCurrentUser && (
            <Link to="/profile/edit">
              <Button>Create Your Profile</Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-20 md:pb-8 animate-fade-in">
      {/* Profile header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            <img
              src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.name}&size=200&background=random`}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile info */}
          <div className="mt-4 md:mt-0 md:ml-6 flex-grow text-center md:text-left">
            <h1 className="text-2xl font-semibold">{profile.name}</h1>
            <p className="text-gray-600 mb-4">{profile.bio}</p>

            <div className="flex justify-center md:justify-start space-x-6">
              <div className="text-center">
                <span className="block font-semibold">{profile.recipeCount}</span>
                <span className="text-sm text-gray-500">Recipes</span>
              </div>
              <div className="text-center">
                <span className="block font-semibold">{profile.followers}</span>
                <span className="text-sm text-gray-500">Followers</span>
              </div>
              <div className="text-center">
                <span className="block font-semibold">{profile.following}</span>
                <span className="text-sm text-gray-500">Following</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
            {isCurrentUser ? (
              <Link to="/profile/edit">
                <Button variant="outline" icon={<Settings className="h-4 w-4" />}>
                  Edit Profile
                </Button>
              </Link>
            ) : (
              <Button>Follow</Button>
            )}
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid' ? 'bg-accent-50 text-accent-500' : 'text-gray-500'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list' ? 'bg-accent-50 text-accent-500' : 'text-gray-500'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>

          {isCurrentUser && (
            <Link to="/recipe/create">
              <Button size="sm" icon={<Plus className="h-4 w-4" />}>
                New Recipe
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Recipes */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {userPosts.map((post) => (
            <Link
              key={post.id}
              to={`/recipe/${post.id}`}
              className="bg-white rounded-lg shadow overflow-hidden transform transition hover:scale-[1.02]"
            >
              <div className="relative pb-[100%]">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="absolute h-full w-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm line-clamp-1">{post.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {post.likes} likes • {post.cookTime}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {userPosts.map((post) => (
            <Link
              key={post.id}
              to={`/recipe/${post.id}`}
              className="bg-white rounded-lg shadow overflow-hidden block hover:shadow-md transition"
            >
              <div className="flex">
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 flex-grow">
                  <h3 className="font-medium line-clamp-1">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {post.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {post.likes} likes • {post.cookTime}
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {userPosts.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 mb-4">No recipes yet</p>
              {isCurrentUser && (
                <Link to="/recipe/create">
                  <Button icon={<Plus className="h-4 w-4" />}>
                    Create Your First Recipe
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;