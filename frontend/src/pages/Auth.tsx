import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// IMPORTANT: Make sure this port matches your backend server's port
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // State for Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // State for Register form
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
        password: loginPassword,
      });
      // Storing token and user data to be used in other components
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      
      console.log("Login successful:", response.data.data);
      alert("Login successful!");
      navigate("/"); // Redirect to home page after login
    } catch (error) {
      console.error("Login failed:", error);
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Registration successful! Please log in.");
      setIsLogin(true); // Switch to the login form
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex border-b">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 text-center font-semibold ${isLogin ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 text-center font-semibold ${!isLogin ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Register
          </button>
        </div>

        {isLogin ? (
          // Login Form
          <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-xl font-bold text-center">Welcome Back!</h2>
            <div>
              <label>Email or Username</label>
              <input type="text" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
            </div>
            <div>
              <label>Password</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
            </div>
            <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Login
            </button>
          </form>
        ) : (
          // Register Form
          <form onSubmit={handleRegister} className="space-y-4">
            <h2 className="text-xl font-bold text-center">Create an Account</h2>
            <div>
              <label>Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
            </div>
            <div>
              <label>Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
            </div>
            <div>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
            </div>
            <div>
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
            </div>
            <div>
              <label>Avatar</label>
              <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)} required className="w-full" />
            </div>
            <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Auth;