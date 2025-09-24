import { Search, Bell, Video, User } from "lucide-react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-800 bg-[#0f0f0f] sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white tracking-tighter">EchoPlay</span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl mx-4 hidden sm:flex">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-12 pr-4 py-2.5 bg-[#121212] border border-gray-700 rounded-full text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Link to="/upload" className="p-2.5 rounded-full text-gray-300 hover:bg-gray-800 transition-colors" aria-label="Upload Video">
          <Video className="w-6 h-6" />
        </Link>
        <button className="p-2.5 rounded-full text-gray-300 hover:bg-gray-800 transition-colors" aria-label="Notifications">
          <Bell className="w-6 h-6" />
        </button>
        <Link to="/auth" className="p-2.5 rounded-full text-gray-300 hover:bg-gray-800 transition-colors" aria-label="Your Account">
          <User className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}

export default Header;