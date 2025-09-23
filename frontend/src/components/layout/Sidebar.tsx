import { Home, Flame, Film, User, Settings, History } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Film, label: "Subscriptions", path: "/subscriptions" },
  { icon: User, label: "Your Channel", path: "/dashboard" },
  { icon: History, label: "History", path: "/history" },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 border-r p-4 hidden lg:block">
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                  location.pathname === item.path
                    ? "bg-gray-200 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;