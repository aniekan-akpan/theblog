import { useState, useEffect } from 'react';
import { STRAPI_URL } from '../utils/strapi';

interface LikeButtonProps {
  postId: string;
  initialLikeCount: number;
}

// Generate or retrieve session ID from localStorage
const getSessionId = () => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

export default function LikeButton({ postId, initialLikeCount }: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(getSessionId);

  // Check if user has already liked this post
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await fetch(
          `${STRAPI_URL}/api/likes?filters[blog_post][documentId][$eq]=${postId}&filters[sessionId][$eq]=${sessionId}`
        );
        const data = await response.json();
        setIsLiked(data.data.length > 0);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [postId, sessionId]);

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isLiked) {
        // Unlike: First find the like ID
        const findResponse = await fetch(
          `${STRAPI_URL}/api/likes?filters[blog_post][documentId][$eq]=${postId}&filters[sessionId][$eq]=${sessionId}`
        );
        const findData = await findResponse.json();
        
        if (findData.data.length > 0) {
          const likeId = findData.data[0].id;
          
          const response = await fetch(
            `${STRAPI_URL}/api/likes/${likeId}?sessionId=${sessionId}`,
            {
              method: 'DELETE',
            }
          );

          if (response.ok) {
            setIsLiked(false);
            setLikeCount(prev => prev - 1);
          }
        }
      } else {
        // Like
        const response = await fetch(`${STRAPI_URL}/api/likes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              blog_post: postId,
              sessionId: sessionId,
            },
          }),
        });

        if (response.ok) {
          setIsLiked(true);
          setLikeCount(prev => prev + 1);
        } else {
          const error = await response.json();
          console.error('Error liking post:', error);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`group inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-all ${
        isLiked
          ? 'border-red-500/50 bg-red-500/20 text-red-400 hover:bg-red-500/30'
          : 'border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
    >
      <svg
        className={`h-5 w-5 transition-transform ${isLiked ? 'scale-110' : 'group-hover:scale-110'}`}
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{likeCount}</span>
    </button>
  );
}
