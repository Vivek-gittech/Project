import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';


const userName = localStorage.getItem("name") || "Admin";
// --- Animation Variants (Consistent with Customer UI) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.05, delayChildren: 0.1 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: "easeOut" } 
  }
};

// --- Sub-Components ---
const SidebarItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
      active 
        ? "bg-[#135bec] text-white shadow-lg shadow-blue-500/20" 
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`}>
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="text-sm font-bold tracking-tight">{label}</span>
  </div>
);

export default function StaffManagementSystem() {
  const BASE_URL = 'http://localhost:8080/User'; 

  // --- States ---
  const [staffData, setStaffData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    user_id: "", 
    name: "", 
    role: "Waiter", 
    email: "", 
    phone: "", 
    status: "Active" 
  });

  const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem("token")}`,
    'Content-Type': 'application/json'
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/Get`, { headers: getHeaders() });
      const data = await response.json();
      setStaffData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // --- Handlers ---
  const openModal = (staff = null) => {
    if (staff) {
      setIsEditing(true);
      setFormData({
        user_id: staff.user_id || staff.userId || staff.id || "", 
        name: staff.name || "",
        role: staff.role || "Waiter",
        email: staff.email || "",
        phone: staff.phone || "",
        status: staff.status || "Active"
      });
    } else {
      setIsEditing(false);
      setFormData({ 
        user_id: Date.now(), 
        name: "", 
        role: "Waiter", 
        email: "", 
        phone: "", 
        status: "Active" 
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${BASE_URL}/Update/${formData.user_id}` : `${BASE_URL}/Post`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        loadData();
        setIsModalOpen(false);
      }
    } catch (err) {
      alert("Error saving staff record");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Terminate this staff record?")) {
      try {
        await fetch(`${BASE_URL}/Delete/${id}`, { method: 'DELETE', headers: getHeaders() });
        setStaffData(prev => prev.filter(item => (item.id !== id && item.userId !== id && item.user_id !== id)));
      } catch (err) {
        alert("Delete failed. Admin privileges required.");
      }
    }
  };

  const filteredStaff = staffData.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#0b0f1a] font-['Plus_Jakarta_Sans',_sans-serif] text-slate-900 dark:text-slate-100">
      
      {/* 1. Floating Header (Consistent with Customer page) */}
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
                    Chai </h2>
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

      <div className="flex pt-32 px-6 max-w-[1600px] mx-auto gap-10">
        
        {/* 2. Sidebar */}
        <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-2">
          <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Team Control</div>
          <NavLink to="/Admin/Dashboard"><SidebarItem icon="dashboard" label="Dashboard" /></NavLink>
          <NavLink to="/Admin/Staff"><SidebarItem icon="badge" label="Staff Team" active /></NavLink>
          <NavLink to="/Admin/Customer"><SidebarItem icon="group" label="Customer Base" /></NavLink>
        </aside>

        {/* 3. Main Content */}
        <motion.main 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 space-y-8 pb-20"
        >
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight uppercase">Staff Team</h1>
              <p className="text-slate-500 font-medium">Manage your crew roles and system access.</p>
            </div>
            <button 
              onClick={() => openModal()} 
              className="bg-[#135bec] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-sm">person_add</span> Add Staff Member
            </button>
          </header>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="relative max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              type="text" placeholder="Search team by name or role..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-[#135bec]/10 transition-all font-medium"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>

          {/* Table Container */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-8 py-5">Staff Identity</th>
                  <th className="px-8 py-5">Designation</th>
                  <th className="px-8 py-5">Duty Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                <AnimatePresence>
                  {isLoading ? (
                    <tr><td colSpan="4" className="text-center p-20 font-black uppercase text-slate-400 animate-pulse">Syncing Team Records...</td></tr>
                  ) : filteredStaff.map((staff) => (
                    <motion.tr 
                      key={staff.user_id || staff.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${staff.name}`} className="w-10 h-10 rounded-full bg-slate-100" alt="" />
                          <div>
                            <p className="font-black text-sm uppercase tracking-tight">{staff.name}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{staff.email || 'No email set'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-wider">{staff.role}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${staff.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-500'}`}>
                          {staff.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openModal(staff)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button onClick={() => handleDelete(staff.user_id || staff.userId || staff.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        </motion.main>
      </div>

      {/* Modern Modal (Consistent with Customer Page) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 p-8 border border-white/20"
            >
              <h3 className="text-2xl font-black tracking-tight mb-6 uppercase">{isEditing ? "Modify Staff" : "Add Team Member"}</h3>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input required type="text" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#135bec] font-bold" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Staff Role</label>
                    <select className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold appearance-none"
                      value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                      <option>Manager</option>
                      <option>Head Chef</option>
                      <option>Barista</option>
                      <option>Waiter</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duty Status</label>
                    <select className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold appearance-none"
                      value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">Dismiss</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-4 font-black text-[10px] uppercase tracking-widest bg-[#135bec] text-white rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
                    {isSubmitting ? "Processing..." : isEditing ? "Update Staff" : "Confirm Staff"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}