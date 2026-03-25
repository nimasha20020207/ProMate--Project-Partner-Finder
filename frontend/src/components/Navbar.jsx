import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, PlusSquare, Bell, Folder, Users, LogOut } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { text: "Dashboard", icon: <Home size={20} />, path: "/" },
    { text: "Create new project", icon: <PlusSquare size={20} />, path: "/#" },
    { text: "Notifications", icon: <Bell size={20} />, badge: "3", path: "/#" },
    { text: "My projects", icon: <Folder size={20} />, path: "/#" },
  ];

  const teams = [
    { name: "ITPM project 0013", path: "/teams/itpm-0013", color: "text-primary" },
    { name: "PAF project 0018", path: "/teams/paf-0018", color: "text-secondary" },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-5">
      
      {/* Logo */}
      <h2 className="text-2xl font-bold mb-4">
        <span className="text-primary">Partner</span>
        <span className="text-secondary">Finder</span>
      </h2>

      {/* Navigation */}
      <div>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <Link key={item.text} to={item.path}>
              <NavItem
                icon={item.icon}
                text={item.text}
                badge={item.badge}
                active={location.pathname === item.path}
              />
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Teams */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Your teams</p>
          <div className="space-y-2 text-sm">
            {teams.map((team) => (
              <Link key={team.name} to={team.path}>
                <p className={`cursor-pointer hover:underline ${team.color}`}>{team.name}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Logout */}
        <Link to="/logout">
          <NavItem icon={<LogOut size={20} />} text="Logout" />
        </Link>
      </div>

      {/* Profile Section */}
      <div className="mt-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex-shrink-0"></div>
          <p className="text-sm font-medium text-gray-800">John Doe</p>
        </div>

        {/* Progress */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-[60%] shadow-sm"></div>
        </div>
        <p className="text-xs mt-1 text-right text-gray-500">60%</p>
      </div>
    </div>
  );
};

/* Nav Item */
function NavItem({ icon, text, active, badge }) {
  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-medium shadow-sm scale-105"
          : "text-gray-500 hover:bg-gray-100 hover:text-primary hover:scale-105"
      }`}
    >
      {/* Icon with gradient on active */}
      <div className={`${active ? "bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary" : "text-gray-500"}`}>
        {icon}
      </div>

      {/* Text */}
      <span className="text-sm flex-1">{text}</span>

      {/* Badge */}
      {badge && (
        <span className="bg-accent text-black text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}

export default Navbar;