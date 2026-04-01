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

// --- Fixed Order Card Component ---
const OrderCard = ({ order, onUpdate }) => {
  const rawStatus = (order.order_status || 'pending').toLowerCase();
  
  const statusStyles = {
    pending: { 
        border: 'border-t-amber-500', bg: 'bg-amber-500/5', text: 'text-amber-600', 
        badge: 'border-amber-500/20 text-amber-600', icon: 'schedule' 
    },
    preparing: { 
        border: 'border-t-blue-500', bg: 'bg-blue-500/5', text: 'text-blue-600', 
        badge: 'border-blue-500/20 text-blue-600', icon: 'fire_truck' 
    },
    done: { 
        border: 'border-t-emerald-500', bg: 'bg-emerald-500/5', text: 'text-emerald-600', 
        badge: 'border-emerald-500/20 text-emerald-600', icon: 'check_circle' 
    },
    cancelled: { 
        border: 'border-t-rose-500', bg: 'bg-rose-500/5', text: 'text-rose-600', 
        badge: 'border-rose-500/20 text-rose-600', icon: 'cancel' 
    }
  };

  const style = statusStyles[rawStatus] || statusStyles.pending;

  return (
    <div className={`flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border-t-[10px] ${style.border} overflow-hidden border border-slate-200 dark:border-slate-800 h-full transition-all`}>
      <div className={`p-6 ${style.bg} border-b border-slate-100 dark:border-slate-800`}>
        <div className="flex justify-between items-start">
          <div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${style.text}`}>Ticket #{order.order_id}</span>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Table {order.table_number}</h2>
          </div>
          <div className={`bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full text-[10px] font-black uppercase border flex items-center gap-1.5 ${style.badge}`}>
              <span className="material-symbols-outlined text-[14px]">{style.icon}</span>
              {order.order_status}
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 space-y-4">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <span className={`font-black size-8 rounded-xl flex items-center justify-center text-xs ${style.bg} ${style.text} shrink-0`}>
                {item.qty}
            </span>
            <div className="flex-1">
              <p className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase leading-tight">{item.name}</p>
              {item.note && <p className="text-[11px] text-slate-400 font-medium italic mt-0.5">"{item.note}"</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 grid grid-cols-3 gap-2 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
          <button onClick={() => onUpdate(order.order_id, 'Preparing')} className="flex flex-col items-center justify-center py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-blue-600 hover:text-white transition-all group">
            <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">skillet</span>
            <span className="text-[8px] font-black uppercase mt-1">Cook</span>
          </button>
          
          <button onClick={() => onUpdate(order.order_id, 'Done')} className="flex flex-col items-center justify-center py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-emerald-500 hover:text-white transition-all group">
            <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">done_all</span>
            <span className="text-[8px] font-black uppercase mt-1">Finish</span>
          </button>

          <button onClick={() => onUpdate(order.order_id, 'Cancelled')} className="flex flex-col items-center justify-center py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-500 hover:text-white transition-all group">
            <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">close</span>
            <span className="text-[8px] font-black uppercase mt-1">Void</span>
          </button>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
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
    // IMPORTANT: Find the existing order to satisfy the 'nullable = false' waiter_id constraint
    const currentOrder = orders.find(o => o.order_id === orderId);
    if (!currentOrder) return;

    // 1. Optimistic Update (Immediate UI response)
    const previousOrders = [...orders];
    setOrders(current => 
      current.map(order => 
        order.order_id === orderId ? { ...order, order_status: newStatus } : order
      )
    );

    try {
      const token = localStorage.getItem("token");
      
      // 2. Prepare full body for the backend entity
      const updateData = {
        order_id: orderId,
        order_status: newStatus,
        waiter_id: currentOrder.waiter_id // Must be sent because @Column(nullable = false)
      };

      const response = await fetch(`http://localhost:8080/Order/Update/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        setOrders(previousOrders); // Rollback on error
        console.error("Failed to update status on server");
      }
    } catch (error) {
      setOrders(previousOrders);
      console.error(`Error updating status:`, error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const currentStatus = (order.order_status || 'pending').toLowerCase();
    if (activeFilter === 'all') {
        return currentStatus !== 'cancelled' && currentStatus !== 'done';
    }
    return currentStatus === activeFilter;
  });

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#0b0f1a] font-['Plus_Jakarta_Sans',_sans-serif] text-slate-900 dark:text-slate-100">
      
      {/* Header */}
      <header className="fixed top-6 z-50 w-full flex justify-center px-4 pointer-events-none">
        <motion.div 
          initial={{ y: -50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="w-full max-w-7xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-full px-8 py-3 shadow-2xl flex items-center justify-between pointer-events-auto"
        >
          <div className="flex items-center gap-3">
            <div className="size-9 bg-[#135bec] rounded-full text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-sm font-bold">local_cafe</span>
            </div>
            <h2 className="text-sm font-black uppercase hidden sm:block">Chai</h2>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {['Home', 'Menu', 'History'].map((link) => (
              <Link key={link} to={link === 'Home' ? '/' : `/${link}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-[#135bec]">
                {link}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black uppercase">{userName}</p>
              <p className="text-[9px] text-green-500 font-bold uppercase">Chef</p>
            </div>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-800" alt="profile"/>
          </div>
        </motion.div>
      </header>

      <div className="flex pt-28 px-6 max-w-[1600px] mx-auto gap-6">
        <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-2">
          <div className="px-4 py-2 text-[10px] font-black uppercase text-slate-400">Main Menu</div>
          <SidebarItem icon="dashboard" label="Live Queue" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
          <SidebarItem icon="potted_plant" label="Pending" active={activeFilter === 'pending'} onClick={() => setActiveFilter('pending')} />
          <SidebarItem icon="skillet" label="Preparing" active={activeFilter === 'preparing'} onClick={() => setActiveFilter('preparing')} />
          <SidebarItem icon="check_circle" label="Completed" active={activeFilter === 'done'} onClick={() => setActiveFilter('done')} />
          
          <div className="mt-auto pb-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <SidebarItem icon="logout" label="Sign Out" onClick={() => { localStorage.clear(); window.location.href = "/login"; }} />
          </div>
        </aside>

        <main className="flex-1 space-y-8 pb-20">
          <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight capitalize">{activeFilter} Orders</h1>
              <span className="bg-[#135bec] text-white text-xs font-black px-3 py-1 rounded-full">{filteredOrders.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode='popLayout'>
              {filteredOrders.map((order) => (
                <motion.div key={order.order_id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <OrderCard order={order} onUpdate={updateOrderStatus} />
                </motion.div>
              ))} 
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChefDashboard;