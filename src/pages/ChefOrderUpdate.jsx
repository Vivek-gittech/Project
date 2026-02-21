import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChefDashboard = () => {
  // Dummy data representing orders in the queue
  const [orders, setOrders] = useState([
    {
      id: 1024,
      token: "42",
      table: "05",
      time: "08:45",
      timestamp: "14:36",
      status: "pending", 
      type: "Dine-in",
      items: [
        { qty: 2, name: "Signature Wagyu Burger", note: "Medium Rare, No Mayo" },
        { qty: 1, name: "Truffle Fries", note: "" }
      ],
      allergy: "ALLERGY: NO ONIONS"
    },
    {
      id: 1025,
      token: "43",
      table: "Takeout",
      time: "02:15",
      timestamp: "14:42",
      status: "pending",
      type: "Takeout",
      items: [
        { qty: 1, name: "Pepperoni Pizza", note: "Large, Extra Cheese" }
      ]
    },{
        id: 1025,
        token: "43",
        table: "Takeout",
        time: "02:15",
        timestamp: "14:42",
        status: "pending",
        type: "Takeout",
        items: [
          { qty: 1, name: "Pepperoni Pizza", note: "Large, Extra Cheese" }
        ]
      }
  ]);

  const stats = [
    { label: "Pending", count: "08", icon: "pending_actions", color: "amber" },
    { label: "Preparing", count: "05", icon: "orange", color: "orange" },
    { label: "Ready", count: "24 Today", icon: "check_circle", color: "green" },
    { label: "Cancelled", count: "02", icon: "cancel", color: "slate" }
  ];

  return (
    <div className="font-['Work_Sans'] bg-[#f8f7f6] dark:bg-[#1a140e] text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        
        {/* Header */}
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

        <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Pending" count="08" icon="pending_actions" color="border-yellow-400" textColor="text-yellow-600" />
            <StatCard label="Preparing" count="05" icon="skillet" color="border-[#ec7f13]" textColor="text-[#ec7f13]" />
            <StatCard label="Ready" count="24" icon="check_circle" color="border-green-500" textColor="text-green-600" />
            <StatCard label="Cancelled" count="02" icon="cancel" color="border-red-500" textColor="text-red-600" />
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
            
            {/* Waiting Placeholder */}
            <div className="border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center p-8 text-slate-300 dark:text-slate-700 min-h-[400px]">
              <span className="material-symbols-outlined text-6xl mb-4 animate-spin-slow text-slate-200">refresh</span>
              <p className="font-black text-lg uppercase tracking-widest">Waiting for Orders</p>
            </div>
          </div>
        </main>

        {/* Floating Actions */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3">
          <button className="size-14 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-2xl">print</span>
          </button>
          <button className="size-14 rounded-full bg-[#ec7f13] text-white shadow-2xl shadow-[#ec7f13]/40 flex items-center justify-center hover:scale-110 active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, count, icon, color, textColor }) => (
  <div className={`bg-white dark:bg-slate-900 p-4 rounded-xl border-l-4 ${color} shadow-sm flex items-center gap-4`}>
    <div className={`size-10 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-slate-800 ${textColor}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase">{label}</p>
      <p className="text-xl font-bold">{count}</p>
    </div>
  </div>
);

const OrderCard = ({ order }) => {
  const isPending = order.status === 'pending';
  const isDone=order.status==='done';

  // Status-based colors for the card header and border
  const borderColor = isPending ? 'border-yellow-400' : 'border-[#ec7f13]';
  const headerBg = isPending ? 'bg-yellow-400/5' : 'bg-[#ec7f13]/5';
  const textColor = isPending ? 'text-yellow-600' : 'text-[#ec7f13]';

  return (
    <div className={`flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-xl border-t-8 ${borderColor} overflow-hidden transition-all`}>
      {/* Header */}
      <div className={`p-4 ${headerBg} border-b border-slate-100 dark:border-slate-800`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${textColor}`}>Token Number</span>
            <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">#{order.token}</span>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 px-3 py-1 rounded-full shadow-sm">
            <span className="text-xs font-bold">{order.type}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2 font-bold text-slate-500">
           <span className="material-symbols-outlined text-sm">timer</span>
           <span className="text-sm">{order.time}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1">
        <ul className="space-y-3">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex gap-3">
              <span className={`font-black px-2 py-0.5 rounded text-sm bg-slate-100 dark:bg-slate-800 ${textColor}`}>{item.qty}</span>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                {item.note && <p className="text-xs text-slate-500 italic">{item.note}</p>}
              </div>
            </li>
          ))}
        </ul>
        {order.allergy && (
          <div className="mt-4 p-2 bg-red-50 dark:bg-red-900/20 border border-red-100 rounded text-[10px] font-bold text-red-600 uppercase">
            ⚠️ {order.allergy}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-3 gap-2">
          
          {/* PENDING: Yellow border, yellow fill on hover */}
          <button className="flex flex-col items-center justify-center py-2 rounded-lg border-2 border-yellow-400 text-yellow-600 bg-white dark:bg-slate-800 hover:bg-yellow-400 hover:text-white transition-all text-[10px] font-bold uppercase gap-1">
            <span className="material-symbols-outlined text-lg font-bold">hourglass_empty</span>
            Preparing
          </button>
          
          {/* DONE: Green border, green fill on hover */}
          <button className="flex flex-col items-center justify-center py-2 rounded-lg border-2 border-green-500 text-green-600 bg-white dark:bg-slate-800 hover:bg-green-500 hover:text-white transition-all text-[10px] font-bold uppercase gap-1">
            <span className="material-symbols-outlined text-lg font-bold">check_circle</span>
            Done
          </button>
          
          {/* CANCEL: Red border, red fill on hover */}
          <button className="flex flex-col items-center justify-center py-2 rounded-lg border-2 border-red-500 text-red-600 bg-white dark:bg-slate-800 hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold uppercase gap-1">
            <span className="material-symbols-outlined text-lg font-bold">close</span>
            Cancel
          </button>

        </div>
      </div>
    </div>
  );
};

export default ChefDashboard;