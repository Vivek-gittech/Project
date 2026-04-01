import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Animation Variants ---
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

// --- Sub-Components ---
const SidebarItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
    active ? "bg-[#135bec] text-white shadow-lg shadow-blue-500/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
  }`}>
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="text-sm font-semibold">{label}</span>
  </div>
);

const FormField = ({ label, children }) => (
  <motion.div variants={itemVariants} className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
    {children}
  </motion.div>
);

export default function AddMenuItem() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || "Admin";
  const [loading, setLoading] = useState(false);

  const initialState = {
    item_name: '',
    category_id: '',
    price: '',
    stock_quantity: '',
    imageUrl: '',
    isAvailable: true
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    // Prevents browser from reloading the page
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        item_name: formData.item_name,
        category_id: parseInt(formData.category_id),
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        imageUrl: formData.imageUrl,
        isAvailable: true
      };

      const response = await fetch('http://localhost:8080/Menu/Post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Menu item saved successfully!');
        setFormData(initialState);
        navigate('/Admin/Menu', { replace: true });
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Error: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Submission Error:', error);
      alert('Network error. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#0b0f1a] font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-slate-100">
      
      {/* Header */}
      <header className="fixed top-6 z-50 w-full flex justify-center px-4 pointer-events-none">
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-7xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-full px-8 py-3 shadow-2xl flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-[#135bec] rounded-full text-white flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-sm font-bold">local_cafe</span>
            </div>
            <h2 className="text-sm font-black tracking-tighter uppercase hidden sm:block">Chai</h2>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            {['Home', 'Menu', 'History'].map((link) => (
              <Link key={link} to={link === 'Home' ? '/' : `/${link}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-[#135bec]">{link}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black uppercase tracking-widest">{userName}</p>
              <p className="text-[9px] text-green-500 font-bold uppercase leading-none">Online</p>
            </div>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} className="w-9 h-9 rounded-full border-2 border-white shadow-md" alt="profile"/>
          </div>
        </motion.div>
      </header>

      <div className="flex pt-28 px-6 max-w-[1600px] mx-auto gap-6">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-2">
          <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Main Menu</div>
          <NavLink to="/Admin/Dashboard"><SidebarItem icon="dashboard" label="Dashboard" /></NavLink>
          <NavLink to="/Admin/ActiveOrder"><SidebarItem icon="shopping_bag" label="Active Orders" /></NavLink>
          <NavLink to="/Admin/Menu"><SidebarItem icon="restaurant_menu" label="Menu Editor" active /></NavLink>
        </aside>

        {/* Form Area */}
        <motion.main variants={containerVariants} initial="hidden" animate="visible" className="flex-1 space-y-8 pb-20">
          <motion.div variants={itemVariants}>
            <Link to="/Admin/Menu" className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#135bec] mb-2">
              <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Menu
            </Link>
            <h1 className="text-4xl font-black tracking-tight">Create Item</h1>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="xl:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Item Name">
                    <input name="item_name" required value={formData.item_name} onChange={handleChange} className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 px-4 font-bold border-none outline-[#135bec]" placeholder="e.g. Special Burger" type="text" />
                  </FormField>

                  <FormField label="Category">
                    <select name="category_id" required value={formData.category_id} onChange={handleChange} className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 px-4 font-bold appearance-none border-none outline-[#135bec]">
                      <option value="">Select Category</option>
                      <option value="1">Burgers</option>
                      <option value="2">Beverages</option>
                      <option value="3">Desserts</option>
                    </select>
                  </FormField>

                  <FormField label="Price ($)">
                    <input name="price" required value={formData.price} onChange={handleChange} className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 px-4 font-bold border-none outline-[#135bec]" placeholder="0.00" type="number" step="0.01" />
                  </FormField>

                  <FormField label="Stock Quantity">
                    <input name="stock_quantity" required value={formData.stock_quantity} onChange={handleChange} className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 px-4 font-bold border-none outline-[#135bec]" placeholder="24" type="number" />
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField label="Image URL">
                      <input name="imageUrl" required value={formData.imageUrl} onChange={handleChange} className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 px-4 font-bold border-none outline-[#135bec]" placeholder="https://images.unsplash.com/your-image-url" type="url" />
                    </FormField>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                  <button type="button" onClick={() => navigate('/Admin/Menu')} className="px-8 py-4 text-xs font-black uppercase text-slate-400">Discard</button>
                  <button type="submit" disabled={loading} className="px-10 py-4 bg-[#135bec] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Menu Item'}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Live Preview Section */}
            <motion.div variants={itemVariants} className="bg-zinc-900 text-white p-8 rounded-[2rem] h-fit sticky top-32">
              <h4 className="text-lg font-black mb-4">Item Preview</h4>
              <div className="border-2 border-dashed border-white/10 rounded-[1.5rem] overflow-hidden aspect-video flex flex-col items-center justify-center gap-4 bg-white/5 relative">
                {formData.imageUrl ? (
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }} 
                  />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-4xl text-slate-600">image</span>
                    <p className="text-[10px] font-black uppercase text-slate-500">Image Preview</p>
                  </>
                )}
              </div>
              
              <div className="mt-6 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#135bec]">
                  Category {formData.category_id || "None"}
                </span>
                <h3 className="text-2xl font-black">{formData.item_name || "New Item"}</h3>
                <p className="text-xl font-bold text-white/60">${formData.price || "0.00"}</p>
                
                {/* Stock Quantity Preview Display */}
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`size-2 rounded-full ${formData.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stock Status</p>
                  </div>
                  <p className="text-sm font-bold">
                    {formData.stock_quantity || "0"} <span className="text-[10px] text-slate-500 uppercase ml-1">Units</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
    
  );
}