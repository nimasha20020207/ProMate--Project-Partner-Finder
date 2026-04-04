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
  LayoutDashboard,
  Users as StudentsIcon,
  Briefcase,
  Activity,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { useAuth } from '../context/AuthContext';
import ProMateLogo from '../assets/images/logo.jpeg';
import DummyProfile from '../assets/images/pic1.jpeg';

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); // Assuming admin uses the same logout

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { text: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admindashboard", section: "Management" },
    { text: "Students", icon: <StudentsIcon size={20} />, path: "/studentman", section: "Management" },
    { text: "Projects", icon: <Briefcase size={20} />, badge: "3", path: "/projectman", section: "Management" },
    { text: "Activity", icon: <Activity size={20} />, path: "/history", section: "Operations" },
    { text: "Ratings & Feedbacks", icon: <Star size={20} />, path: "/adminfeedbacks", section: "Operations" },
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
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Admin Control Panel</p>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="space-y-8 flex-1">
          {/* Management Section */}
          <section>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-4">Management</p>
            <nav className="space-y-1.5">
              {navItems.filter(i => i.section === "Management").map((item) => (
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

          {/* Operations Section */}
          <section>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-4">Operations</p>
            <nav className="space-y-1.5">
              {navItems.filter(i => i.section === "Operations").map((item) => (
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
        </div>

        {/* Action Section */}
        <div className="mt-auto pt-6 border-t border-gray-100 space-y-1">
          <div onClick={handleLogout} className="group">
            <NavItem 
              icon={<LogOut size={18} />} 
              text="Sign Out" 
              className="text-red-500 hover:bg-red-50 hover:text-red-600" 
            />
          </div>
        </div>
      </div>

      {/* Admin Profile Card */}
      <div className="mt-8 p-4 bg-slate-900 rounded-3xl border border-slate-800 relative group overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={DummyProfile}
              alt="Profile"
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-800 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary border-2 border-slate-900 rounded-full shadow-sm"></div>
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-bold text-white truncate tracking-tight">System Admin</p>
            <p className="text-[11px] font-medium text-slate-400 truncate">admin@promate.com</p>
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

export default AdminNavbar;