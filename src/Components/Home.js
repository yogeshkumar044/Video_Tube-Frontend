import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../Context/LoginContext';
import { SearchContext } from '../Context/SearchContext';
import { getAllVideos } from '../Utilis/GetAllVideosService';
import VideoCard from './Video/VideoCard';
import InfiniteScroll from 'react-infinite-scroll-component';

const Home = () => {
  const { isLoggedIn } = useContext(LoginContext);
  const { Searchquery, setSearchquery } = useContext(SearchContext);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Reset search query on page load/refresh
  useEffect(() => {
    setSearchquery('');
    return () => {
      setVideos([]);
      setPage(1);
    };
  }, []);

  const fetchVideos = useCallback(async (pageNumber, searchQuery) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await getAllVideos(pageNumber, 12, searchQuery || '');
      const fetchedVideos = response.data;

      if (!Array.isArray(fetchedVideos)) {
        throw new Error('Invalid response format');
      }

      setVideos(prevVideos => {
        if (pageNumber === 1) {
          return fetchedVideos;
        }
        
        const newVideos = fetchedVideos.filter(
          newVideo => !prevVideos.some(prevVideo => prevVideo._id === newVideo._id)
        );
        
        return [...prevVideos, ...newVideos];
      });

      setHasMore(fetchedVideos.length > 0);
    } catch (err) {
      console.error('Failed to load videos:', err);
      setError('Failed to load videos. Please try again later.');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setVideos([]);
    setPage(1);
    setHasMore(true);
    fetchVideos(1, Searchquery);
  }, [Searchquery, fetchVideos]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchVideos(nextPage, Searchquery);
    }
  };

  const handleRetry = () => {
    setError(null);
    setPage(1);
    fetchVideos(1, Searchquery);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-lime-600">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button
            onClick={handleRetry}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent min-h-screen  p-4">
      <InfiniteScroll
        dataLength={videos.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center p-4">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
        endMessage={
          videos.length > 0 ? (
            <p className="text-center text-gray-500 p-4">
              You've reached the end!
            </p>
          ) : null
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-8 ml-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>

        {videos.length === 0 && !isLoading && (
          <div className="text-center text-gray-400 p-4">
            {Searchquery ? 'No videos found matching your search.' : 'No videos available.'}
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
};

export default Home;










// import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { LoginContext } from '../Context/LoginContext';
// import { getAllVideos } from '../Utilis/GetAllVideosService';
// import VideoCard from './Video/VideoCard';
// import { ClipLoader } from 'react-spinners'; // Spinner for loading indicator

// const VIDEOS_PER_PAGE = 12; // Adjust number of videos to load

// const Home = () => {
//   const { isLoggedIn } = useContext(LoginContext);
//   const [videos, setVideos] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [authLoading, setAuthLoading] = useState(true);
//   const navigate = useNavigate();
//   const containerRef = useRef(null);
//   const [scrollPosition, setScrollPosition] = useState(0);

//   const fetchVideos = async (pageNumber) => {
//     setLoading(true); // Start loading when fetching
//     try {
//       const fetchedVideos = await getAllVideos(pageNumber);
//       if (!Array.isArray(fetchedVideos) || fetchedVideos.length === 0) {
//         setHasMore(false); // No more videos to load
//         return;
//       }

//       setVideos((prevVideos) => {
//         const newVideos = fetchedVideos.filter(
//           (newVideo) => !prevVideos.some((prevVideo) => prevVideo._id === newVideo._id)
//         );
//         return [...prevVideos, ...newVideos];
//       });
//     } catch (err) {
//       console.error('Failed to load videos:', err);
//       setHasMore(false);
//     } finally {
//       setLoading(false); // Stop loading when fetch is complete
//     }
//   };

//   // Initial video fetch
//   useEffect(() => {
//     if (hasMore && !loading && videos.length < VIDEOS_PER_PAGE * page) {
//       fetchVideos(page);
//     }
//   }, [page, hasMore, loading, videos.length]);

//   useEffect(() => {
//     const checkAuth = async () => {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       setAuthLoading(false);
//     };

//     checkAuth();
//   }, []);

//   // Redirect to login if not logged in
//   useEffect(() => {
//     if (!isLoggedIn && !authLoading) {
//       navigate('/login');
//     }
//   }, [isLoggedIn, authLoading, navigate]);

//   // Handle scrolling for infinite scroll
//   const handleScroll = useCallback(() => {
//     if (containerRef.current) {
//       const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

//       // If we scroll near the bottom, fetch the next page
//       if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loading) {
//         setPage((prevPage) => prevPage + 1);
//       }

//       setScrollPosition(scrollTop);
//     }
//   }, [hasMore, loading]);

//   // Attach the scroll listener
//   useEffect(() => {
//     const container = containerRef.current;
//     if (container) {
//       container.addEventListener('scroll', handleScroll);
//     }

//     return () => {
//       if (container) {
//         container.removeEventListener('scroll', handleScroll);
//       }
//     };
//   }, [handleScroll]);

//   // Function to generate a random Y position
//   const getCardYPosition = (index) => {
//     // Randomly vary the Y position for each card for a more dynamic effect
//     const randomOffset = Math.random() * 50; // Random offset from 0 to 50 pixels
//     return index * 20 + randomOffset; // Combine with index for stacking
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="w-90vh h-screen mx-10 overflow-y-auto bg-slate-500 py-5 my-5"
//       style={{
//         maxHeight: '100vh', // Set max height to viewport height
//         overflowX: 'hidden', // Prevent horizontal scrolling
//       }}
//     >
//       <div className="flex flex-wrap justify-center gap-4">
//         <AnimatePresence>
//           {videos.map((video, index) => (
//             <motion.div
//               key={video._id}
//               className="relative"
//               style={{
//                 width: '90%', // Set width of each card
//                 aspectRatio: '16 / 9', // Maintain a specific aspect ratio for video cards
//               }}
//               initial={{ opacity: 0, y: -100 }} // Start from above the screen
//               animate={{ opacity: 1, y: getCardYPosition(index) }} // Use the modified positioning
//               exit={{ opacity: 0, y: -100 }} // Exit upwards
//               transition={{
//                 type: 'spring',
//                 stiffness: 300, // Lower stiffness for more bounce
//                 damping: 25, // Damping for smoothness
//               }}
//             >
//               <VideoCard video={video} />
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>

//       {/* Infinite Scroll Loading Indicator */}
//       {loading && (
//         <div className="flex justify-center items-center mt-4">
//           <ClipLoader color="#ffffff" loading={loading} size={50} />
//         </div>
//       )}

//       {videos.length === 0 && !hasMore && (
//         <div className="absolute inset-0 flex justify-center items-center bg-red-400 bg-opacity-50 text-white">
//           <p className="text-center">
//             <b>No videos available</b>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;
