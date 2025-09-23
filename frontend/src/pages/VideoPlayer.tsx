import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

function VideoPlayer() {
  const { id: videoId } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchVideoAndComments = async () => {
    try {
      setLoading(true);
      const videoResponse = await axios.get(`${API_BASE_URL}/videos/${videoId}`);
      setVideo(videoResponse.data.data);

      const commentsResponse = await axios.get(`${API_BASE_URL}/comments/${videoId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setComments(commentsResponse.data.data);
    } catch (error) {
      console.error("Failed to fetch video or comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchVideoAndComments();
    }
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
      // Refresh comments after posting
      fetchVideoAndComments(); 
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Failed to post comment.");
    }
  };

  if (loading) return <div className="text-center p-10">Loading Video...</div>;
  if (!video) return <div className="text-center p-10">Video not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="aspect-video bg-black mb-4">
        <video src={video.videoFile} controls autoPlay className="w-full h-full"></video>
      </div>
      <h1 className="text-2xl font-bold">{video.title}</h1>
      <p className="text-gray-600">{video.views} views</p>
      <p className="mt-2">{video.description}</p>
      <hr className="my-6" />

      {/* Comment Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">{comments.length} Comments</h2>
        
        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border rounded-md"
            rows={3}
          ></textarea>
          <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Comment
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-start">
              <img src={comment.owner.avatar} alt={comment.owner.username} className="w-10 h-10 rounded-full mr-3" />
              <div>
                <p className="font-semibold">{comment.owner.username}</p>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;