import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/api/v1/videos";

function UploadVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !thumbnail) {
      alert("Please select both a video file and a thumbnail.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    try {
      // NOTE: You need to handle authentication (sending the JWT token)
      // This example assumes public uploads or auth handled by axios interceptors
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
           // Example: "Authorization": `Bearer ${your_auth_token}`
        },
      });
      alert("Upload successful!");
      navigate(`/video/${response.data.data._id}`);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Check console for details.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Video File</label>
          <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)} className="w-full" />
        </div>
        <div>
          <label>Thumbnail</label>
          <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files ? e.target.files[0] : null)} className="w-full" />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Upload</button>
      </form>
    </div>
  );
}

export default UploadVideo;