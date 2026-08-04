import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, BarChart3, Upload, Calculator, Home, User, LogOut, UserPlus } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const links = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/predict', label: 'Predict', icon: Calculator },
    { path: '/batch', label: 'Batch Upload', icon: Upload },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  // Read login info from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const userName = localStorage.getItem("name");

    if (token) {
      setIsLoggedIn(true);
      setRole(userRole);
      setName(userName);
    } else {
      setIsLoggedIn(false);
      setRole(null);
      setName(null);
    }
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold font-outfit tracking-tight">GradeOracle</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side: Auth Buttons / Profile */}
          <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
            {!isLoggedIn ? (
              <>
                {/* Register Button */}
                <button
                  onClick={() => navigate("/register")}
                  className="hidden md:flex items-center space-x-1 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </button>

                {/* Login Button */}
                <button
                  onClick={() => navigate("/login")}
                  className="hidden md:block px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                {/* Avatar Button */}
                <button
                  onClick={() => setOpenProfile(!openProfile)}
                  className="hidden md:flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-full transition"
                >
                  <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {name ? name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-slate-900">{name}</p>
                    <p className="text-xs text-slate-500 capitalize">{role}</p>
                  </div>
                </button>

                {/* Dropdown */}
                {openProfile && (
                  <div className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50">
                    <button
                      onClick={() => {
                        setOpenProfile(false);
                        navigate("/profile");
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Mobile menu button */}
            <button
              data-testid="mobile-menu-button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Mobile Login / Register / Logout */}
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/register");
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg border border-primary text-primary font-semibold"
                >
                  Register
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg bg-primary text-white font-semibold"
                >
                  Login
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-semibold"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
