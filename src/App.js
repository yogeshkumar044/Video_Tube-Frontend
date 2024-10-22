import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import React, { useState, useContext } from "react";
import Sidebar from "./Components/Sidebar";
import { LoginContext } from './Context/LoginContext';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoggedIn } = useContext(LoginContext); // Get login state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Fixed navbar - Only show if user is logged in */}
      {isLoggedIn && (
        <div className="fixed top-0 left-0 right-0 z-10 w-full bg-white shadow">
          <Navbar onSidebarToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </div>
      )}

      {/* Main container */}
      <div className="flex mt-16 w-full">
        {isSidebarOpen && (
          <div className="w-1/8">
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
          </div>
        )}
        <div className={`${isSidebarOpen ? 'w-7/8' : 'w-full'} transition-transform duration-300`}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;






// import React, { useEffect, useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { LoginContext } from '../Context/LoginContext';
// import { getAllVideos } from '../Utilis/GetAllVideosService';
// import VideoCard from './Video/VideoCard';
// import InfiniteScroll from 'react-infinite-scroll-component';

// const Home = () => {
//   const { isLoggedIn } = useContext(LoginContext);
//   const [videos, setVideos] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [authLoading, setAuthLoading] = useState(true);
//   const navigate = useNavigate();

//   const fetchVideos = async (pageNumber) => {
//     try {
//       const fetchedVideos = await getAllVideos(pageNumber);
//       if (!Array.isArray(fetchedVideos)) return [];
      
//       setVideos((prevVideos) => {
//         const newVideos = fetchedVideos.filter(
//           (newVideo) => !prevVideos.some((prevVideo) => prevVideo._id === newVideo._id)
//         );

//         if (newVideos.length === 0) setHasMore(false);
//         return [...prevVideos, ...newVideos];
//       });
      
//       setHasMore(fetchedVideos.length > 0);
//     } catch (err) {
//       console.error('Failed to load videos:', err);
//       setHasMore(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos(page);
//   }, [page]);

//   useEffect(() => {
//     const checkAuth = async () => {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       setAuthLoading(false);
//     };

//     checkAuth();
//   }, []);

//   useEffect(() => {
//     if (!isLoggedIn && !authLoading) {
//       navigate('/login');
//     }
//   }, [isLoggedIn, authLoading, navigate]);

//   return (
//     <div className="bg-transparent   min-h-screen flex flex-col items-center justify-start">
//       <InfiniteScroll
//         dataLength={videos.length}
//         next={() => setPage((prevPage) => prevPage + 1)}
//         hasMore={hasMore}
//         loader={<h4 className="text-gray-400 animate-pulse">Loading more videos...</h4>}
//         endMessage={
//           <p className="text-center text-gray-400">
//             <b>No more videos to display</b>
//           </p>
//         }
//         className="w-full"
//       >
//         <div className="max-w-7xl mx-auto px-4 py-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {videos.map((video) => (
//               <VideoCard key={video._id} video={video} />
//             ))}
//           </div>
//           {videos.length === 0 && (
//             <p className="text-center mt-6 text-gray-400">No videos available</p>
//           )}
//         </div>
//       </InfiniteScroll>
//     </div>
//   );
// };

// export default Home;
