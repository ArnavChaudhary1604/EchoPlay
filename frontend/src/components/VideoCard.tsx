import { Link } from "react-router-dom";
import { Card } from "./ui/Card";
import { formatNumber, timeAgo } from "../lib/utils";
import { Play, Eye } from "lucide-react";

type Video = {
  _id: string;
  thumbnail: string;
  title: string;
  owner: {
    username: string;
    avatar: string;
    fullName: string;
  };
  views: number;
  createdAt: string;
};

interface VideoCardProps {
  video: Video;
}

function VideoCard({ video }: VideoCardProps) {
  return (
    <Link to={`/video/${video._id}`} className="group block">
      <Card variant="video" hover={true}>
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden rounded-xl mb-4">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex space-x-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={video.owner.avatar}
                alt={video.owner.username}
                className="w-10 h-10 rounded-full object-cover border-2 border-border"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {video.title}
              </h3>
              
              <p className="text-sm text-text-secondary mb-1 hover:text-text-primary transition-colors">
                {video.owner.username}
              </p>
              
              <div className="flex items-center space-x-4 text-xs text-text-muted">
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{formatNumber(video.views)} views</span>
                </div>
                <span>•</span>
                <span>{timeAgo(video.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default VideoCard;