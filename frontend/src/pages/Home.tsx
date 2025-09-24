import { useState, useEffect } from "react";
import VideoCard from "../components/VideoCard";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Home() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setLoading(false);
          setError("Please log in to view videos.");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/videos`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setVideos(response.data.data);
      } catch (err) {
        setError("Failed to fetch videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div className="text-center p-10 text-gray-400">Loading Videos...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Recommended For You</h1>
        {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
                {videos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>
        ) : (
            <p className="text-center text-gray-400 mt-10">No videos found. Why not upload one?</p>
        )}
    </div>
  );
}

export default Home;