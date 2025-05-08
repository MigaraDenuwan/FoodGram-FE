import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Grid, List, Settings, Plus } from 'lucide-react';
import { getProfile } from '../services/profileService';
import type { Profile } from '../services/profileService';
import { getPosts } from '../services/postService';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  imageUrl: string;
  likes: number;
  cookTime: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  token: string;
}

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth() as { user: User | null };

  const [profile, setProfile] = useState<Profile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState<string | null>(null);

  const isCurrentUser = user?.id === id && !!id;

  useEffect(() => {
    async function fetchData() {
      if (!id || !user || !user.token) {
        console.log('Fetch aborted: Missing id, user, or token', { id, user });
        setError('Invalid user ID or missing authentication');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching profile for userId:', id, 'with token:', user.token);
        const [profileData, postsData] = await Promise.all([
          getProfile(id, user.token),
          getPosts(user.token),
        ]);

        console.log('Profile data:', profileData);
        console.log('Posts data:', postsData);

        setProfile(profileData);
        setUserPosts(postsData.filter((p: Post) => p.userId === id));
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
        setError(error.message || 'Failed to load profile data.');
        setProfile(null);
        setUserPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    console.log('No user authenticated');
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">Please log in to view this profile.</p>
          <Link to="/login" className="inline-block">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Fallback data
  const displayName = profile?.name || user.username || 'User';
  const displayEmail = profile?.email || user.email || 'No email provided';
  const displayBio = profile?.bio || 'No bio provided';
  const profilePictureUrl =
    profile?.profilePictureUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=200&background=random`;

  console.log('Rendering profile with:', { displayName, displayEmail, profilePictureUrl });

  return (
    <div className="pt-4 pb-20 md:pb-8 animate-fade-in">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            <img
              src={profilePictureUrl}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('Image load error, using fallback');
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  displayName
                )}&size=200&background=random`;
              }}
            />
          </div>

          <div className="mt-4 md:mt-0 md:ml-6 flex-grow text-center md:text-left">
            <h1 className="text-2xl font-semibold">{displayName}</h1>
            <p className="text-gray-600 mb-2">{displayBio}</p>
            <p className="text-gray-600 mb-4">{displayEmail}</p>

            {/* <div className="flex justify-center md:justify-start space-x-6">
              <div className="text-center">
                <span className="block font-semibold">{profile?.recipeCount || 0}</span>
                <span className="text-sm text-gray-500">Recipes</span>
              </div>
              <div className="text-center">
                <span className="block font-semibold">{profile?.followers || 0}</span>
                <span className="text-sm text-gray-500">Followers</span>
              </div>
              <div className="text-center">
                <span className="block font-semibold">{profile?.following || 0}</span>
                <span className="text-sm text-gray-500">Following</span>
              </div>
            </div> */}
          </div>

          <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
            {isCurrentUser ? (
              <Link to="/profile/edit">
                <Button variant="outline" icon={<Settings className="h-4 w-4" />}>
                  {profile ? 'Edit Profile' : 'Create Profile'}
                </Button>
              </Link>
            ) : (
              <Button>Follow</Button>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 text-center">
            <p className="text-red-600 mb-4">{error}</p>
          </div>
        )}

        {isCurrentUser && !profile && (
          <div className="mt-4 text-center">
            <p className="text-gray-600 mb-4">You haven't created a profile yet.</p>
            <Link to="/profile/edit" className="inline-block">
              <Button>Create Your Profile</Button>
            </Link>
          </div>
        )}
      </div>

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
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">{post.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {post.likes} likes • {post.cookTime}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {userPosts.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">No recipes yet</p>
          {isCurrentUser && (
            <Link to="/recipe/create">
              <Button icon={<Plus className="h-4 w-4" />}>Create Your First Recipe</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;