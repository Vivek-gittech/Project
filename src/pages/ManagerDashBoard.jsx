import React, { useState } from 'react';

const Dashboard = () => {
  const [activeNav, setActiveNav] = useState('Dashboard');

  // Mock Data for cleaner JSX
  const STATS = [
    { label: "Daily Sales", value: "$1,240.50", trend: "+12.5%", icon: "payments", color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Orders", value: "84", trend: "+5%", icon: "shopping_bag", color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "New Loyalty Members", value: "12", trend: "Today", icon: "group_add", color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const ORDERS = [
    { id: "#1024", items: "2x Oat Milk Latte, 1x Croissant", note: "Extra hot", time: "4m ago", status: "Preparing", statusColor: "bg-blue-100 text-blue-600" },
    { id: "#1025", items: "1x Double Espresso", note: "Dine-in", time: "2m ago", status: "Pending", statusColor: "bg-amber-100 text-amber-600" },
    { id: "#1023", items: "1x Flat White", note: "Loyalty Reward used", time: "8m ago", status: "Ready", statusColor: "bg-green-100 text-green-600" },
    { id: "#1022", items: "3x Cold Brew, 2x Muffin", note: "Delivery Order", time: "12m ago", status: "Preparing", statusColor: "bg-blue-100 text-blue-600", urgent: true },
  ];

  const INVENTORY = [
    { name: "Espresso Beans", level: 8, color: "bg-red-500" },
    { name: "Oat Milk", level: 15, color: "bg-orange-500" },
    { name: "Paper Cups (L)", level: 22, color: "bg-orange-500" },
  ];

  const NAV_ITEMS = [
    { name: 'Dashboard', icon: 'dashboard' },
    { name: 'Orders', icon: 'receipt_long' },
    { name: 'Inventory', icon: 'inventory_2' },
    { name: 'Loyalty', icon: 'loyalty' },
    { name: 'Reports', icon: 'analytics' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-[#137fec] rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">coffee</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none">Brew & Bean</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">Manager View</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveNav(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === item.name 
                ? 'bg-[#137fec] text-white' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors mb-4">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </button>
          <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="size-8 rounded-full bg-slate-300 overflow-hidden">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMmnjP0ci2jKHE291b1cz04kOOlEWWZd8uoD2YsrC38c5ArH32o2_pZFQ8gyI4RXbmtdPeyGdGnJxlpB_MBB9vIu-ssYXXXtvDE1OB_LPnSPaE_axqg9koX58OswfibakBfThgO46k_Fah22GrAN-FPu8i_Z2Fjb8w9y6RoZuyJeUrCLgGP5gZ8JQr23oAWmd15-GmQx04_-KydxDbi3s-N1UmqUj6ANVOCjdzUMoGnYOAS82RqSBgkQ0E8NaRG1NY0yiC3Al0c0XF" alt="Marcus Chen" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">Marcus Chen</p>
              <p className="text-[10px] text-slate-500 uppercase">General Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex">
        <div className="flex-1 p-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Operations Dashboard</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time overview of cafe performance</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all">
                <span className="material-symbols-outlined text-lg">download</span> Export
              </button>
              <button className="flex items-center gap-2 bg-[#137fec] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#137fec]/90 transition-all">
                <span className="material-symbols-outlined text-lg">add</span> New Order
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {STATS.map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className={`material-symbols-outlined ${stat.color} ${stat.bg} p-2 rounded-lg`}>{stat.icon}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.includes('+') ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-slate-400 bg-slate-50 dark:bg-slate-800'}`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-black mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Live Order Queue */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="font-bold flex items-center gap-2">
                <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                Live Order Queue
              </h3>
              <div className="text-xs text-slate-500 font-medium">Showing {ORDERS.length} active orders</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Order ID</th>
                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Items</th>
                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Time Elapsed</th>
                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ORDERS.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-5 text-sm font-bold">{order.id}</td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-medium">{order.items}</div>
                        <div className="text-xs text-slate-400 mt-0.5">Note: {order.note}</div>
                      </td>
                      <td className={`px-6 py-5 text-sm font-medium ${order.urgent ? 'text-red-500 italic font-bold' : 'text-slate-500'}`}>
                        {order.time}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shrink-0 space-y-8 overflow-y-auto">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-lg">warning</span>
                Inventory Alerts
              </h4>
              <button className="text-[#137fec] text-xs font-bold hover:underline">Manage</button>
            </div>
            <div className="space-y-4">
              {INVENTORY.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
                    <span className="text-red-500 font-bold text-xs uppercase">{item.level}% Left</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full`} style={{ width: `${item.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          <section>
            <div className="mb-4">
              <h4 className="font-bold">Recent Ratings</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4].map(s => <span key={s} className="material-symbols-outlined text-lg fill-1">star</span>)}
                  <span className="material-symbols-outlined text-lg">star_half</span>
                </div>
                <span className="text-sm font-bold">4.8</span>
                <span className="text-[11px] text-slate-400">(24 reviews)</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold">Sarah K.</span>
                  <span className="text-[10px] text-slate-400">2h ago</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 italic">"Best latte in town! The foam was perfect and the service was super quick."</p>
              </div>
              <button className="w-full py-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                View All Reviews
              </button>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
};

export default Dashboard;