import { Link } from "react-router-dom";

// Helper function for formatting numbers
const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

// Helper function for time ago
const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

type Video = {
  _id: string;
  thumbnail: string;
  title: string;
  ownerDetails: {
    username: string;
    avatar: string;
  };
  views: number;
  createdAt: string;
};

interface VideoCardProps {
  video: Video;
}

function VideoCard({ video }: VideoCardProps) {
  return (
    <Link to={`/video/${video._id}`} className="flex flex-col group">
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-auto object-cover rounded-xl aspect-video transition-transform duration-300 group-hover:rounded-none"
        />
      </div>
      <div className="flex mt-3 space-x-3">
        <img
          src={video.ownerDetails.avatar}
          alt={video.ownerDetails.username}
          className="w-9 h-9 rounded-full flex-shrink-0 mt-0.5"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-100 line-clamp-2">{video.title}</h3>
          <p className="text-xs text-gray-400 mt-1">{video.ownerDetails.username}</p>
          <div className="flex items-center text-xs text-gray-400 mt-1">
            <span>{formatNumber(video.views)} views</span>
            <span className="mx-1.5 text-gray-500">•</span>
            <span>{timeAgo(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;