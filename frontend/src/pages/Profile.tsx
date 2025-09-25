import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import VideoCard from "../components/VideoCard";
import { 
  Users, 
  Video, 
  Edit3, 
  Upload, 
  Mail, 
  Calendar,
  MapPin,
  Camera,
  Settings
} from "lucide-react";
import { authApi, videoApi, subscriptionApi } from "../services/api";
import type { User, Video as VideoType } from "../types/api";
import { useToast } from "../hooks/use-toast.ts";

function Profile() {
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [channelsSubscribedToCount, setChannelsSubscribedToCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const currentUserResponse = await authApi.getCurrentUser();
        if (currentUserResponse.success) {
          setCurrentUser(currentUserResponse.data);
        }

        if (username) {
          // Get profile user
          const profileResponse = await authApi.getUserChannelProfile(username);
          if (profileResponse.success) {
            setProfileUser(profileResponse.data);
            setIsSubscribed(profileResponse.data.isSubscribed);
            setSubscribersCount(profileResponse.data.subscribersCount);
            setChannelsSubscribedToCount(profileResponse.data.channelsSubscribedToCount);
            
            // Load user videos
            await fetchUserVideos(profileResponse.data._id);
          }
        }
      } catch (error: any) {
        console.error("Failed to fetch profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const fetchUserVideos = async (userId: string) => {
    try {
      setVideosLoading(true);
      const response = await videoApi.getAllVideos(1, 20, '', 'createdAt', 'desc', userId);
      if (response.success) {
        setVideos(response.data.videos);
      }
    } catch (error: any) {
      console.error("Failed to fetch user videos:", error);
    } finally {
      setVideosLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!profileUser || !currentUser) return;

    try {
      const response = await subscriptionApi.toggleSubscription(profileUser._id);
      if (response.success) {
        setIsSubscribed(response.data.isSubscribed);
        setSubscribersCount(response.data.subscribersCount);
        
        toast({
          title: response.data.isSubscribed ? "Subscribed!" : "Unsubscribed",
          description: response.data.isSubscribed 
            ? `You're now subscribed to ${profileUser.fullName}`
            : `You've unsubscribed from ${profileUser.fullName}`,
        });
      }
    } catch (error: any) {
      console.error("Failed to toggle subscription:", error);
      toast({
        title: "Subscription Failed",
        description: "Failed to update subscription status.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async () => {
    if (!editForm.fullName.trim() || !editForm.email.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await authApi.updateAccount({
        fullName: editForm.fullName.trim(),
        email: editForm.email.trim(),
      });
      
      if (response.success) {
        setCurrentUser(response.data);
        setProfileUser(response.data);
        setIsEditing(false);
        
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await authApi.updateAvatar(file);
      if (response.success) {
        setCurrentUser(response.data);
        setProfileUser(response.data);
        
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been updated successfully.",
        });
      }
    } catch (error: any) {
      console.error("Failed to update avatar:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to update profile picture.",
        variant: "destructive",
      });
    }
  };

  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await authApi.updateCoverImage(file);
      if (response.success) {
        setCurrentUser(response.data);
        setProfileUser(response.data);
        
        toast({
          title: "Cover Image Updated",
          description: "Your cover image has been updated successfully.",
        });
      }
    } catch (error: any) {
      console.error("Failed to update cover image:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to update cover image.",
        variant: "destructive",
      });
    }
  };

  const isOwnProfile = currentUser && profileUser && currentUser._id === profileUser._id;

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-surface-light rounded-t-xl"></div>
        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-24 h-24 bg-surface-light rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-surface-light rounded w-1/3"></div>
              <div className="h-4 bg-surface-light rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="text-center max-w-md">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">User Not Found</h2>
          <p className="text-text-secondary">
            The profile you're looking for doesn't exist.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-secondary rounded-t-xl overflow-hidden">
        {profileUser.coverImage && (
          <img
            src={profileUser.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        {isOwnProfile && (
          <label className="absolute top-4 right-4 p-2 bg-black/50 rounded-lg cursor-pointer hover:bg-black/70 transition-colors">
            <Camera className="w-5 h-5 text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Profile Info */}
      <Card className="!p-6 -mt-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
          {/* Avatar */}
          <div className="relative mb-4 md:mb-0">
            <img
              src={profileUser.avatar}
              alt={profileUser.fullName}
              className="w-24 h-24 rounded-full object-cover border-4 border-surface"
            />
            {isOwnProfile && (
              <label className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary-hover transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Profile Details */}
          <div className="flex-1">
            {isEditing && isOwnProfile ? (
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                />
                <Input
                  label="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                />
                <div className="flex space-x-3">
                  <Button onClick={handleUpdateProfile}>
                    Save Changes
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        fullName: profileUser.fullName,
                        email: profileUser.email,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-text-primary">
                      {profileUser.fullName}
                    </h1>
                    <p className="text-text-muted">@{profileUser.username}</p>
                  </div>
                  
                  {isOwnProfile ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditForm({
                            fullName: profileUser.fullName,
                            email: profileUser.email,
                          });
                          setIsEditing(true);
                        }}
                        className="flex items-center space-x-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => window.location.href = '/settings'}
                        className="flex items-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Button>
                    </div>
                  ) : currentUser ? (
                    <Button
                      onClick={handleSubscribe}
                      variant={isSubscribed ? "secondary" : "primary"}
                      className="flex items-center space-x-2"
                    >
                      <Users className="w-4 h-4" />
                      <span>{isSubscribed ? "Unsubscribe" : "Subscribe"}</span>
                    </Button>
                  ) : null}
                </div>

                {/* Stats */}
                <div className="flex space-x-6 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-text-primary">
                      {videos.length}
                    </div>
                    <div className="text-sm text-text-muted">Videos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-text-primary">
                      {subscribersCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-text-muted">Subscribers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-text-primary">
                      {channelsSubscribedToCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-text-muted">Following</div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{profileUser.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Joined {new Date(profileUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Videos Section */}
      <Card className="!p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary flex items-center space-x-2">
            <Video className="w-5 h-5" />
            <span>Videos ({videos.length})</span>
          </h2>
          
          {isOwnProfile && (
            <Button
              onClick={() => window.location.href = '/upload-video'}
              className="flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Video</span>
            </Button>
          )}
        </div>

        {videosLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="h-64 animate-pulse">
                <div className="w-full h-40 bg-surface-light rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-surface-light rounded w-3/4"></div>
                  <div className="h-3 bg-surface-light rounded w-1/2"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <div key={video._id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {isOwnProfile ? "No videos yet" : `${profileUser.fullName} hasn't uploaded any videos yet`}
            </h3>
            {isOwnProfile && (
              <p className="text-text-secondary mb-4">
                Start sharing your content with the community!
              </p>
            )}
            {isOwnProfile && (
              <Button
                onClick={() => window.location.href = '/upload-video'}
                className="flex items-center space-x-2 mx-auto"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Your First Video</span>
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export default Profile;