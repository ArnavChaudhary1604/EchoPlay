import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Video, Eye, Users, ThumbsUp } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const [statsResponse, videosResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/dashboard/stats`, config),
          axios.get(`${API_BASE_URL}/dashboard/videos`, config)
        ]);
        
        setStats(statsResponse.data.data[0]);
        setVideos(videosResponse.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center p-10 text-gray-400">Loading Dashboard...</div>;
  if (!stats) return <div className="text-center p-10">Please log in to view your dashboard.</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-white">
      <div className="flex items-center space-x-4 mb-8">
        <img src={stats.avatar} alt={stats.username} className="w-24 h-24 rounded-full border-2 border-blue-500" />
        <div>
            <h1 className="text-3xl font-bold">{stats.fullName}</h1>
            <p className="text-gray-400">@{stats.username}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#121212] border border-gray-800 p-5 rounded-lg flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-full"><Video className="w-6 h-6 text-blue-400" /></div>
            <div>
                <h2 className="text-gray-400 text-sm font-medium">Total Videos</h2>
                <p className="text-2xl font-bold">{stats.totalVideos}</p>
            </div>
        </div>
        <div className="bg-[#121212] border border-gray-800 p-5 rounded-lg flex items-center space-x-4">
            <div className="p-3 bg-green-500/20 rounded-full"><Eye className="w-6 h-6 text-green-400" /></div>
            <div>
                <h2 className="text-gray-400 text-sm font-medium">Total Views</h2>
                <p className="text-2xl font-bold">{stats.totalViews}</p>
            </div>
        </div>
        <div className="bg-[#121212] border border-gray-800 p-5 rounded-lg flex items-center space-x-4">
            <div className="p-3 bg-purple-500/20 rounded-full"><Users className="w-6 h-6 text-purple-400" /></div>
            <div>
                <h2 className="text-gray-400 text-sm font-medium">Total Subscribers</h2>
                <p className="text-2xl font-bold">{stats.totalSubscribers}</p>
            </div>
        </div>
        <div className="bg-[#121212] border border-gray-800 p-5 rounded-lg flex items-center space-x-4">
            <div className="p-3 bg-red-500/20 rounded-full"><ThumbsUp className="w-6 h-6 text-red-400" /></div>
            <div>
                <h2 className="text-gray-400 text-sm font-medium">Total Likes</h2>
                <p className="text-2xl font-bold">{stats.totalLikes}</p>
            </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">My Videos</h2>
        <div className="bg-[#121212] border border-gray-800 rounded-lg">
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <div key={video._id} className={`flex items-center p-4 ${index < videos.length - 1 ? 'border-b border-gray-800' : ''}`}>
                <img src={video.thumbnail} alt={video.title} className="w-32 h-20 object-cover rounded-md mr-4" />
                <div className="flex-grow">
                  <Link to={`/video/${video._id}`} className="font-semibold text-lg hover:text-blue-400 transition-colors">{video.title}</Link>
                  <p className="text-sm text-gray-400">{video.views} views &bull; {new Date(video.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-gray-400">You haven't uploaded any videos yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;