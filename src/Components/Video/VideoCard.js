import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { LoginContext } from '../../Context/LoginContext';
import { getUserData } from '../../Utilis/GetUserDataService';
import { formatRelativeTime } from "../../Utilis/TimeFormatingUtil";

const VideoCard = ({ video,onupdateVideo }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [owner, setOwner] = useState(null);
  const [error, setError] = useState('');

  const { videoFile, thumbnail, title, duration, views, owner: ownerId, createdAt } = video;
  const formattedDuration = `${Math.floor(duration / 60)}:${('0' + Math.floor(duration % 60)).slice(-2)}`;
  const { isLoggedIn } = useContext(LoginContext);
  const token = localStorage.getItem('authToken');
  const uploadAt = formatRelativeTime(createdAt);

  // Fetch owner data
  useEffect(() => {
    const fetchOwnerProfile = async () => {
      try {
        const ownerData = await getUserData(token, ownerId);
        setOwner(ownerData);
      } catch (err) {
        console.error('Error fetching owner data:', err);
        setError('Failed to load owner profile');
      }
    };

    if (ownerId) {
      fetchOwnerProfile();
    }
  }, [ownerId, token]);


  return (
    <div
      className="w-[280px] bg-transparent rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail or video preview */}
      <div className="relative w-full pb-[56.25%] bg-gray-700 rounded-lg">
        <Link to={`/video/${encodeURIComponent(title)}`} state={{ video, owner ,}}>
          {isHovered ? (
            <video
              src={videoFile}
              muted
              autoPlay
              loop
              className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <img
              src={thumbnail}
              alt={title}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
            />
          )}
        </Link>
        <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded">
          {formattedDuration}
        </span>
      </div>

      {/* Video metadata */}
      <div className="flex mt-3 px-2">
        {error ? (
          <span className="text-red-500">{error}</span>
        ) : owner ? (
          <Link to={`/channel/${owner.username}`} state={{ owner }} className="flex-shrink-0">
            <img
              src={owner.avatar}
              alt={`${owner.username}'s avatar`}
              className="w-10 h-10 rounded-full mr-2 border-2 border-transparent hover:border-white"
            />
          </Link>
        ) : (
          <span>Loading...</span>
        )}

        <div className="flex flex-col justify-between w-full ml-2">
          {/* Video title */}
          <Link to={`/video/${encodeURIComponent(title)}`} state={{ video, owner }}>
            <h3 className="text-white text-sm font-semibold truncate hover:underline" title={title}>
              {title}
            </h3>
          </Link>

          {/* Owner/Channel and Views */}
          {owner && (
            <Link to={`/channel/${owner.username}`} state={{ owner }} className="text-gray-400 text-xs hover:underline">
              {owner.username}
            </Link>
          )}
          <div className="text-gray-400 text-xs flex justify-between mt-1">
            <span className="mr-2">{views.toLocaleString()} views <span className="ml-2 mr-2">|</span> {uploadAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
