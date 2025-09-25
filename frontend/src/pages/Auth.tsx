import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { User, Mail, Lock, Upload } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // State for Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // State for Register
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, { 
        email: loginEmail, 
        password: loginPassword 
      });
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      navigate("/");
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatar) {
      alert("Please select an avatar image.");
      return;
    }
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);

    try {
      await axios.post(`${API_BASE_URL}/users/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Registration successful! Please login.");
      setIsLogin(true);
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-scale-in">
        <Card variant="glass" className="!p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-glow">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text mb-2">
              {isLogin ? 'Welcome Back' : 'Join EchoPlay'}
            </h1>
            <p className="text-text-secondary">
              {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
            </p>
          </div>

          {/* Forms */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                icon={<Mail className="w-5 h-5" />}
                required
              />
              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                required
              />
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              <Input
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={<User className="w-5 h-5" />}
                required
              />
              <Input
                type="text"
                label="Username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<User className="w-5 h-5" />}
                required
              />
              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5" />}
                required
              />
              <Input
                type="password"
                label="Password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                required
              />
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Avatar Image
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                    className="hidden"
                    id="avatar-upload"
                    required
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="btn-secondary cursor-pointer flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose Image</span>
                  </label>
                  {avatar && (
                    <span className="text-sm text-text-secondary">{avatar.name}</span>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          )}

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-text-secondary hover:text-primary transition-colors"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Auth;