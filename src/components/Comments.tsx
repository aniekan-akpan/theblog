import { useState, useEffect } from 'react';
import { STRAPI_URL } from '../utils/strapi';
import type { Comment } from '../utils/strapi';

interface CommentsProps {
  postId: string;
}

interface CommentItemProps {
  comment: Comment;
  onReply?: (commentId: string) => void;
}

function CommentItem({ comment, onReply }: CommentItemProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="border-l-2 border-zinc-800 pl-4">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-zinc-300">
          {comment.authorName.charAt(0).toUpperCase()}
        </div>
        <div>
          {comment.authorWebsite ? (
            <a
              href={comment.authorWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-300 hover:text-blue-400 transition-colors"
            >
              {comment.authorName}
            </a>
          ) : (
            <span className="font-medium text-zinc-300">{comment.authorName}</span>
          )}
          <p className="text-xs text-zinc-500">{formatDate(comment.createdAt)}</p>
        </div>
      </div>
      <p className="mb-2 text-zinc-400 whitespace-pre-wrap">{comment.content}</p>
      {onReply && (
        <button
          onClick={() => onReply(comment.id)}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Reply
        </button>
      )}
    </div>
  );
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    authorWebsite: '',
    content: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${STRAPI_URL}/api/comments?filters[blog_post][documentId][$eq]=${postId}&filters[approved][$eq]=true&populate=parentComment&sort=createdAt:desc`
      );
      const data = await response.json();
      
      const transformedComments = data.data.map((comment: any) => ({
        id: comment.documentId,
        content: comment.content,
        authorName: comment.authorName,
        authorWebsite: comment.authorWebsite,
        approved: comment.approved,
        createdAt: new Date(comment.createdAt),
        parentComment: comment.parentComment ? {
          id: comment.parentComment.documentId,
          content: comment.parentComment.content,
          authorName: comment.parentComment.authorName,
          authorWebsite: comment.parentComment.authorWebsite,
          approved: comment.parentComment.approved,
          createdAt: new Date(comment.parentComment.createdAt),
        } : undefined,
      }));
      
      setComments(transformedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${STRAPI_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            content: formData.content,
            authorName: formData.authorName,
            authorEmail: formData.authorEmail,
            authorWebsite: formData.authorWebsite || undefined,
            blog_post: postId,
            approved: false,
          },
        }),
      });

      if (response.ok) {
        setSuccessMessage('Comment submitted successfully! It will appear after moderation.');
        setFormData({
          authorName: '',
          authorEmail: '',
          authorWebsite: '',
          content: '',
        });
        setShowForm(false);
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        throw new Error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setErrorMessage('Failed to submit comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 border-t border-zinc-800 pt-8">
      <h2 className="mb-6 text-2xl font-bold text-zinc-100">
        Comments ({comments.length})
      </h2>

      {successMessage && (
        <div className="mb-6 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-green-400">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
          {errorMessage}
        </div>
      )}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 rounded-lg border border-blue-500 bg-blue-500/20 px-6 py-3 font-medium text-blue-400 transition-colors hover:bg-blue-500/30"
        >
          Add a Comment
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="authorName" className="mb-1 block text-sm font-medium text-zinc-300">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="authorName"
                required
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: (e.target as HTMLInputElement).value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="authorEmail" className="mb-1 block text-sm font-medium text-zinc-300">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="authorEmail"
                required
                value={formData.authorEmail}
                onChange={(e) => setFormData({ ...formData, authorEmail: (e.target as HTMLInputElement).value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="authorWebsite" className="mb-1 block text-sm font-medium text-zinc-300">
              Website (optional)
            </label>
            <input
              type="url"
              id="authorWebsite"
              value={formData.authorWebsite}
              onChange={(e) => setFormData({ ...formData, authorWebsite: (e.target as HTMLInputElement).value })}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div>
            <label htmlFor="content" className="mb-1 block text-sm font-medium text-zinc-300">
              Comment <span className="text-red-400">*</span>
            </label>
            <textarea
              id="content"
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: (e.target as HTMLTextAreaElement).value })}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Share your thoughts..."
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-lg bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Comment'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-zinc-700 bg-zinc-900/50 px-6 py-2 font-medium text-zinc-300 transition-colors hover:bg-zinc-900"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-zinc-500">
            Your email will not be published. Comments are moderated and will appear after approval.
          </p>
        </form>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-zinc-400">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-zinc-400">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
