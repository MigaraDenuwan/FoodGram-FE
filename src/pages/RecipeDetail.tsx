import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Clock, ChefHat, ArrowLeft, Trash2, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getPost, deletePost } from '../services/postService';
import { getComments, createComment, deleteComment, updateComment } from '../services/commentService';
import CommentItem from '../components/comments/CommentItem';
import CommentForm from '../components/comments/CommentForm';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { Post } from '../services/postService';
import { Comment } from '../services/commentService';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  
  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      
      try {
        const [recipeData, commentsData] = await Promise.all([
          getPost(id),
          getComments(id)
        ]);
        
        setRecipe(recipeData);
        setComments(commentsData);
        setLikeCount(recipeData.likes);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id]);
  
  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };
  
  const handleAddComment = async (content: string) => {
    if (!user || !recipe) return;
    
    try {
      const newComment = await createComment({
        content,
        postId: recipe.id,
        userId: user.id
      });
      
      setComments(prev => [newComment, ...prev]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  
  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      await updateComment(commentId, content);
      setComments(prev => 
        prev.map(c => c.id === commentId ? { ...c, content } : c)
      );
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };
  
  const handleDeleteRecipe = async () => {
    if (!recipe || !window.confirm('Are you sure you want to delete this recipe?')) return;
    
    try {
      await deletePost(recipe.id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };
  
  if (loading || !recipe) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  const isOwner = user?.id === recipe.userId;
  
  return (
    <div className="pt-4 pb-20 md:pb-8 animate-fade-in">
      <div className="flex items-center mb-4">
        <Link to="/" className="flex items-center text-gray-700">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to feed</span>
        </Link>
        
        {isOwner && (
          <div className="ml-auto flex space-x-2">
            <Link to={`/recipe/edit/${recipe.id}`}> {/* Fixed route */}
              <Button size="sm" variant="outline" icon={<Edit className="h-4 w-4" />}>
                Edit
              </Button>
            </Link>
            <Button
              size="sm"
              variant="danger"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={handleDeleteRecipe}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 flex items-center">
          <Link to={`/profile/${recipe.userId}`} className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <img
                src={`https://ui-avatars.com/api/?name=${recipe.username}&background=random`}
                alt={recipe.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-2">
              <p className="font-medium text-gray-900">{recipe.username}</p>
            </div>
          </Link>
        </div>
        
        <div className="relative pb-[75%]">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="absolute h-full w-full object-cover"
          />
        </div>
        
        <div className="p-4 flex items-center border-b border-gray-100">
          <button 
            onClick={handleLike}
            className={`mr-4 transition-transform ${liked ? 'text-red-500 scale-110' : 'text-gray-500'}`}
          >
            <Heart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} />
          </button>
          <button className="mr-4 text-gray-500">
            <MessageCircle className="h-6 w-6" />
          </button>
          <button className="mr-4 text-gray-500">
            <Share2 className="h-6 w-6" />
          </button>
          <div className="ml-auto flex items-center text-gray-500">
            <Clock className="h-5 w-5 mr-1" />
            <span className="text-sm">{recipe.cookTime}</span>
          </div>
        </div>
        
        <div className="p-6">
          <p className="font-medium mb-2">
            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
          </p>
          
          <h1 className="font-serif text-2xl font-bold mb-2">{recipe.title}</h1>
          <p className="text-gray-700 mb-6">{recipe.content}</p>
          
          <div className="flex items-center mb-4">
            <ChefHat className="h-5 w-5 text-accent-500 mr-2" />
            <span className="font-medium text-gray-800">
              Difficulty: <span className="capitalize">{recipe.difficulty}</span>
            </span>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center text-xs mr-2 mt-0.5">
                    •
                  </span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Instructions</h2>
            <ol className="space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-500 text-white flex items-center justify-center text-sm mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags.map(tag => (
              <span 
                key={tag} 
                className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          <p className="text-gray-500 text-sm">
            Posted {formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Comments ({comments.length})</h2>
        <div className="mb-6">
          <CommentForm postId={recipe.id} onSubmit={handleAddComment} />
        </div>
        
        <div className="space-y-4">
          {comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onDelete={handleDeleteComment}
              onUpdate={handleUpdateComment}
            />
          ))}
          
          {comments.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;