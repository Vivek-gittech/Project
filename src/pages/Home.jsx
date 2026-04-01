import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  }
};

const LandingPage = () => {
  const navigate = useNavigate();
  
  // 1. Initialize state directly from storage for the first render
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

  // 2. FIX: Effect to sync state on mount and listen for storage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      setIsLoggedIn(!!token);
      setUserRole(role);
    };

    // Check immediately on mount
    checkAuth();

    // Listen for changes (useful if login happens in another tab or via a specific redirect)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // --- Handlers ---
  const handleLogout = () => {
    localStorage.clear(); 
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  const handleAccountNavigation = () => {
    // 1. Get the values directly from storage right now
    const token = localStorage.getItem("token");
    
    // 2. Check for both "role" and "Role" just in case your backend uses a capital letter
    const role = localStorage.getItem("role") || localStorage.getItem("Role");

    console.log("Debug - Token exists:", !!token);
    console.log("Debug - Role found:", role);

    if (!token) {
      console.log("Redirecting to login because no token found");
      navigate("/Login");
      return;
    }

    // 3. Use .toUpperCase() to ignore case sensitivity (matches ADMIN, admin, Admin)
    if (role && role.toUpperCase() === "ADMIN") {
      navigate("/Admin/Dashboard");
    } else {
      // Default to customer if it's not admin
      navigate("/CustomerDashboard");
    }
  };

  const handleStartOrdering = () => {
    const currentToken = localStorage.getItem("token");
    navigate(currentToken ? "/Menu" : "/Login");
  };

  return (
    <div className="min-h-screen bg-[#fafafb] dark:bg-[#0b0f1a] font-['Plus_Jakarta_Sans',_sans-serif] text-[#0d121b] dark:text-zinc-100 pb-10 transition-colors duration-300">
      
      {/* 1. Header */}
      <header className="sticky top-4 z-50 w-full flex justify-center">
        <motion.div 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="w-[85%] max-w-7xl bg-white/70 dark:bg-[#0b0f1a]/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-full px-8 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#135bec] rounded-full text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-ml font-bold">coffee</span>
            </div>
            <h2 className="text-lg font-black tracking-tighter uppercase">Chai</h2>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/" className="text-[11px] font-black text-zinc-500 hover:text-[#135bec] transition-all uppercase tracking-[0.15em]">Home</Link>
              <Link to="/Menu" className="text-[11px] font-black text-zinc-500 hover:text-[#135bec] transition-all uppercase tracking-[0.15em]">Menu</Link>
            </nav>

            {!isLoggedIn ? (
              <Link to="/Login" className="px-6 py-2 bg-zinc-900 dark:bg-[#135bec] text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-95">
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleAccountNavigation}
                  className="flex items-center gap-2 px-4 py-2 bg-[#135bec]/10 text-[#135bec] rounded-full border border-[#135bec]/20 hover:scale-105 transition-all"
                >
                  <span className="material-symbols-outlined text-sm font-bold">
                     {userRole === 'ADMIN' ? 'admin_panel_settings' : 'person'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {userRole === 'ADMIN' ? 'ADMIN PANEL' : 'ACCOUNT'}
                  </span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="text-[10px] font-black uppercase text-zinc-400 hover:text-red-500 transition-colors tracking-widest"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </header>

      {/* 2. Main Content */}
      <motion.main 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        className="max-w-7xl mx-auto px-6 py-12"
      >
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-10">
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">
              Scan, Order, <br />
              <span className="text-[#135bec]">& Earn Rewards</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium max-w-md">
              Your favorite coffee, now just a tap away. Skip the line and join the modern way to dine.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={handleStartOrdering}
                className="px-8 py-4 bg-[#135bec] text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
              >
                Start Ordering
              </button>
              <Link to="/Menu" className="px-8 py-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl font-bold hover:bg-zinc-50 transition-all">
                View Menu
              </Link>
            </div>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white dark:border-zinc-800"
          >
            <img 
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop" 
              alt="Coffee" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 py-20">
          {[
            { icon: "qr_code_2", title: "Speedy QR Menu", desc: "Instant table-side ordering." },
            { icon: "stars", title: "Loyalty Points", desc: "Earn points with every sip." },
            { icon: "chat_bubble", title: "Quick Feedback", desc: "Tell us how we did." },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white dark:bg-[#161e31] p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-[#135bec]/10 text-[#135bec] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined font-bold">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-black mb-2">{feature.title}</h3>
              <p className="text-zinc-500 text-sm font-medium">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.main>
    </div>
  );
};

export default LandingPage;