import React from "react";
import { Link,useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Animation Variants (Matching Dashboard Style) ---
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

  const handleStartOrdering = () => {
    const customer = localStorage.getItem("customer");
    
    if (customer) {
      // If logged in, go to the menu or dashboard
      navigate("/menu");
    } else {
      // If not logged in, go to login/signup
      navigate("/login"); 
    }
  };
  return (
    <div className="min-h-screen bg-[#fafafb] dark:bg-[#0b0f1a] font-['Plus_Jakarta_Sans',_sans-serif] text-[#0d121b] dark:text-zinc-100 pb-10 transition-colors duration-300">
      
      {/* 1. Shared Header Component */}
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
          <div className="flex items-center gap-10">
          <nav className="hidden lg:flex items-center gap-8">
              {[
                { name: 'Home', path: '/' },
                { name: 'Menu', path: '/Menu' },
                { name: 'Order', path: '/Order' },
                { name: 'History', path: '/History' }
              ].map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="text-[11px] font-black text-zinc-500 hover:text-[#135bec] transition-all uppercase tracking-[0.15em]">
                  {link.name}
                </Link>
              ))}
            </nav>
            <Link to="/Login" className="px-6 py-2 bg-zinc-900 dark:bg-[#135bec] text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-95">Login</Link>
          </div>
        </motion.div>
      </header>

      {/* 2. Main Content with Staggered Animations */}
      <motion.main 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        className="max-w-7xl mx-auto px-6 py-12"
      >
        
        {/* Hero Section */}
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
              <button onClick={handleStartOrdering} className="px-8 py-4 bg-[#135bec] text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all">
                Start Ordering
              </button>
              <Link to="/Menu" className="px-8 py-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl font-bold hover:bg-zinc-50 transition-all">View Menu</Link>
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

        {/* Loyalty Program Call to Action */}
        <motion.div variants={itemVariants} className="bg-zinc-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col items-center text-center gap-6">
            <h2 className="text-4xl font-black tracking-tight">Ready to earn free coffee?</h2>
            <p className="text-zinc-400 max-w-lg">Join 5,000+ happy customers already earning rewards. Get a free pastry just for signing up today!</p>
            <button className="px-10 py-4 bg-[#135bec] rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform">
              Join Rewards Program
            </button>
          </div>
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32"></div>
        </motion.div>

      </motion.main>

      {/* Footer */}
      <footer className="mt-20 py-10 border-t border-zinc-100 dark:border-zinc-800 text-center">
        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">© 2026 CafeConnect System</p>
        <Link to="/CustomerDashboard">Customer</Link>
        <Link to="/ManagerDashboard">Manager</Link>
        <Link to="/Register">Register</Link>
      </footer>
    </div>
  );
};

export default LandingPage;