import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, PlusSquare, Bell, Folder, Users, LogOut, Star, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import ProMateLogo from '../assets/images/logo.jpeg';
import DummyProfile from '../assets/images/pic1.jpeg';

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Function to get initials if no profile picture
  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  // Profile completion score
  const calculateCompletion = (u) => {
    if (!u) return 0;
    let score = 20;
    if (u.profilePicture) score += 10;
    if (u.bio) score += 10;
    if (u.skills && Object.values(u.skills).some(arr => arr?.length > 0)) score += 20;
    if (u.availability?.weeklyHours || u.availability?.preferredDays?.length > 0) score += 20;
    if (u.interests?.length > 0) score += 10;
    if (u.preferredRoles?.length > 0) score += 10;
    return Math.min(score, 100);
  };
  const completion = calculateCompletion(user);

  const navItems = [
    { text: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { text: "Projects", icon: <PlusSquare size={20} />, path: "/all-projects" },
    { text: "Notifications", icon: <Bell size={20} />, badge: "3", path: "/notifications" },
    { text: "Your projects", icon: <Folder size={20} />, path: "/your-projects" },
    { text: "Rate & Review", icon: <Star size={20} />, path: "/feedbacks" },
    { text: "Settings", icon: <SettingsIcon size={20} />, path: "/settings" }
  ];

  const teams = [
    { name: "ITPM project 0013", path: "/teams/itpm-0013", color: "text-primary" },
    { name: "PAF project 0018", path: "/teams/paf-0018", color: "text-secondary" },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-5">
      {/* Logo */}
      <div className="flex items-center mb-6 gap-3">
        <img src={ProMateLogo} alt="ProMate Logo" className="w-12 h-10 rounded-full" />
        <h2 className="text-3xl font-bold text-primary">ProMate</h2>
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
        <div className="flex items-center gap-3 mb-3 shrink-0 overflow-hidden">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-primary/20"
            />
          ) : (
            <img
              src={DummyProfile}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          )}
          <div className="flex flex-col overflow-hidden whitespace-nowrap">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.fullName || 'Student Name'}</p>
            <p className="text-xs text-secondary font-medium truncate">{user?.email || 'student@example.com'}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs font-medium text-gray-500">Profile complete</p>
          <p className="text-xs font-bold text-primary">{completion}%</p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${completion}%` }}></div>
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
      <div className={`${active ? "bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary" : "text-gray-500"}`}>
        {icon}
      </div>
      <span className="text-base flex-1">{text}</span>
      {badge && (
        <span className="bg-accent text-black text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}

export default Navbar;