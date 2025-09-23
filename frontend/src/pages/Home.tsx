import { useState, useEffect } from "react";
import VideoCard from "../components/VideoCard";
import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/videos";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(API_URL);
        setVideos(response.data.data);
      } catch (error) {
        console.error("Failed to fetch videos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video: any) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}

export default Home;