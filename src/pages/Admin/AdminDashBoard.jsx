import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const userName = localStorage.getItem("name") || "Admin";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

// --- Sub-Components ---
const SidebarItem = ({ icon, label, active = false }) => (
  <div 
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
      active 
        ? "bg-[#135bec] text-white shadow-lg shadow-blue-500/20" 
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="text-sm font-semibold">{label}</span>
  </div>
);

const KPICard = ({ title, value, trend, trendUp, icon, iconColor, isCritical }) => (
  <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">{title}</p>
      <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${iconColor}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
    </div>
    <h3 className={`text-3xl font-black tracking-tighter ${isCritical ? 'text-rose-600' : ''}`}>{value}</h3>
    {trend && (
      <p className={`text-xs mt-2 font-bold flex items-center gap-1 ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
        <span className="material-symbols-outlined text-xs">{trendUp ? 'trending_up' : 'trending_down'}</span> 
        {trend}
      </p>
    )}
  </motion.div>
);

export default function CafeAdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // 1. Dashboard Data State
  const [stats, setStats] = useState({
    totalBill: 0,
    totalCustomer: 0,
    totalPendingOrder: 0,
    totalCompleteOrder: 0,
    totalCancelOrder: 0
  });
  const [loading, setLoading] = useState(true);

  // 2. Fetch Data from Spring Boot API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Retrieve the token from storage
        const token = localStorage.getItem("token"); 
    
        // 2. Perform the fetch with headers
        const response = await fetch('http://localhost:8080/DashBoard/GetDetails', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Ensure the word 'Bearer ' is present
            'Content-Type': 'application/json'
          }
        });
    
        // 3. Handle 403 or other non-200 responses
        if (!response.ok) {
          if (response.status === 403) {
            console.error("Access Denied: Your account doesn't have Admin permissions.");
          }
          throw new Error(`Network response was not ok: ${response.status}`);
        }
    
        // 4. Parse and set data
        const data = await response.json();
        setStats(data);
        setLoading(false);
    
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#0b0f1a] font-['Plus_Jakarta_Sans',_sans-serif] text-slate-900 dark:text-slate-100">
      
      {/* 1. Floating Header */}
      <header className="fixed top-6 z-50 w-full flex justify-center px-4 pointer-events-none">
              <motion.div 
                initial={{ y: -50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                className="w-full max-w-7xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-full px-8 py-3 shadow-2xl flex items-center justify-between pointer-events-auto"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 bg-[#135bec] rounded-full text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <span className="material-symbols-outlined text-sm font-bold">local_cafe</span>
                  </div>
                  <h2 className="text-sm font-black tracking-tighter uppercase hidden sm:block">
                    Chai</h2>
                </div>
      
                <nav className="hidden lg:flex items-center gap-8">
                  {['Home', 'Menu', 'History'].map((link) => (
                    <Link 
                      key={link} 
                      to={link === 'Home' ? '/' : `/${link}`} 
                      className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${link === 'Order' ? 'text-[#135bec]' : 'text-slate-500 hover:text-[#135bec]'}`}
                    >
                      {link}
                    </Link>
                  ))}
                </nav>
      
                <div className="flex items-center gap-4">
                  <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>
                  <button className="flex items-center gap-3 group">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] font-black uppercase tracking-widest">{userName}</p>
                      <p className="text-[9px] text-green-500 font-bold uppercase leading-none">Admin</p>
                    </div>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-800 shadow-md" alt="profile"/>
                  </button>
                </div>
              </motion.div>
            </header>

      <div className="flex pt-28 px-6 max-w-[1600px] mx-auto gap-6">
        
        {/* 2. Sidebar */}
        <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-2">
          <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Main Menu</div>
          <NavLink to="/Admin/Dashboard"><SidebarItem icon="dashboard" label="Dashboard" active /></NavLink>
          <NavLink to="/Admin/ActiveOrder"><SidebarItem icon="shopping_bag" label="Active Orders" /></NavLink>
          <NavLink to="/Admin/Menu"><SidebarItem icon="restaurant_menu" label="Menu Editor" /></NavLink>
          
          <div className="mt-6 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Management</div>
          <NavLink to="/Admin/Staff"><SidebarItem icon="badge" label="Staff Team" /></NavLink>
          <NavLink to="/Admin/Customer"><SidebarItem icon="group" label="Customer Base" /></NavLink>
          <SidebarItem icon="analytics" label="Revenue Reports" />
          
          <div className="mt-auto pb-10">
             <SidebarItem icon="logout" label="Sign Out" />
          </div>
        </aside>

        {/* 3. Main Dashboard Area */}
        <motion.main 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 space-y-8 pb-20"
        >
          {/* Welcome Header */}
          <motion.div variants={itemVariants} className="flex flex-col gap-1">
            <h1 className="text-4xl font-black tracking-tight">System Overview</h1>
            <p className="text-slate-500 font-medium">Monitoring your cafe performance for today.</p>
          </motion.div>

          {/* Stats Row Linked to API */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <KPICard 
              title="Total Customer" 
              value={loading ? "..." : stats.totalCustomer.toLocaleString()} 
              trend="Registered" 
              trendUp={true} 
              icon="group" 
              iconColor="text-indigo-500" 
            />
            <KPICard 
              title="Revenue" 
              value={loading ? "..." : `${Number(stats.totalBill).toFixed(2)}`} 
              trend="Revenue" 
              trendUp={true} 
              icon="payments" 
              iconColor="text-blue-600" 
            />
            <KPICard 
              title="Live Pending Orders" 
              value={loading ? "..." : stats.totalPendingOrder} 
              trend="Pending Now" 
              trendUp={true} 
              icon="bolt" 
              iconColor="text-amber-500" 
            />
            <KPICard 
              title="Total Complete Order" 
              value={loading ? "..." : stats.totalCompleteOrder} 
              trend="Complete Order" 
              trendUp={true} 
              icon="bolt" 
              iconColor="text-amber-500" 
            />
            <KPICard 
              title="Total Canceled" 
              value={loading ? "..." : stats.totalCancelOrder} 
              trend="Needs attention" 
              trendUp={false} 
              icon="warning" 
              iconColor="text-rose-500" 
              isCritical={stats.totalCancelOrder > 5} 
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Chart Area */}
            <motion.div variants={itemVariants} className="xl:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                 <h4 className="text-lg font-black tracking-tight">Weekly Sales Traffic</h4>
                 <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-full text-[10px] font-black uppercase px-4 py-2 outline-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                 </select>
              </div>
              <div className="h-64 flex items-end justify-between gap-3 px-2">
                {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                  <div key={i} className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl relative group overflow-hidden">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="bg-[#135bec] w-full rounded-2xl"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Activity */}
            <motion.div variants={itemVariants} className="bg-zinc-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                <h4 className="text-lg font-black mb-6 relative z-10">Quick Actions</h4>
                <div className="space-y-3 relative z-10">
                   <button className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-xs font-black uppercase tracking-widest transition-all">Download Reports</button>
                   <button className="w-full py-4 bg-[#135bec] hover:bg-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">Add New Staff</button>
                   <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">Manage Menu</button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 blur-[80px]"></div>
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}