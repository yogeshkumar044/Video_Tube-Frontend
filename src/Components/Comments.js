import React, { useState, useEffect } from 'react';
import { uploadComment, GetVideoComment } from '../Utilis/CommentService';
import { getUserData } from '../Utilis/GetUserDataService';
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from 'react-router-dom';

const CommentSection = ({ video }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [userCache, setUserCache] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const videoId = video?._id;

  const fetchComments = async (pageNumber) => {
    if (!hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const queryParams = { page: pageNumber, limit: 5 };
      const response = await GetVideoComment(videoId, queryParams);

      const fetchedComments = response?.comments || [];
      const totalComments = response?.totalCount || 0;

      setComments((prevComments) => {
        const newComments = fetchedComments.filter(
          (newComment) => !prevComments.some((prevComment) => prevComment._id === newComment._id)
        );
        return [...prevComments, ...newComments];
      });

      setHasMore(fetchedComments.length > 0 && (pageNumber * queryParams.limit < totalComments));

      fetchedComments.forEach(async (comment) => {
        if (!userCache[comment.owner]) {
          const userData = await getUserData(localStorage.getItem('authToken'), comment.owner);
          setUserCache((prev) => ({ ...prev, [comment.owner]: userData }));
        }
      });

    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchComments(page);
    }
  }, [videoId, page]);

  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    const commentData = {
      content: comment,
      video: videoId,
    };

    try {
      // Step 1: Upload the new comment
      const response = await uploadComment(commentData);

      if (response) {
        const newComment = response.data;
        
        // Step 2: Append the new comment to the current comment list
        setComments((prevComments) => [newComment, ...prevComments]);
        
        // Step 3: Fetch owner data for the newly added comment (if not already cached)
        if (!userCache[newComment.owner]) {
          const userData = await getUserData(localStorage.getItem('authToken'), newComment.owner);
          setUserCache((prev) => ({ ...prev, [newComment.owner]: userData }));
        }
        
        // Clear the input field after posting
        setComment('');
      } else {
        throw new Error('Failed to upload comment.');
      }
    } catch (err) {
      setError(err?.message || 'Failed to upload comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreComments = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="comment-section text-white bg-transparent backdrop-blur-lg p-4 rounded-lg shadow-lg border border-transparent">
      <h2 className="text-lg font-semibold mb-4 text-white">Comments</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={comment}
          onChange={handleInputChange}
          placeholder="Write a comment..."
          className="w-full border border-gray-300 rounded p-2 mb-2 text-gray-100 bg-gray-500 bg-opacity-80"
          rows="2"
          required  
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <InfiniteScroll
        dataLength={comments.length}
        next={fetchMoreComments}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>No more comments to display</b>
          </p>
        }
      >
        <ul className="comment-list">
          {comments.length > 0 ? comments.map((comment) => (
            <li key={comment._id} className="mb-4 p-2 border-b border-gray-300 flex items-start">
              <Link to={`/channel/${userCache[comment.owner]?.username}`} className="mr-3">
                <img
                  src={userCache[comment.owner]?.avatar || '/default-avatar.png'}
                  alt={`${userCache[comment.owner]?.username || 'User'}'s avatar`}
                  className="w-10 h-10 rounded-full"
                />
              </Link>
              <div className="flex-1">
                <Link to={`/channel/${userCache[comment.owner]?.username}`} className=" font-bold hover:underline">
                  @{userCache[comment.owner]?.username || 'Loading...'}
                </Link>
                <p className="text-white">{comment.content || 'No content available'}</p>
              </div>
            </li>
          )) : (
            <li>No comments yet.</li>
          )}
        </ul>
      </InfiniteScroll>
    </div>
  );
};

export default CommentSection;
