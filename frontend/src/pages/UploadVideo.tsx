import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function UploadVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !thumbnail || !title || !description) {
      alert("Please fill all fields and select both files.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("You must be logged in to upload a video.");
        return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/videos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });
      alert("Video uploaded successfully!");
      navigate(`/video/${response.data.data._id}`);
    } catch (error) {
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-[#121212] p-8 rounded-lg shadow-lg border border-gray-800">
        <h1 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Upload a New Video</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full bg-gray-800 border border-gray-700 rounded-md text-white px-4 py-2 focus:ring-2 focus:ring-blue-500" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-md text-white px-4 py-2 focus:ring-2 focus:ring-blue-500" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Video File</label>
            <input 
              type="file" 
              accept="video/*" 
              onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)} 
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setThumbnail(e.target.files ? e.target.files[0] : null)} 
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Upload Video
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadVideo;