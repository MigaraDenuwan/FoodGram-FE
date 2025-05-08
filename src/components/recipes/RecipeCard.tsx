import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Clock, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Post } from '../../services/postService';
import { getProfile } from '../../services/profileService';
import type { Profile } from '../../services/profileService';
import { useAuth } from '../../contexts/AuthContext';

interface RecipeCardProps {
  post: Post;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ post }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!post.userId || !user?.token) {
        setProfile(null);
        return;
      }

      try {
        const profileData = await getProfile(post.userId, user.token);
        setProfile(profileData);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile');
        setProfile(null);
      }
    }

    fetchProfile();
  }, [post.userId, user]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (liked) {
      setLikeCount((prev: number) => prev - 1);
    } else {
      setLikeCount((prev: number) => prev + 1);
    }
    setLiked(!liked);
  };

  // Fallback data for profile picture and display name
  const displayName = profile?.name || post.username || 'User';
  const profilePictureUrl =
    profile?.profilePictureUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=200&background=random`;

  // Parse createdAt to ensure valid date
  const createdAt = new Date(post.createdAt);
  const formattedDate = isNaN(createdAt.getTime())
    ? 'Unknown date'
    : formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <div className="bg-white rounded-lg shadow mb-4 overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="p-4 flex items-center">
        <Link to={`/profile/${post.userId}`} className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
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
          <div className="ml-2">
            <p className="font-medium text-gray-900">{displayName}</p>
          </div>
        </Link>
        <div className="ml-auto">
          <button className="text-gray-500">•••</button>
        </div>
      </div>

      {/* Image */}
      <Link to={`/recipe/${post.id}`}>
        <div className="relative pb-[75%]">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="absolute h-full w-full object-cover"
          />
        </div>
      </Link>

      {/* Action buttons */}
      <div className="p-4 flex items-center">
        <button
          onClick={handleLike}
          className={`mr-4 transition-transform ${liked ? 'text-red-500 scale-110' : 'text-gray-500'}`}
        >
          <Heart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} />
        </button>
        <Link to={`/recipe/${post.id}`} className="mr-4 text-gray-500">
          <MessageCircle className="h-6 w-6" />
        </Link>
        <button className="mr-4 text-gray-500">
          <Share2 className="h-6 w-6" />
        </button>
        <div className="ml-auto flex items-center text-gray-500">
          <Clock className="h-5 w-5 mr-1" />
          <span className="text-sm">{post.cookTime}</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded mb-2 text-xs">
            {error}
          </div>
        )}
        <p className="font-medium mb-1">
          {likeCount} {likeCount === 1 ? 'like' : 'likes'}
        </p>
        <Link to={`/recipe/${post.id}`}>
          <h3 className="font-serif text-xl font-bold mb-1">{post.title}</h3>
          <p className="text-gray-700 line-clamp-2">{post.content}</p>
        </Link>
        <div className="mt-2 flex flex-wrap gap-1">
          {post.tags
            .filter((tag): tag is string => typeof tag === 'string')
            .map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
        </div>
        <p className="text-gray-500 text-xs mt-2">{formattedDate}</p>
      </div>
    </div>
  );
};

export default RecipeCard;