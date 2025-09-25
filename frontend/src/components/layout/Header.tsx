import { Search, Bell, Video, User, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-border/50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-surface-light transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6 text-text-primary" />
          </button>
          
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary shadow-glow">
              <Video className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text hidden sm:block">
              EchoPlay
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-4 hidden md:flex">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search videos, channels..."
              icon={<Search className="w-5 h-5" />}
              className="pr-12"
            />
            <Button 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Mobile Search */}
          <button className="md:hidden p-2.5 rounded-lg text-text-secondary hover:bg-surface-light hover:text-text-primary transition-all">
            <Search className="w-6 h-6" />
          </button>

          {/* Upload Video */}
          <Link to="/upload">
            <Button variant="ghost" className="hidden sm:flex items-center space-x-2">
              <Video className="w-5 h-5" />
              <span className="hidden lg:inline">Upload</span>
            </Button>
          </Link>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-lg text-text-secondary hover:bg-surface-light hover:text-text-primary transition-all">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-background"></span>
          </button>

          {/* Profile */}
          <Link to="/auth">
            <Button variant="ghost" className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span className="hidden lg:inline">Profile</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-4">
        <Input
          type="text"
          placeholder="Search videos, channels..."
          icon={<Search className="w-5 h-5" />}
        />
      </div>
    </header>
  );
}

export default Header;