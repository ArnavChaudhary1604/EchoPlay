import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        const response = await axios.post(`${API_BASE_URL}/users/login`, { email: loginEmail, password: loginPassword });
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        alert("Login successful!");
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
        await axios.post(`${API_BASE_URL}/users/register`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        alert("Registration successful! Please log in.");
        setIsLogin(true);
    } catch (error) {
        alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-start pt-16">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#121212] rounded-xl shadow-2xl border border-gray-800">
        <div className="flex border-b border-gray-700">
          <button onClick={() => setIsLogin(true)} className={`w-1/2 py-3 text-center font-semibold transition-colors ${isLogin ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            Login
          </button>
          <button onClick={() => setIsLogin(false)} className={`w-1/2 py-3 text-center font-semibold transition-colors ${!isLogin ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            Register
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-white">Welcome Back!</h2>
            <div>
              <label className="text-sm font-medium text-gray-300">Email or Username</label>
              <input type="text" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="w-full px-4 py-2 mt-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Password</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="w-full px-4 py-2 mt-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300">
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-white">Create an Account</h2>
            <div>
              <label className="text-sm font-medium text-gray-300">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-4 py-2 mt-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-2 mt-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 mt-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 mt-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-300">Avatar</label>
                <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)} required className="w-full mt-2 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"/>
            </div>
            <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300">
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Auth;