import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/** * ANIMATION VARIANTS
 */
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

/** * REUSABLE UI COMPONENTS
 */
const SidebarItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
    active 
      ? "bg-[#135bec] text-white shadow-lg shadow-blue-500/20" 
      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
  }`}>
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="text-sm font-semibold">{label}</span>
  </div>
);

const FormField = ({ label, children }) => (
  <motion.div variants={itemVariants} className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
      {label}
    </label>
    {children}
  </motion.div>
);

/** * MAIN COMPONENT
 */
export default function AddStaffMember() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || "Admin";
  const [loading, setLoading] = useState(false);

  // Matches your Java/SQL requirements: name, email, password, role_id
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: '',
  });

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // role_id must be sent as an Integer, not a string
    const finalValue = name === 'role_id' ? (value === "" ? "" : parseInt(value)) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/User/Post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Staff member created successfully!');
        navigate('/Admin/Staff');
      } else {
        const err = await response.json();
        alert(`Error: ${err.message || 'Failed to save staff'}`);
      }
    } catch (error) {
      console.error('Submission Error:', error);
      alert('Network error. Check if backend is running at :8080');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#0b0f1a] font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-slate-100">
      
      {/* --- Floating Header --- */}
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
            <h2 className="text-sm font-black tracking-tighter uppercase hidden sm:block">Chai</h2>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8">
            {['Home', 'Menu', 'Staff', 'History'].map((link) => (
              <Link key={link} to={`/Admin/${link}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-[#135bec]">
                {link}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black uppercase tracking-widest">{userName}</p>
              <p className="text-[9px] text-green-500 font-bold uppercase leading-none">Online</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#135bec] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-800 shadow-md">
              {getInitials(userName)}
            </div>
          </div>
        </motion.div>
      </header>

      <div className="flex pt-28 px-6 max-w-[1600px] mx-auto gap-6">
        {/* --- Sidebar --- */}
        <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-2">
          <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Management</div>
          <NavLink to="/Admin/Dashboard"><SidebarItem icon="dashboard" label="Dashboard" /></NavLink>
          <NavLink to="/Admin/Orders"><SidebarItem icon="receipt_long" label="Orders" /></NavLink>
          <NavLink to="/Admin/Staff"><SidebarItem icon="group" label="Staff Directory" active /></NavLink>
          <NavLink to="/Admin/Menu"><SidebarItem icon="restaurant_menu" label="Menu Editor" /></NavLink>
        </aside>

        {/* --- Main Content Area --- */}
        <motion.main variants={containerVariants} initial="hidden" animate="visible" className="flex-1 space-y-8 pb-20">
          <motion.div variants={itemVariants}>
            <Link to="/Admin/Staff" className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#135bec] mb-2">
              <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Staff
            </Link>
            <h1 className="text-4xl font-black tracking-tight">Add User</h1>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Form Section */}
            <motion.div variants={itemVariants} className="xl:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Full Name">
                    <input name="name" required value={formData.name} onChange={handleChange} className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 px-4 font-bold border-none focus:ring-2 focus:ring-[#135bec] outline-none" placeholder="Julian Casablancas" type="text" />
                  </FormField>

                  <FormField label="Email Address">
                    <input name="email" required type="email" value={formData.email} onChange={handleChange} className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 px-4 font-bold border-none focus:ring-2 focus:ring-[#135bec] outline-none" placeholder="julian@chai.com" />
                  </FormField>

                  <FormField label="Password">
                    <input name="password" required type="password" value={formData.password} onChange={handleChange} className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 px-4 font-bold border-none focus:ring-2 focus:ring-[#135bec] outline-none" placeholder="••••••••" />
                  </FormField>

                  <FormField label="Assign Role">
                    <select name="role_id" required value={formData.role_id} onChange={handleChange} className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 px-4 font-bold appearance-none border-none focus:ring-2 focus:ring-[#135bec] outline-none">
                      <option value="">Select Role ID</option>
                      <option value="1">1 - Administrator</option>
                      <option value="2">2 - Manager</option>
                      <option value="3">3 - Staff/Waiter</option>
                    </select>
                  </FormField>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => navigate('/Admin/Staff')} className="px-8 py-4 text-xs font-black uppercase text-slate-400">Cancel</button>
                  <button type="submit" disabled={loading} className="px-10 py-4 bg-[#135bec] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all disabled:opacity-50">
                    {loading ? 'Processing...' : 'Create User'}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* --- DB Preview Card --- */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-zinc-900 text-white p-8 rounded-[2rem]">
                <h4 className="text-lg font-black mb-4">DB Entry Preview</h4>
                <div className="flex items-center gap-4 mb-6">
                   <div className="size-16 rounded-full border-2 border-[#135bec] bg-[#135bec]/20 flex items-center justify-center text-lg font-black text-[#135bec]">
                    {getInitials(formData.name)}
                   </div>
                  <div>
                    <h3 className="font-black text-xl leading-tight truncate max-w-[140px]">{formData.name || "New User"}</h3>
                    <p className="text-[#135bec] text-[10px] font-black uppercase tracking-widest">
                      Role ID: {formData.role_id || "Not Set"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-6 border-t border-white/10 text-[11px] text-slate-400">
                   <div className="flex justify-between items-center">
                     <span>DB COLUMN: email</span>
                     <span className="text-white font-bold truncate max-w-[140px]">{formData.email || "—"}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span>VALIDATION</span>
                     <div className="flex items-center gap-1.5">
                       <div className={`size-1.5 rounded-full ${formData.password.length > 5 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                       <span className={`${formData.password.length > 5 ? 'text-green-500' : 'text-red-500'} font-bold uppercase`}>
                        {formData.password.length > 5 ? 'Secure' : 'Weak Pass'}
                       </span>
                     </div>
                   </div>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.main>
      </div>
    </div>
  );
}