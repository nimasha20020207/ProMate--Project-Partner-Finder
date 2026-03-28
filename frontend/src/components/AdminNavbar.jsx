import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, PlusSquare, Bell, Folder, Users, LogOut, Star } from "lucide-react";
import ProMateLogo from '../assets/images/logo.jpeg'
import DummyProfile from '../assets/images/pic1.jpeg'

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { text: "Dashboard", icon: <Home size={20} />, path: "/" },
    { text: "Students", icon: <PlusSquare size={20} />, path: "/studentman" },
    { text: "Projects", icon: <Bell size={20} />, badge: "3", path: "/projectman" },
    { text: "Activity", icon: <Folder size={20} />, path: "/requestman" },
    { text: "Ratings & Feedbacks", icon: <Star size={20} />, path: "/adminfeedbacks" },
  ];

  const teams = [
    { name: "ITPM project 0013", path: "/teams/itpm-0013", color: "text-primary" },
    { name: "PAF project 0018", path: "/teams/paf-0018", color: "text-secondary" },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-5">
      
      {/* Logo + Text */}
<div className="flex items-center mb-6 gap-3">
  {/* Logo Image */}
  <img
    src={ProMateLogo} // replace with your logo path
    alt="ProMate Logo"
    className="w-12 h-10 rounded-full"
  />
  
  {/* App Name */}
  <h2 className="text-3xl font-bold text-primary">
    ProMate
  </h2>
</div>

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
          <img 
            src={DummyProfile} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <p className="text-sm font-medium text-gray-800">Admin</p>
        </div>

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
      <span className="text-base flex-1">{text}</span>

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