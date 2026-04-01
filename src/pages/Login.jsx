import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  // --- Role & Special Code State ---
  const [showAdminVerify, setShowAdminVerify] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [tempAuthData, setTempAuthData] = useState(null);

  const SPECIAL_ADMIN_CODE = "CAFE-2026-PRO"; 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // --- UPDATED: Handle Login with Case Sensitivity Fixes ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.identifier,
          password: formData.password
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // FIX 1: Safely check both 'Role' and 'role' from API and normalize to Uppercase
        const userRole = (data.Role || data.role).toUpperCase();

        if (userRole === 'ADMIN') {
          // Trigger the Special Code Modal for Admins
          setTempAuthData(data);
          setShowAdminVerify(true);
          setIsLoading(false);
        } else {
          // Standard Customer Path
          finalizeLogin(data, '/CustomerDashboard');
        }
      } else {
        alert(data.message || "Invalid Credentials");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Connection error. Check Backend and CORS.");
      setIsLoading(false);
    }
  };

  const verifyAdminCode = () => {
    if (adminKey === SPECIAL_ADMIN_CODE) {
      finalizeLogin(tempAuthData, '/Admin/Dashboard');
    } else {
      alert("Unauthorized: Incorrect Special Admin Code");
    }
  };

  // --- UPDATED: Finalize Login ensuring keys match LandingPage expectations ---
  const finalizeLogin = (data, redirectPath) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('name', data.name || data.email);
    localStorage.setItem('user_id',data.user_id);
    
    // FIX 2: Ensure we save specifically to 'role' (lowercase) so LandingPage can find it
    const roleToSave = data.Role || data.role || 'CUSTOMER';
    localStorage.setItem('role', roleToSave); 
    
    // Using href forces a refresh which ensures localStorage is read fresh by the next page
    window.location.href = redirectPath;
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.12 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfaf8] dark:bg-[#0f0d08] font-['Plus_Jakarta_Sans',_sans-serif] p-6 overflow-hidden">
      
      {/* Background Decor */}
      <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 8, repeat: Infinity }} className="fixed top-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#ec7f13] blur-[120px] rounded-full pointer-events-none" />

      {/* ADMIN SPECIAL CODE MODAL */}
      <AnimatePresence>
        {showAdminVerify && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] max-w-md w-full shadow-2xl border border-[#ec7f13]/20"
            >
              <div className="text-center mb-6">
                <span className="material-symbols-outlined text-5xl text-[#ec7f13] mb-4">admin_panel_settings</span>
                <h2 className="text-2xl font-black">Admin Verification</h2>
                <p className="text-zinc-500 text-sm">Please enter the special security key to proceed to the Admin Panel.</p>
              </div>
              <input 
                type="password" 
                placeholder="Enter Special Code" 
                className="w-full h-14 px-6 bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-4 outline-none border-2 border-transparent focus:border-[#ec7f13] transition-all text-center tracking-widest font-bold"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
              />
              <div className="flex gap-3">
                <button onClick={() => setShowAdminVerify(false)} className="flex-1 h-12 rounded-xl font-bold text-zinc-500 hover:bg-zinc-100 transition-colors">Cancel</button>
                <button onClick={verifyAdminCode} className="flex-1 h-12 bg-[#ec7f13] text-white rounded-xl font-bold hover:brightness-110 transition-all">Verify Key</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-[1050px] min-h-[680px] bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl flex overflow-hidden border border-zinc-100 dark:border-zinc-800 relative z-10">
        
        {/* Left Side Decor */}
        <div className="hidden lg:flex w-[45%] relative overflow-hidden">
          <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover" alt="Cafe" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b170d] to-transparent opacity-90" />
          <div className="relative z-10 p-12 mt-auto text-white">
            <h2 className="text-4xl font-black mb-4 tracking-tight">System <br/> Authentication</h2>
            <p className="text-zinc-300 text-sm font-medium">Verify your identity to manage the brew.</p>
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full lg:w-[55%] p-10 md:p-20 flex flex-col justify-center">
          <motion.div variants={itemVariants} className="mb-10">
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Login</h1>
            <p className="text-zinc-500 text-sm mt-2 font-medium">Enter your credentials to access your account.</p>
          </motion.div>

          <form className="space-y-7" onSubmit={handleLogin}>
            <motion.div variants={itemVariants} className="flex flex-col gap-2.5">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-[#ec7f13] ml-1">Username or Email</label>
              <input id="identifier" type="text" placeholder="e.g. admin@cafe.com" className="w-full h-16 px-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl outline-none border-2 border-transparent focus:border-[#ec7f13]/30 transition-all font-semibold text-zinc-900 dark:text-white" onChange={handleChange} required />
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-[#ec7f13]">Secret Password</label>
              </div>
              <div className="relative">
                <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••••••" className="w-full h-16 px-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl outline-none border-2 border-transparent focus:border-[#ec7f13]/30 transition-all font-semibold text-zinc-900 dark:text-white" onChange={handleChange} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#ec7f13]">
                  <span className="material-symbols-outlined">{showPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button disabled={isLoading} type="submit" className="w-full h-16 bg-[#1b170d] dark:bg-[#ec7f13] text-white dark:text-[#1b170d] font-black rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all">
                {isLoading ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" /> : "LOG IN TO SYSTEM"}
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;