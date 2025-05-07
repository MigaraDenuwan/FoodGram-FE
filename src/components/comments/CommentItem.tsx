import React, { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, Edit2 } from 'lucide-react';
import { Comment } from '../../services/commentService';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

interface CommentItemProps {
  comment: Comment;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  
  const isOwner = user?.id === comment.userId;
  
  const handleUpdate = () => {
    onUpdate(comment.id, editContent);
    setIsEditing(false);
  };
  
  return (
    <div className="flex mb-4">
      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
        <img
          src={`https://ui-avatars.com/api/?name=${comment.username}&background=random`}
          alt={comment.username}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        {isEditing ? (
          <div className="bg-gray-50 p-2 rounded">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-accent-500"
              rows={2}
            />
            <div className="flex justify-end mt-2 space-x-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleUpdate}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 p-2 rounded">
              <span className="font-semibold mr-2">{comment.username}</span>
              <span>{comment.content}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 flex">
              <span>{format(new Date(comment.createdAt), 'MMM d, h:mm a')}</span>
              {isOwner && (
                <div className="ml-auto flex space-x-2">
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="text-gray-600 hover:text-accent-500"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button 
                    onClick={() => onDelete(comment.id)} 
                    className="text-gray-600 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommentItem;