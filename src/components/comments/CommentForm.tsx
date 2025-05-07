import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface CommentFormProps {
  postId: string;
  onSubmit: (content: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onSubmit }) => {
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    onSubmit(comment);
    setComment('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
        <img
          src={`https://ui-avatars.com/api/?name=${user?.username || 'user'}&background=random`}
          alt={user?.username || 'user'}
          className="w-full h-full object-cover"
        />
      </div>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 border-none bg-gray-50 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent-500"
      />
      <button
        type="submit"
        disabled={!comment.trim()}
        className={`ml-2 text-accent-500 ${!comment.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
};

export default CommentForm;