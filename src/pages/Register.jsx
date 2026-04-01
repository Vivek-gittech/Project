import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Updated to match your Java Backend Fields
  const [formData, setFormData] = useState({ 
    name: '', 
    username: '', // This will store the email address
    password: '', 
    city: '' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/Customer/Post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Success:", data);
        alert("Registration Successful!");
        // window.location.href = '/login';
      } else {
        alert(`Registration failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Could not connect to the server. Check if your Spring Boot app is running on port 8080.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfaf8] dark:bg-[#0f0d08] font-['Plus_Jakarta_Sans',_sans-serif] p-6 overflow-hidden">
      
      {/* Background Glow */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ec7f13]/10 blur-[120px] rounded-full" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[1100px] min-h-[750px] bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl flex overflow-hidden border border-zinc-100 dark:border-zinc-800 relative z-10"
      >
        
        {/* Left Side (Branding) */}
        <div className="hidden lg:flex w-[45%] relative overflow-hidden">
          <motion.img 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2 }}
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover"
            alt="Cafe"
          />
          <div className="absolute inset-0 bg-[#1b170d]/60 backdrop-blur-[2px]" />
          <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ec7f13] flex items-center justify-center shadow-lg shadow-[#ec7f13]/40">
                <span className="material-symbols-outlined font-bold">coffee</span>
              </div>
              <span className="text-xl font-black tracking-tighter">CAFÉ NOVA</span>
            </div>
            <div>
              <h2 className="text-5xl font-black leading-tight">Join the <br/> <span className="text-[#ec7f13]">Elite</span> Brew.</h2>
              <p className="text-zinc-300 mt-4 opacity-80">Streamline your cafe operations today.</p>
            </div>
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full lg:w-[55%] p-10 md:p-16 flex flex-col justify-center">
          
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Register</h1>
            <p className="text-zinc-500 text-sm mt-2 font-medium">Create your business account below.</p>
          </motion.div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* NAME */}
            <motion.div variants={itemVariants} className="flex flex-col gap-2">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-[#ec7f13] ml-1">Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                className="w-full h-14 pl-6 bg-zinc-50 dark:bg-zinc-800/40 border-2 border-transparent focus:border-[#ec7f13]/30 focus:bg-white dark:focus:bg-zinc-800 rounded-2xl outline-none transition-all duration-300 text-sm font-semibold"
                onChange={handleChange}
                required
              />
            </motion.div>

            {/* EMAIL (as username) */}
            <motion.div variants={itemVariants} className="flex flex-col gap-2">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-[#ec7f13] ml-1">Email Address</label>
              <input
                name="username"
                type="email"
                placeholder="name@company.com"
                className="w-full h-14 pl-6 bg-zinc-50 dark:bg-zinc-800/40 border-2 border-transparent focus:border-[#ec7f13]/30 focus:bg-white dark:focus:bg-zinc-800 rounded-2xl outline-none transition-all duration-300 text-sm font-semibold"
                onChange={handleChange}
                required
              />
            </motion.div>

            {/* CITY */}
            <motion.div variants={itemVariants} className="flex flex-col gap-2">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-[#ec7f13] ml-1">City</label>
              <input
                name="city"
                type="text"
                placeholder="e.g. New York"
                className="w-full h-14 pl-6 bg-zinc-50 dark:bg-zinc-800/40 border-2 border-transparent focus:border-[#ec7f13]/30 focus:bg-white dark:focus:bg-zinc-800 rounded-2xl outline-none transition-all duration-300 text-sm font-semibold"
                onChange={handleChange}
                required
              />
            </motion.div>

            {/* PASSWORD */}
            <motion.div variants={itemVariants} className="flex flex-col gap-2">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-[#ec7f13] ml-1">Password</label>
              <div className="relative group">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="w-full h-14 pl-6 pr-14 bg-zinc-50 dark:bg-zinc-800/40 border-2 border-transparent focus:border-[#ec7f13]/30 focus:bg-white dark:focus:bg-zinc-800 rounded-2xl outline-none transition-all duration-300 text-sm font-semibold"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#ec7f13] transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </motion.div>

            {/* SUBMIT BUTTON */}
            <motion.div variants={itemVariants} className="pt-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full h-16 bg-[#1b170d] dark:bg-[#ec7f13] text-white dark:text-[#1b170d] font-black rounded-2xl shadow-xl shadow-[#ec7f13]/20 flex items-center justify-center gap-3"
                disabled={isLoading}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2 uppercase tracking-widest text-xs">Create Account <span className="material-symbols-outlined">east</span></span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-zinc-500 font-medium">
            Already a member? <a href="/login" className="text-[#ec7f13] font-black hover:underline underline-offset-4 ml-1">Sign In</a>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;