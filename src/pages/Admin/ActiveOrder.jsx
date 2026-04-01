import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const userName = localStorage.getItem("name") || "Admin";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// --- Sub-Components ---

const SidebarItem = ({ icon, label }) => (
  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group">
    <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-[#135bec]">
      {icon}
    </span>
    <span className="text-sm font-semibold">{label}</span>
  </div>
);

const OrderCard = ({ order, accentColor }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, x: -20 }}
    whileHover={{ y: -4 }}
    className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden"
  >
    <div className={`absolute top-0 left-0 w-1.5 h-full ${accentColor}`}></div>
    
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black text-slate-400">#{order.id}</span>
          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-black uppercase tracking-tighter">
            {order.type}
          </span>
        </div>
        <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{order.customer}</h4>
      </div>
      <div className="text-right">
        <span className={`block text-xl font-black tracking-tighter ${order.status === 'Ready' ? 'text-green-600' : 'text-[#135bec]'}`}>
          #{order.token}
        </span>
        <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Token</span>
      </div>
    </div>

    <div className="space-y-2 mb-4 border-t border-slate-50 dark:border-slate-800 pt-3">
      {order.items.map((item, idx) => (
        <div key={idx} className="flex justify-between text-xs font-medium">
          <span className="text-slate-500">{item.qty}x {item.name}</span>
          <span>${item.price.toFixed(2)}</span>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
      <div className="flex flex-col">
        <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Total</span>
        <span className="text-sm font-black">${order.total.toFixed(2)}</span>
      </div>
      <button className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-md ${
        order.status === 'Ready' ? 'bg-green-600 shadow-green-500/20' : 'bg-slate-900 dark:bg-[#135bec] shadow-blue-500/20'
      }`}>
        {order.status === 'Preparing' ? 'Ready' : 'Finish'}
      </button>
    </div>
  </motion.div>
);

const ColumnSection = ({ label, color, count, children }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between px-2">
      <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-[0.2em] text-[10px]">
        <span className={`size-2.5 ${color} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]`}></span>
        {label}
      </h3>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{count} items</span>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export default function ActiveOrders() {
  const [activeFilter, setActiveFilter] = useState('All');

  const orders = [
    { id: 'ORD-2481', customer: 'Alex Johnson', type: 'T-12', token: '42', total: 26.50, status: 'Preparing', items: [{ qty: 2, name: 'Caramel Macchiato', price: 12.00 }, { qty: 1, name: 'Avocado Toast', price: 14.50 }] },
    { id: 'ORD-2479', customer: 'Mike Ross', type: 'T-04', token: '38', total: 8.50, status: 'Ready', items: [{ qty: 1, name: 'Blueberry Muffin', price: 4.00 }, { qty: 1, name: 'Flat White', price: 4.50 }] },
    { id: 'ORD-2475', customer: 'Liam Wilson', type: 'DELIVERY', token: '34', total: 40.00, status: 'Delivery', items: [{ qty: 3, name: 'Cappuccino Large', price: 18.00 }] },
  ];

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#0b0f1a] font-['Plus_Jakarta_Sans',_sans-serif] text-slate-900 dark:text-slate-100">
      
      {/* 1. Shared Floating Header */}
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
                <p className="text-[9px] text-green-500 font-bold uppercase leading-none">Online</p>
              </div>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-800 shadow-md" alt="profile"/>
            </button>
          </div>
        </motion.div>
      </header>

      <div className="flex pt-32 px-6 max-w-[1600px] mx-auto gap-6">
        
        {/* 2. Sidebar */}
        <aside className="w-60 shrink-0 hidden lg:flex flex-col gap-2 sticky top-32 h-fit">
          <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Workflow</div>
          <NavLink to="/Admin/Dashboard"><SidebarItem icon="dashboard" label="Dashboard" /></NavLink>
          <NavLink to="/Admin/Orders" className="bg-[#135bec] text-white rounded-xl shadow-lg shadow-blue-500/20"><SidebarItem icon="shopping_bag" label="Active Orders" /></NavLink>
          <NavLink to="/Admin/Menu"><SidebarItem icon="restaurant_menu" label="Menu Editor" /></NavLink>
        </aside>

        {/* 3. Main Content (Kanban Style) */}
        <motion.main 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 space-y-10 pb-32"
        >
          <div className="flex items-center justify-between">
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl font-black tracking-tighter">Live Tracker.</h1>
              <p className="text-slate-500 text-sm font-medium">Manage incoming and ready-to-serve orders.</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              {['All', 'Preparing', 'Ready'].map((f) => (
                <button 
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeFilter === f ? 'bg-slate-900 dark:bg-[#135bec] text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <ColumnSection label="Preparing" color="bg-orange-500" count={8}>
              <AnimatePresence mode='popLayout'>
                {orders.filter(o => o.status === 'Preparing').map(order => (
                  <OrderCard key={order.id} order={order} accentColor="bg-orange-500" />
                ))}
              </AnimatePresence>
            </ColumnSection>

            <ColumnSection label="Ready to Serve" color="bg-green-500" count={5}>
              <AnimatePresence mode='popLayout'>
                {orders.filter(o => o.status === 'Ready').map(order => (
                  <OrderCard key={order.id} order={order} accentColor="bg-green-500" />
                ))}
              </AnimatePresence>
            </ColumnSection>

            <ColumnSection label="Out for Delivery" color="bg-[#135bec]" count={2}>
              <AnimatePresence mode='popLayout'>
                {orders.filter(o => o.status === 'Delivery').map(order => (
                  <OrderCard key={order.id} order={order} accentColor="bg-[#135bec]" />
                ))}
              </AnimatePresence>
            </ColumnSection>
          </div>
        </motion.main>
      </div>
    </div>
  );
}