import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  PlusSquare, 
  Bell, 
  Folder, 
  Users, 
  LogOut, 
  Star, 
  Settings as SettingsIcon,
  ChevronRight,
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  UserCircle
} from "lucide-react";
import { useAuth } from '../context/AuthContext';
import ProMateLogo from '../assets/images/logo.jpeg';
import DummyProfile from '../assets/images/pic1.jpeg';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
    { text: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard", section: "Main" },
    { text: "Discover Projects", icon: <Briefcase size={20} />, path: "/all-projects", section: "Main" },
    { text: "Notifications", icon: <Bell size={20} />, badge: "3", path: "/notifications", section: "Main" },
    { text: "Your projects", icon: <Folder size={20} />, path: "/your-projects", section: "Work" },
    { text: "Rate & Review", icon: <Star size={20} />, path: "/feedbacks", section: "Work" },
    { text: "Settings", icon: <SettingsIcon size={20} />, path: "/settings", section: "Account" }
  ];

  const teams = [
    { name: "ITPM project 0013", path: "/teams/itpm-0013", color: "bg-blue-500" },
    { name: "PAF project 0018", path: "/teams/paf-0018", color: "bg-pink-500" },
  ];

  return (
    <div className="h-screen w-72 bg-white border-r border-gray-100 flex flex-col justify-between p-6 shadow-xl shadow-gray-200/50 z-50">
      <div className="flex flex-col h-full scrollbar-none overflow-y-auto">
        {/* Logo Section */}
        <div className="flex items-center mb-10 gap-4 px-2">
          <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl shadow-inner">
            <img src={ProMateLogo} alt="ProMate Logo" className="w-10 h-10 rounded-xl object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">ProMate</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Project Partner Finder</p>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="space-y-8 flex-1">
          {/* Main Section */}
          <section>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-4">Explore</p>
            <nav className="space-y-1.5">
              {navItems.filter(i => i.section === "Main").map((item) => (
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
          </section>

          {/* Work Section */}
          <section>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-4">My workspace</p>
            <nav className="space-y-1.5">
              {navItems.filter(i => i.section === "Work").map((item) => (
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
          </section>

          {/* Teams Section */}
          <section>
            <div className="flex items-center justify-between mb-4 ml-4 pr-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Active Teams</p>
              <PlusSquare size={14} className="text-gray-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <div className="space-y-1">
              {teams.map((team) => (
                <Link key={team.name} to={team.path} className="group block">
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200">
                    <div className={`w-2 h-2 rounded-full ${team.color} group-hover:scale-125 transition-transform`}></div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-primary transition-colors truncate">{team.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Action Section */}
        <div className="mt-auto pt-6 border-t border-gray-100 space-y-1">
          <Link to="/settings">
            <NavItem icon={<SettingsIcon size={18} />} text="Settings" active={location.pathname === "/settings"} />
          </Link>
          <div onClick={handleLogout} className="group">
            <NavItem 
              icon={<LogOut size={18} />} 
              text="Sign Out" 
              className="text-red-500 hover:bg-red-50 hover:text-red-600" 
            />
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="mt-8 p-4 bg-slate-50 rounded-3xl border border-slate-100 relative group overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
           <ChevronRight size={16} className="text-gray-400" />
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <img
              src={user?.profilePicture || DummyProfile}
              alt="Profile"
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-md transition-transform group-hover:rotate-3"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate tracking-tight">{user?.fullName || 'Student'}</p>
            <p className="text-[11px] font-medium text-gray-500 truncate">{user?.email || 'student@promate.com'}</p>
          </div>
        </div>

        {/* Completion Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
            <span className="text-gray-400">Profile Level</span>
            <span className="text-primary">{completion}%</span>
          </div>
          <div className="w-full bg-gray-200/50 rounded-full h-1.5 p-[1px]">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-1000 ease-in-out shadow-sm shadow-primary/20" 
              style={{ width: `${completion}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Improved Nav Item */
function NavItem({ icon, text, active, badge, className = "" }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 group relative ${
        active
          ? "bg-gradient-to-br from-primary/10 to-secondary/10 text-primary font-bold shadow-[0_4px_12px_rgba(59,130,246,0.08)]"
          : `text-gray-500 hover:bg-gray-50 hover:text-gray-900 ${className}`
      }`}
    >
      {/* Active Indicator Strip */}
      {active && (
        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full"></div>
      )}
      
      <div className={`transition-transform duration-300 group-hover:scale-110 ${active ? "text-primary" : "text-gray-400 group-hover:text-primary"}`}>
        {icon}
      </div>
      
      <span className="text-[14px] flex-1 leading-none">{text}</span>
      
      {badge && (
        <span className="bg-primary text-white text-[10px] tabular-nums font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-lg shadow-primary/20">
          {badge}
        </span>
      )}

      {!active && (
        <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gray-300" />
      )}
    </div>
  );
}

export default Navbar;