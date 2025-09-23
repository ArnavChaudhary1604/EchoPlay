import { Search, Bell, Video, User } from "lucide-react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b">
      <Link to="/" className="text-xl font-bold">EchoPlay</Link>
      <div className="w-1/3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border rounded-full"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/upload" className="p-2 rounded-full hover:bg-gray-200">
          <Video />
        </Link>
        <button className="p-2 rounded-full hover:bg-gray-200">
          <Bell />
        </button>
        <Link to="/auth" className="p-2 rounded-full hover:bg-gray-200">
          <User />
        </Link>
      </div>
    </header>
  );
}

export default Header;