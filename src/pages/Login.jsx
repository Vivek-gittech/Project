import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios'

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // FIX 1: Add http:// to the URL
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.identifier, // Your LoginDto expects "email"
          password: formData.password
        })
      });

      // Check if response is JSON before parsing
      const data = await response.json();

      if (response.ok) {
        // FIX 2: Store the token correctly
        localStorage.setItem('token', data.token); 
        
        // Note: Your Java code only returns "token". 
        // If you need the username, you'll need to update the Java Map.of
        localStorage.setItem('customer', data.Customer);
        alert("Login Successful!"+data.Customer);
        
        // FIX 3: Fixed the console.log error (Item was undefined)
        
        window.location.href = '/CustomerDashboard';
      } else {
        alert("Invalid Credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Connection error. Ensure your Backend is running and CORS is enabled.");
    } finally {
      setIsLoading(false);
    }
  };
  // Animation Variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth finish
        staggerChildren: 0.12 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfaf8] dark:bg-[#0f0d08] font-['Plus_Jakarta_Sans',_sans-serif] p-6 overflow-hidden">
      
      {/* Animated Background Decor */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="fixed top-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#ec7f13] blur-[120px] rounded-full pointer-events-none" 
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[1050px] min-h-[680px] bg-white dark:bg-zinc-900 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex overflow-hidden border border-zinc-100 dark:border-zinc-800 relative z-10"
      >
        
        {/* Left Side (Image) with Parallax Effect */}
        <div className="hidden lg:flex w-[45%] relative overflow-hidden">
          <motion.img 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover"
            alt="Cafe"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b170d] via-[#1b170d]/20 to-transparent opacity-90" />
          <motion.div 
            variants={itemVariants}
            className="relative z-10 p-12 mt-auto text-white"
          >
            <h2 className="text-4xl font-black mb-4 tracking-tight">Brewing <br/> Excellence.</h2>
            <p className="text-zinc-300 text-sm font-medium">Your cafe management, simplified.</p>
          </motion.div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full lg:w-[55%] p-10 md:p-20 flex flex-col justify-center">
          
          <motion.div variants={itemVariants} className="mb-10">
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Login</h1>
            <p className="text-zinc-500 text-sm mt-2 font-medium">Enter your credentials to access your dashboard.</p>
          </motion.div>

          <form className="space-y-7" onSubmit={handleLogin}>
            
            {/* USERNAME INPUT BOX */}
            <motion.div variants={itemVariants} className="flex flex-col gap-2.5">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-[#ec7f13] ml-1">
                Username or Email
              </label>
              <div className="relative group">
                <input
                  id="identifier"
                  type="text"
                  placeholder="e.g. barista_pro"
                  className="w-full h-16 px-6 bg-zinc-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-[#ec7f13]/30 focus:bg-white dark:focus:bg-zinc-800 rounded-2xl outline-none transition-all duration-300 text-zinc-900 dark:text-white font-semibold text-sm placeholder:text-zinc-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]"
                  onChange={handleChange}
                  required
                />
              </div>
            </motion.div>

            {/* PASSWORD INPUT BOX */}
            <motion.div variants={itemVariants} className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-[#ec7f13]">
                  Secret Password
                </label>
                <motion.a 
                  whileHover={{ x: 3 }}
                  href="#" 
                  className="text-[10px] font-bold text-zinc-400 hover:text-[#ec7f13] transition-colors"
                >
                  FORGOT?
                </motion.a>
              </div>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="w-full h-16 px-6 bg-zinc-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-[#ec7f13]/30 focus:bg-white dark:focus:bg-zinc-800 rounded-2xl outline-none transition-all duration-300 text-zinc-900 dark:text-white font-semibold text-sm placeholder:text-zinc-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]"
                  onChange={handleChange}
                  required
                />
                <button
    type="button" // Important: prevents form submission
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#ec7f13] transition-colors"
  >
    <span className="material-symbols-outlined">
      {showPassword ? 'visibility' : 'visibility_off'}
    </span>
  </button>
              </div>
            </motion.div>

            {/* LOGIN BUTTON */}
            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.01, filter: "brightness(1.1)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full h-16 bg-[#1b170d] dark:bg-[#ec7f13] text-white dark:text-[#1b170d] font-black rounded-2xl shadow-xl shadow-[#ec7f13]/10 flex items-center justify-center gap-3 mt-4 disabled:opacity-50 transition-all overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-6 h-6 border-3 border-white dark:border-[#1b170d] border-t-transparent rounded-full animate-spin"
                    />
                  ) : (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      LOG IN TO SYSTEM
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="mt-10 text-center text-sm text-zinc-500 font-medium">
            New staff member? 
            <a href="#" className="text-[#ec7f13] font-black hover:underline underline-offset-4 ml-1 transition-all">
              Create Account
            </a>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;