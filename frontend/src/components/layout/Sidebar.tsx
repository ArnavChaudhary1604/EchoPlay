import { Home, TrendingUp, Users, User, Clock, Settings, HelpCircle, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Card } from "../ui/Card";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: TrendingUp, label: "Trending", path: "/trending" },
  { icon: Users, label: "Subscriptions", path: "/subscriptions" },
];

const userNavItems = [
  { icon: User, label: "Your Channel", path: "/dashboard" },
  { icon: Clock, label: "History", path: "/history" },
];

const bottomNavItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: HelpCircle, label: "Help", path: "/help" },
];

function Sidebar() {
  const location = useLocation();

  const NavItem = ({ icon: Icon, label, path, isActive }: any) => (
    <Link
      to={path}
      className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
        isActive
          ? "bg-gradient-primary text-white shadow-glow"
          : "text-text-secondary hover:text-text-primary hover:bg-surface-light"
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-primary transition-colors'}`} />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <aside className="w-72 glass border-r border-border/50 p-6 flex-col hidden lg:flex">
      <nav className="flex-1 space-y-8">
        {/* Main Navigation */}
        <div>
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4 px-4">
            Discover
          </h2>
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                path={item.path}
                isActive={location.pathname === item.path}
              />
            ))}
          </div>
        </div>

        {/* User Section */}
        <div>
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4 px-4">
            Your Content
          </h2>
          <div className="space-y-2">
            {userNavItems.map((item) => (
              <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                path={item.path}
                isActive={location.pathname === item.path}
              />
            ))}
          </div>
        </div>

        {/* Trending Section */}
        <Card className="!p-4">
          <h3 className="font-semibold text-text-primary mb-3">🔥 Trending Now</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  React 19 New Features
                </p>
                <p className="text-xs text-text-muted">2.1M views</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  AI Development Guide
                </p>
                <p className="text-xs text-text-muted">1.8M views</p>
              </div>
            </div>
          </div>
        </Card>
      </nav>

      {/* Bottom Navigation */}
      <div className="space-y-2 border-t border-border/50 pt-6">
        {bottomNavItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isActive={location.pathname === item.path}
          />
        ))}
        
        <button className="flex items-center space-x-4 px-4 py-3 rounded-xl text-text-secondary hover:text-error hover:bg-surface-light transition-all duration-300 w-full">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;