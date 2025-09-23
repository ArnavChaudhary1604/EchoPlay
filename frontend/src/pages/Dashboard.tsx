import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api/v1/dashboard";

function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        // Handle not logged in case
        setLoading(false);
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      try {
        const statsResponse = await axios.get(`${API_BASE_URL}/stats`, config);
        setStats(statsResponse.data.data[0]); // Stats are returned in an array

        const videosResponse = await axios.get(`${API_BASE_URL}/videos`, config);
        setVideos(videosResponse.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center p-10">Loading Dashboard...</div>;
  if (!stats) return <div className="text-center p-10">Please log in to view your dashboard.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Channel Dashboard</h1>
      
      {/* Channel Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm font-medium">Total Videos</h2>
          <p className="text-3xl font-bold">{stats.totalVideos}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm font-medium">Total Views</h2>
          <p className="text-3xl font-bold">{stats.totalViews}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm font-medium">Total Subscribers</h2>
          <p className="text-3xl font-bold">{stats.totalSubscribers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm font-medium">Total Likes</h2>
          <p className="text-3xl font-bold">{stats.totalLikes}</p>
        </div>
      </div>

      {/* Channel Videos */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Videos</h2>
        <div className="space-y-4">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div key={video._id} className="flex items-center bg-white p-3 rounded-lg shadow">
                <img src={video.thumbnail} alt={video.title} className="w-32 h-20 object-cover rounded-md mr-4" />
                <div className="flex-grow">
                  <Link to={`/video/${video._id}`} className="font-semibold text-lg hover:text-blue-600">{video.title}</Link>
                  <p className="text-sm text-gray-600">{video.views} views</p>
                </div>
                {/* Add edit/delete buttons here if needed */}
              </div>
            ))
          ) : (
            <p>You haven't uploaded any videos yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;