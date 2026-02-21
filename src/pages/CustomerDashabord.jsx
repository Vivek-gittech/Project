import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [customer, setCustomer] = useState(null); // Will hold the first customer object
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    const storename=localStorage.getItem("customer");
    if(storename){
      setCustomer(storename);
    }
  },[]);
  // const CustomerName=localStorage.getItem("Customer");
  console.log("CustomerName"+customer);


  // --- Combined API Fetch Logic ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch both Customers and Orders at once
        const [orderRes] = await Promise.all([
          // fetch('https://6995d141b081bc23e9c48a8f.mockapi.io/Customer'),
          fetch('https://6995d141b081bc23e9c48a8f.mockapi.io/Order')
        ]);

        if (!orderRes.ok) throw new Error('Failed to fetch data');

        // const custData = await custRes.json();
        const orderData = await orderRes.json();
        // Since MockAPI returns an array, we take the first customer
        // setCustomer(custData[0]); 
        setOrders(orderData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Live Status Logic ---
  const activeOrder = orders.find(o => 
    ['pending', 'preparing', 'ready'].includes(o.status?.toLowerCase())
  );

  const getStatusProgress = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('ready')) return '100%';
    if (s.includes('preparing')) return '66%';
    if (s.includes('pending')) return '20%';
    return '0%';
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const renderItemNames = (items) => {
    if (!items || (Array.isArray(items) && items.length === 0)) return "No items";
    return items.map((item, idx) => (
      <span key={idx}>
        {item.qty ? `${item.qty}x ` : ''}{item.name || 'Unknown'}
        {idx < items.length - 1 ? ', ' : ''}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-[#fafafb] dark:bg-[#0b0f1a] font-['Plus_Jakarta_Sans',_sans-serif] text-[#0d121b] dark:text-zinc-100 pb-10">
      
      {/* 1. Header */}
      <header className="sticky top-4 z-50 w-full flex justify-center">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-[85%] max-w-7xl bg-white/70 dark:bg-[#0b0f1a]/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-full px-8 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#135bec] rounded-full text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-sm font-bold">coffee</span>
            </div>
            <h2 className="text-lg font-black tracking-tighter uppercase">CafeConnect</h2>
          </div>
          <div className="flex items-center gap-10">
            <nav className="hidden lg:flex items-center gap-8">
              {['Home', 'Menu', 'Order', 'History'].map((item) => (
                <a key={item} href="#" className="text-[11px] font-black text-zinc-500 hover:text-[#135bec] transition-all uppercase tracking-[0.15em]">{item}</a>
              ))}
            </nav>
            <button className="px-6 py-2 bg-zinc-900 dark:bg-[#135bec] text-white rounded-full text-[10px] font-black uppercase tracking-widest">Manager Login</button>
          </div>
        </motion.div>
      </header>

      {/* 2. Main Content */}
      <motion.main variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Welcome Section - DYNAMIC NAME */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-2">
            Welcome back, <span className="text-[#135bec]">{isLoading ? "..." : (customer || "Guest")}!</span>
          </h1>
          <p className="text-zinc-500 font-medium italic">"Life begins after coffee."</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            
            {/* Live Status Card */}
            <AnimatePresence>
              {activeOrder && (
                <motion.div variants={itemVariants} initial="hidden" animate="visible" exit={{ opacity: 0, height: 0, marginBottom: 0 }} className="bg-white dark:bg-[#161e31] rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex justify-between items-end mb-8">
                      <div>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#135bec] mb-2">Live Status</h2>
                        <p className="text-2xl font-black">Order #{activeOrder.token || activeOrder.id} — {activeOrder.status}</p>
                      </div>
                      <span className="text-4xl font-black text-zinc-100 dark:text-zinc-800">{getStatusProgress(activeOrder.status)}</span>
                    </div>
                    <div className="relative h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-6">
                      <motion.div initial={{ width: 0 }} animate={{ width: getStatusProgress(activeOrder.status) }} transition={{ duration: 1.5 }} className="h-full bg-gradient-to-r from-[#135bec] to-[#3b82f6] rounded-full" />
                    </div>
                    <div className="flex items-center gap-3 text-zinc-400 font-bold text-sm">
                      <span className="material-symbols-outlined text-lg animate-pulse">{activeOrder.status?.toLowerCase() === 'ready' ? 'check_circle' : 'timer'}</span>
                      {activeOrder.status?.toLowerCase() === 'ready' ? 'Your order is ready!' : 'Our baristas are crafting your drink'}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* History Table - FILTERED FOR COMPLETE */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#161e31] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-zinc-100 dark:border-zinc-800 overflow-hidden">
              <div className="p-10 pb-4">
                <h2 className="text-2xl font-black tracking-tight">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50/50 dark:bg-zinc-800/30">
                    <tr className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                      <th className="px-10 py-5">Token</th>
                      <th className="px-10 py-5">Product Details</th>
                      <th className="px-10 py-5 text-right">Total</th>
                      <th className="px-10 py-5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                    <AnimatePresence mode='popLayout'>
                      {isLoading ? (
                         <tr><td colSpan="4" className="p-10 text-center animate-pulse">Loading orders...</td></tr>
                      ) : (
                        orders
                          .filter(order => order.status?.toLowerCase() === 'complete' || order.status?.toLowerCase() === 'completed')
                          .map((order, i) => (
                            <motion.tr key={order.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
                              <td className="px-10 py-6 text-sm font-bold text-zinc-400">#{order.token || order.id}</td>
                              <td className="px-10 py-6 text-sm font-black text-zinc-800 dark:text-zinc-200">{renderItemNames(order.items)}</td>
                              <td className="px-10 py-6 text-sm text-right font-black text-[#135bec]">${Number(order.totalPrice || 0).toFixed(2)}</td>
                              <td className="px-10 py-6 text-right">
                                <button className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-2xl hover:text-[#135bec] transition-all">
                                  <span className="material-symbols-outlined text-xl">replay</span>
                                </button>
                              </td>
                            </motion.tr>
                          ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
             <motion.div variants={itemVariants} className="bg-zinc-900 p-10 rounded-[2.5rem] text-white shadow-2xl">
                <h3 className="text-lg font-black mb-6">Quick Actions</h3>
                <button className="flex items-center justify-between w-full p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all font-bold text-sm">
                  Edit Profile <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
             </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default CustomerDashboard;