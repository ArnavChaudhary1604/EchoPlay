import axios from 'axios';
import type { 
  User, 
  Video, 
  Tweet, 
  Comment, 
  Subscription, 
  Playlist,
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  VideoUploadRequest,
  DashboardStats
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
            refreshToken,
          });
          
          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          
          // Retry original request
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> => {
    const response = await api.post('/users/login', data);
    return response.data;
  },

  register: async (data: FormData): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> => {
    const response = await api.post('/users/register', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  logout: async (): Promise<ApiResponse<{}>> => {
    const response = await api.post('/users/logout');
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/users/current-user');
    return response.data;
  },

  refreshToken: async (): Promise<ApiResponse<{ accessToken: string }>> => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/users/refresh-token', { refreshToken });
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<ApiResponse<{}>> => {
    const response = await api.post('/users/change-password', { oldPassword, newPassword });
    return response.data;
  },

  updateAccount: async (data: { fullName: string; email: string }): Promise<ApiResponse<User>> => {
    const response = await api.patch('/users/update-account', data);
    return response.data;
  },

  updateAvatar: async (avatar: File): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append('avatar', avatar);
    const response = await api.patch('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateCoverImage: async (coverImage: File): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append('coverImage', coverImage);
    const response = await api.patch('/users/cover-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getUserChannelProfile: async (username: string): Promise<ApiResponse<User & { subscribersCount: number; channelsSubscribedToCount: number; isSubscribed: boolean }>> => {
    const response = await api.get(`/users/c/${username}`);
    return response.data;
  },

  getWatchHistory: async (): Promise<ApiResponse<Video[]>> => {
    const response = await api.get('/users/history');
    return response.data;
  },
};

// Video APIs
export const videoApi = {
  getAllVideos: async (page = 1, limit = 10, query = '', sortBy = 'createdAt', sortType = 'desc', userId?: string): Promise<ApiResponse<{ videos: Video[]; totalDocs: number; totalPages: number }>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      query,
      sortBy,
      sortType,
      ...(userId && { userId }),
    });
    const response = await api.get(`/videos?${params}`);
    return response.data;
  },

  getVideoById: async (videoId: string): Promise<ApiResponse<Video>> => {
    const response = await api.get(`/videos/${videoId}`);
    return response.data;
  },

  publishVideo: async (data: FormData): Promise<ApiResponse<Video>> => {
    const response = await api.post('/videos', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateVideo: async (videoId: string, data: { title?: string; description?: string; thumbnail?: File }): Promise<ApiResponse<Video>> => {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
    
    const response = await api.patch(`/videos/${videoId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteVideo: async (videoId: string): Promise<ApiResponse<{}>> => {
    const response = await api.delete(`/videos/${videoId}`);
    return response.data;
  },

  togglePublishStatus: async (videoId: string): Promise<ApiResponse<Video>> => {
    const response = await api.patch(`/videos/toggle/publish/${videoId}`);
    return response.data;
  },
};

// Comment APIs
export const commentApi = {
  getVideoComments: async (videoId: string, page = 1, limit = 10): Promise<ApiResponse<{ comments: Comment[]; totalDocs: number; totalPages: number }>> => {
    const response = await api.get(`/comments/${videoId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  addComment: async (videoId: string, content: string): Promise<ApiResponse<Comment>> => {
    const response = await api.post(`/comments/${videoId}`, { content });
    return response.data;
  },

  updateComment: async (commentId: string, content: string): Promise<ApiResponse<Comment>> => {
    const response = await api.patch(`/comments/c/${commentId}`, { content });
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<ApiResponse<{}>> => {
    const response = await api.delete(`/comments/c/${commentId}`);
    return response.data;
  },
};

// Like APIs
export const likeApi = {
  toggleVideoLike: async (videoId: string): Promise<ApiResponse<{ isLiked: boolean }>> => {
    const response = await api.post(`/likes/toggle/v/${videoId}`);
    return response.data;
  },

  toggleCommentLike: async (commentId: string): Promise<ApiResponse<{ isLiked: boolean }>> => {
    const response = await api.post(`/likes/toggle/c/${commentId}`);
    return response.data;
  },

  toggleTweetLike: async (tweetId: string): Promise<ApiResponse<{ isLiked: boolean }>> => {
    const response = await api.post(`/likes/toggle/t/${tweetId}`);
    return response.data;
  },

  getLikedVideos: async (): Promise<ApiResponse<Video[]>> => {
    const response = await api.get('/likes/videos');
    return response.data;
  },
};

// Subscription APIs
export const subscriptionApi = {
  toggleSubscription: async (channelId: string): Promise<ApiResponse<{ isSubscribed: boolean; subscribersCount: number }>> => {
    const response = await api.post(`/subscriptions/c/${channelId}`);
    return response.data;
  },

  getUserChannelSubscribers: async (channelId: string): Promise<ApiResponse<Subscription[]>> => {
    const response = await api.get(`/subscriptions/c/${channelId}`);
    return response.data;
  },

  getSubscribedChannels: async (subscriberId: string): Promise<ApiResponse<Subscription[]>> => {
    const response = await api.get(`/subscriptions/u/${subscriberId}`);
    return response.data;
  },
};

// Tweet APIs
export const tweetApi = {
  createTweet: async (content: string): Promise<ApiResponse<Tweet>> => {
    const response = await api.post('/tweets', { content });
    return response.data;
  },

  getUserTweets: async (userId: string): Promise<ApiResponse<Tweet[]>> => {
    const response = await api.get(`/tweets/user/${userId}`);
    return response.data;
  },

  updateTweet: async (tweetId: string, content: string): Promise<ApiResponse<Tweet>> => {
    const response = await api.patch(`/tweets/${tweetId}`, { content });
    return response.data;
  },

  deleteTweet: async (tweetId: string): Promise<ApiResponse<{}>> => {
    const response = await api.delete(`/tweets/${tweetId}`);
    return response.data;
  },
};

// Playlist APIs
export const playlistApi = {
  createPlaylist: async (name: string, description: string): Promise<ApiResponse<Playlist>> => {
    const response = await api.post('/playlist', { name, description });
    return response.data;
  },

  getUserPlaylists: async (userId: string): Promise<ApiResponse<Playlist[]>> => {
    const response = await api.get(`/playlist/user/${userId}`);
    return response.data;
  },

  getPlaylistById: async (playlistId: string): Promise<ApiResponse<Playlist>> => {
    const response = await api.get(`/playlist/${playlistId}`);
    return response.data;
  },

  addVideoToPlaylist: async (playlistId: string, videoId: string): Promise<ApiResponse<Playlist>> => {
    const response = await api.patch(`/playlist/add/${videoId}/${playlistId}`);
    return response.data;
  },

  removeVideoFromPlaylist: async (playlistId: string, videoId: string): Promise<ApiResponse<Playlist>> => {
    const response = await api.patch(`/playlist/remove/${videoId}/${playlistId}`);
    return response.data;
  },

  deletePlaylist: async (playlistId: string): Promise<ApiResponse<{}>> => {
    const response = await api.delete(`/playlist/${playlistId}`);
    return response.data;
  },

  updatePlaylist: async (playlistId: string, name: string, description: string): Promise<ApiResponse<Playlist>> => {
    const response = await api.patch(`/playlist/${playlistId}`, { name, description });
    return response.data;
  },
};

// Dashboard APIs
export const dashboardApi = {
  getChannelStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getChannelVideos: async (): Promise<ApiResponse<Video[]>> => {
    const response = await api.get('/dashboard/videos');
    return response.data;
  },
};

// Health Check
export const healthApi = {
  healthcheck: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.get('/healthcheck');
    return response.data;
  },
};

export default api;