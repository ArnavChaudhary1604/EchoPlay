import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Upload, Video, Image, FileText, Tag } from "lucide-react";
import { videoApi } from "../services/api";
import { useToast } from "../hooks/use-toast.ts";

function UploadVideo() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast({
        title: "Missing Video File",
        description: "Please select a video file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!thumbnail) {
      toast({
        title: "Missing Thumbnail",
        description: "Please select a thumbnail image.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter a title for your video.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Missing Description",
        description: "Please enter a description for your video.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upload videos.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("description", formData.description);
      if (formData.tags.trim()) {
        uploadData.append("tags", formData.tags);
      }
      uploadData.append("videoFile", videoFile);
      uploadData.append("thumbnail", thumbnail);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await videoApi.publishVideo(uploadData);

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (response.success) {
        toast({
          title: "Upload Successful!",
          description: "Your video has been uploaded successfully.",
        });
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }

    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload Failed",
        description: error.response?.data?.message || "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 animate-slide-up">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Upload Video
          </h1>
          <p className="text-text-secondary">
            Share your content with the EchoPlay community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Upload */}
            <Card className="!p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <Video className="w-5 h-5 mr-2" />
                Video File
              </h3>
              
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="video-upload"
                  required
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer block"
                >
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-medium text-text-primary mb-2">
                    Choose Video File
                  </h4>
                  <p className="text-text-secondary text-sm">
                    MP4, WebM, or MOV format recommended
                  </p>
                </label>
                
                {videoFile && (
                  <div className="mt-4 p-3 bg-surface-light rounded-lg">
                    <p className="text-sm text-text-primary font-medium">{videoFile.name}</p>
                    <p className="text-xs text-text-muted">
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Thumbnail Upload */}
            <Card className="!p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Thumbnail
              </h3>
              
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                  className="hidden"
                  id="thumbnail-upload"
                  required
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="cursor-pointer block"
                >
                  <div className="w-16 h-16 bg-gradient-secondary rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Image className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-medium text-text-primary mb-2">
                    Choose Thumbnail
                  </h4>
                  <p className="text-text-secondary text-sm">
                    JPG, PNG format (16:9 ratio recommended)
                  </p>
                </label>
                
                {thumbnail && (
                  <div className="mt-4 p-3 bg-surface-light rounded-lg">
                    <p className="text-sm text-text-primary font-medium">{thumbnail.name}</p>
                    <img
                      src={URL.createObjectURL(thumbnail)}
                      alt="Thumbnail preview"
                      className="w-full h-24 object-cover rounded-lg mt-2"
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Video Details */}
          <Card className="!p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Video Details
            </h3>
            
            <div className="space-y-4">
              <Input
                label="Title"
                name="title"
                placeholder="Enter video title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your video..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="input resize-none"
                  required
                />
              </div>
              
              <Input
                label="Tags"
                name="tags"
                placeholder="Enter tags separated by commas (e.g., react, tutorial, programming)"
                value={formData.tags}
                onChange={handleInputChange}
                icon={<Tag className="w-5 h-5" />}
              />
            </div>
          </Card>

          {/* Upload Progress */}
          {uploading && (
            <Card className="!p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Uploading Video...
              </h3>
              <div className="w-full bg-surface-light rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-text-secondary">{uploadProgress}% complete</p>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/dashboard")}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={uploading || !videoFile || !thumbnail}
              className="min-w-32"
            >
              {uploading ? "Uploading..." : "Upload Video"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadVideo;