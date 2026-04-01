import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const userName = localStorage.getItem("name") || "Chef";

// --- Sub-Components ---
const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer mb-1 ${
      active 
      ? "bg-[#135bec] text-white shadow-lg shadow-blue-500/20" 
      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="text-sm font-semibold">{label}</span>
  </div>
);

const ChefDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:8080/Order/Get', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); 
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    // 1. Find the existing order to get the waiter_id (Required by your Backend)
    const currentOrder = orders.find(o => o.order_id === orderId);
    if (!currentOrder) return;

    // 2. Optimistic UI Update
    const previousOrders = [...orders];
    setOrders(prev => prev.map(order => 
      order.order_id === orderId ? { ...order, order_status: newStatus } : order
    ));

    try {
      const token = localStorage.getItem("token");
      
      // 3. Construct the full payload for your @Column(nullable = false) requirements
      const payload = {
        order_id: orderId,
        order_status: newStatus,
        waiter_id: currentOrder.waiter_id, // CRITICAL: This was missing
        table_number: currentOrder.table_number
      };

      const response = await fetch(`http://localhost:8080/Order/Update/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        setOrders(previousOrders); // Revert if server rejects
        console.error("Server update failed");
      }
    } catch (error) {
      console.error(`Error updating status:`, error);
      setOrders(previousOrders);
    }
  };

  const filteredOrders = orders.filter(order => {
    const currentStatus = (order.order_status || 'pending').toLowerCase();
    if (activeFilter === 'all') return currentStatus !== 'cancelled' && currentStatus !== 'complete';
    return currentStatus === activeFilter;
  });

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#0b0f1a] font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-slate-100">
      
      {/* Header */}
      <header className="fixed top-6 z-50 w-full flex justify-center px-4 pointer-events-none">
        <motion.div 
          initial={{ y: -50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="w-full max-w-7xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-full px-8 py-3 shadow-2xl flex items-center justify-between pointer-events-auto"
        >
          <div className="flex items-center gap-3">
            <div className="size-9 bg-[#135bec] rounded-full text-white flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-sm font-bold">local_cafe</span>
            </div>
            <h2 className="text-sm font-black tracking-tighter uppercase">Chai Kitchen</h2>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {['Home', 'Menu', 'History'].map((link) => (
              <Link key={link} to={link === 'Home' ? '/' : `/${link}`} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#135bec]">
                {link}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black uppercase">{userName}</p>
              <p className="text-[9px] text-green-500 font-bold uppercase">Head Chef</p>
            </div>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} className="w-9 h-9 rounded-full border-2 border-white shadow-md" alt="profile"/>
          </div>
        </motion.div>
      </header>

      <div className="flex pt-32 px-6 max-w-[1600px] mx-auto gap-8">
        <aside className="w-64 shrink-0 hidden lg:flex flex-col">
          <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Kitchen Queue</p>
          <SidebarItem icon="view_quilt" label="Live Tickets" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
          <SidebarItem icon="hourglass_empty" label="Pending" active={activeFilter === 'pending'} onClick={() => setActiveFilter('pending')} />
          <SidebarItem icon="cooking" label="Preparing" active={activeFilter === 'preparing'} onClick={() => setActiveFilter('preparing')} />
          <SidebarItem icon="check_circle" label="Ready / Done" active={activeFilter === 'complete'} onClick={() => setActiveFilter('complete')} />
          
          <div className="mt-auto pb-10">
            <SidebarItem icon="logout" label="Sign Out" onClick={() => { localStorage.clear(); window.location.href = "/login"; }} />
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-black tracking-tight capitalize">{activeFilter} Orders</h1>
            <p className="text-slate-500 font-medium">Managing {filteredOrders.length} active tickets.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode='popLayout'>
              {filteredOrders.map((order) => (
                <motion.div key={order.order_id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -20 }}>
                  <OrderCard order={order} onUpdate={updateOrderStatus} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!loading && filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center p-20 border-4 border-dashed border-slate-200 rounded-[3rem] opacity-30">
              <span className="material-symbols-outlined text-7xl">restaurant</span>
              <p className="font-black uppercase tracking-widest mt-4">Kitchen is Clear</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const OrderCard = ({ order, onUpdate }) => {
  const status = (order.order_status || 'pending').toLowerCase();
  
  // Use static class mapping to avoid Tailwind purging
  const config = {
    pending: { 
        bg: 'bg-amber-500/5', 
        text: 'text-amber-600', 
        border: 'border-amber-500/20',
        btn: 'bg-amber-500',
        icon: 'schedule', 
        next: 'Preparing', // Match case of your backend strings
        label: 'Start' 
    },
    preparing: { 
        bg: 'bg-blue-500/5', 
        text: 'text-blue-600', 
        border: 'border-blue-500/20',
        btn: 'bg-blue-500',
        icon: 'skillet', 
        next: 'Complete', 
        label: 'Finish' 
    },
    complete: { 
        bg: 'bg-emerald-500/5', 
        text: 'text-emerald-600', 
        border: 'border-emerald-500/20',
        btn: 'bg-emerald-500',
        icon: 'verified', 
        next: null, 
        label: 'Done' 
    },
    cancelled: { 
        bg: 'bg-rose-500/5', 
        text: 'text-rose-600', 
        border: 'border-rose-500/20',
        btn: 'bg-rose-500',
        icon: 'block', 
        next: null, 
        label: 'Void' 
    }
  };

  const style = config[status] || config.pending;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col h-full overflow-hidden">
      <div className={`p-6 border-b border-slate-100 dark:border-slate-800 ${style.bg}`}>
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-[10px] font-black uppercase ${style.text}`}>Ticket #{order.order_id}</p>
            <h2 className="text-4xl font-black tracking-tighter">Table {order.table_number}</h2>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border bg-white ${style.border} ${style.text}`}>
            {status}
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 space-y-4">
        {order.items?.map((item, i) => (
          <div key={i} className="flex gap-3 items-center">
            <span className="size-7 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-xs font-black">{item.qty}</span>
            <p className="text-sm font-bold uppercase">{item.name}</p>
          </div>
        ))}
      </div>

      <div className="p-4 grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50">
        {style.next && (
          <button 
            onClick={() => onUpdate(order.order_id, style.next)}
            className={`flex items-center justify-center gap-2 py-3 rounded-2xl ${style.btn} text-white font-black uppercase text-[10px] shadow-lg hover:scale-[1.02] transition-transform`}
          >
            <span className="material-symbols-outlined text-sm">{style.icon}</span> {style.label}
          </button>
        )}
        <button 
          onClick={() => onUpdate(order.order_id, 'Cancelled')}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black uppercase text-[10px] hover:bg-rose-50 hover:text-rose-500 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">close</span> Void
        </button>
      </div>
    </div>
  );
};

export default ChefDashboard;