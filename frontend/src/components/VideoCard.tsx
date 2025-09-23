import { Link } from "react-router-dom";
import { formatNumber } from "../utils/formatters";

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
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    // ... add more intervals for hours, minutes
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <Link to={`/video/${video._id}`} className="flex flex-col">
      <img src={video.thumbnail} alt={video.title} className="w-full rounded-lg aspect-video object-cover" />
      <div className="flex mt-2">
        <img src={video.ownerDetails.avatar} className="w-9 h-9 rounded-full mr-3" />
        <div>
          <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
          <p className="text-xs text-gray-500">{video.ownerDetails.username}</p>
          <p className="text-xs text-gray-500">{formatNumber(video.views)} views • {timeAgo(video.createdAt)}</p>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;