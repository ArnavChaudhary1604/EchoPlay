import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ThumbsUp, ThumbsDown, Share, Download, User, Send, Heart } from "lucide-react";
import { formatNumber, timeAgo } from "../lib/utils.ts";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token || !id) {
          setError("Video not found or authentication required.");
          setLoading(false);
          return;
        }

        // Simulate video data - replace with actual API call
        setVideo({
          _id: id,
          title: "React 19 New Features: Complete Guide",
          description: "In this comprehensive tutorial, we'll explore all the exciting new features coming in React 19...",
          videoFile: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          thumbnail: "https://via.placeholder.com/1280x720",
          views: 15420,
          likes: 1234,
          dislikes: 45,
          createdAt: "2024-01-15T10:30:00Z",
          ownerDetails: {
            username: "TechGuru",
            avatar: "https://via.placeholder.com/60",
            subscribers: "1.2M"
          }
        });

        setComments([
          {
            _id: "1",
            content: "Great explanation! Really helped me understand the new features.",
            createdAt: "2024-01-16T08:30:00Z",
            owner: {
              username: "DevLearner",
              avatar: "https://via.placeholder.com/40"
            }
          },
          {
            _id: "2", 
            content: "Can't wait to try these in my next project!",
            createdAt: "2024-01-16T09:15:00Z",
            owner: {
              username: "CodeExplorer",
              avatar: "https://via.placeholder.com/40"
            }
          }
        ]);
      } catch (err) {
        setError("Failed to load video.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const handleLike = async () => {
    // Implement like functionality
    console.log("Like clicked");
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // Implement comment functionality
    console.log("Comment:", newComment);
    setNewComment("");
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="w-full h-96 bg-surface-light rounded-xl mb-6"></div>
            <div className="h-8 bg-surface-light rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-surface-light rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="text-center max-w-md">
          <div className="text-error text-6xl mb-4">📹</div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Video not found</h2>
          <p className="text-text-secondary">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Section */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="relative aspect-video mb-6 rounded-xl overflow-hidden shadow-xl">
            <video
              src={video.videoFile}
              poster={video.thumbnail}
              controls
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video Info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-primary mb-4">{video.title}</h1>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-4 text-text-secondary">
                <span className="flex items-center">
                  {formatNumber(video.views)} views
                </span>
                <span>•</span>
                <span>{timeAgo(video.createdAt)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" className="flex items-center space-x-2" onClick={handleLike}>
                  <ThumbsUp className="w-5 h-5" />
                  <span>{formatNumber(video.likes)}</span>
                </Button>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <ThumbsDown className="w-5 h-5" />
                  <span>{formatNumber(video.dislikes)}</span>
                </Button>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Share className="w-5 h-5" />
                  <span>Share</span>
                </Button>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Save</span>
                </Button>
              </div>
            </div>

            {/* Channel Info */}
            <Card className="!p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={video.ownerDetails.avatar}
                    alt={video.ownerDetails.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-text-primary">{video.ownerDetails.username}</h3>
                    <p className="text-sm text-text-secondary">{video.ownerDetails.subscribers} subscribers</p>
                  </div>
                </div>
                <Button variant="accent">Subscribe</Button>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-text-secondary leading-relaxed">{video.description}</p>
              </div>
            </Card>
          </div>

          {/* Comments Section */}
          <Card className="!p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Comments ({comments.length})
            </h3>

            {/* Add Comment */}
            <form onSubmit={handleComment} className="mb-6">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" type="button">
                      Cancel
                    </Button>
                    <Button size="sm" type="submit">
                      <Send className="w-4 h-4 mr-2" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex space-x-3">
                  <img
                    src={comment.owner.avatar}
                    alt={comment.owner.username}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-text-primary">{comment.owner.username}</span>
                      <span className="text-xs text-text-muted">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-text-secondary mb-2">{comment.content}</p>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-text-muted hover:text-text-primary transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">12</span>
                      </button>
                      <button className="text-xs text-text-muted hover:text-text-primary transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="!p-4">
            <h3 className="font-semibold text-text-primary mb-4">Up Next</h3>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-3 p-2 rounded-lg hover:bg-surface-light transition-colors cursor-pointer">
                  <div className="w-24 h-16 bg-gradient-surface rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-text-primary mb-1 line-clamp-2">
                      Sample Video Title {i + 1}
                    </h4>
                    <p className="text-xs text-text-secondary">TechChannel</p>
                    <p className="text-xs text-text-muted">1.2K views • 2 days ago</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;