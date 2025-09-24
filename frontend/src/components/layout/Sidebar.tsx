import { Home, Flame, Film, User, History } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Flame, label: "Trending", path: "/trending" },
  { icon: Film, label: "Subscriptions", path: "/subscriptions" },
];

const userNavItems = [
    { icon: User, label: "Your Channel", path: "/dashboard" },
    { icon: History, label: "History", path: "/history" },
]

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-gray-800 bg-[#0f0f0f] p-4 flex-col hidden lg:flex">
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className={`flex items-center space-x-4 px-3 py-2.5 rounded-lg transition-colors text-gray-300 ${
                  location.pathname === item.path
                    ? "bg-gray-800 font-semibold text-white"
                    : "hover:bg-gray-800/80"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <hr className="my-4 border-gray-700" />
        <ul className="space-y-2">
          {userNavItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className={`flex items-center space-x-4 px-3 py-2.5 rounded-lg transition-colors text-gray-300 ${
                  location.pathname === item.path
                    ? "bg-gray-800 font-semibold text-white"
                    : "hover:bg-gray-800/80"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;