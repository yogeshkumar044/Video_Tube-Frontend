import axios from 'axios';

// Function to handle comment upload
export const uploadComment = async (commentData, videoId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await axios.post(`http://localhost:8000/api/v1/comments/${videoId}`, commentData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log(response,"fgyhuijuygtfcghbuytdfcghuyf")
    if (response.status === 201) { // Explicitly handle successful response status
      console.log(response,"ififififififiifififiifiififififififiiffiiffii")

      return response.data;
    } else {
      throw new Error(response.data.message || 'Comment upload failed');
    }
  } catch (err) {
    console.error('Comment upload failed:', err);
    throw err;
  }
};


export const GetVideoComment = async (videoId, query) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await axios.get(`http://localhost:8000/api/v1/comments/${videoId}`, {
      params: query,  
      headers: {
        'Authorization': `Bearer ${token}`, 
      },
    });

    // Destructure the response to get the status code, comments, and total count of comments
    const { statusCode, data, message } = response.data;
    const { comments, totalCount } = data;

    // If the response is successful, return the comments and the total count
    if (statusCode === 200) {
      return { comments, totalCount };
    } else {
      // Throw an error if the response code is not 200
      throw new Error(message || 'Failed to fetch comments');
    }
  } catch (err) {
    // Log the error to the console for debugging
    console.error('Failed to fetch comment:', err);
    // Optionally rethrow the error if needed
    throw err;
  }
};
