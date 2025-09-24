import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function VideoPlayer() {
  const { id: videoId } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchVideoAndComments = async () => {
    try {
        if (!videoId) return;
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [videoResponse, commentsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/videos/${videoId}`, config),
        axios.get(`${API_BASE_URL}/comments/${videoId}`, config)
      ]);

      setVideo(videoResponse.data.data);
      setComments(commentsResponse.data.data);
    } catch (error) {
      console.error("Failed to fetch video or comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoAndComments();
  }, [videoId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token || !newComment.trim()) return;

    try {
      await axios.post(
        `${API_BASE_URL}/comments/${videoId}`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchVideoAndComments(); 
    } catch (error) {
      alert("Failed to post comment.");
    }
  };

  if (loading) return <div className="text-center p-10 text-gray-400">Loading Video...</div>;
  if (!video) return <div className="text-center p-10">Video not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
        <video src={video.videoFile} controls autoPlay className="w-full h-full"></video>
      </div>
      <h1 className="text-2xl font-bold text-white">{video.title}</h1>
      <div className="flex justify-between items-center my-4">
        <div className="flex items-center space-x-4">
            {/* Owner info would be great here, but it's not in the getVideoById response */}
            <p className="text-gray-400">{video.views} views</p>
        </div>
        <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700">
                <ThumbsUp className="w-5 h-5"/> 
                <span>Like</span>
            </button>
            <button className="px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700">Subscribe</button>
        </div>
      </div>

      <div className="bg-[#121212] border border-gray-800 p-4 rounded-lg">
        <p className="text-sm text-gray-300">{video.description}</p>
      </div>

      <hr className="my-6 border-gray-800" />

      <div>
        <h2 className="text-xl font-bold text-white mb-4">{comments.length} Comments</h2>
        
        <form onSubmit={handleCommentSubmit} className="mb-6 flex items-start space-x-3">
          <img src={JSON.parse(localStorage.getItem('user') || '{}').avatar} className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 bg-transparent border-b border-gray-700 focus:border-white outline-none"
              rows={1}
            ></textarea>
            <div className="text-right mt-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 disabled:bg-gray-600" disabled={!newComment.trim()}>
                    Comment
                </button>
            </div>
          </div>
        </form>

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-start space-x-3">
              <img src={comment.owner.avatar} alt={comment.owner.username} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold text-sm text-white">{comment.owner.username}</p>
                <p className="text-gray-300">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;