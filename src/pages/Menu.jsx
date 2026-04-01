import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const QRMenu = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderToken, setOrderToken] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); 
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));

  const customerId = localStorage.getItem('user_id'); 
  
  // FIXED: Changed tableNumber to a State so users can edit it in the cart
  const [tableNumber, setTableNumber] = useState(localStorage.getItem('table_number') || "");

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
      setUserRole(localStorage.getItem('role'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    setCart([]); 
    alert("Logged out successfully");
    navigate('/'); 
  };

  const [lastOrderNumber, setLastOrderNumber] = useState(() => {
    const saved = localStorage.getItem('nova_last_token');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('http://localhost:8080/Menu/Get');
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        console.error("Failed to load menu", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // --- FIXED PLACE ORDER LOGIC ---
  const handlePlaceOrder = async () => {
    if (!isLoggedIn || cart.length === 0) return;

    // Validation: Check if table number exists before processing
    if (!tableNumber || tableNumber.toString().trim() === "") {
      alert("Please enter your table number in the cart before confirming.");
      return;
    }

    setIsProcessing(true);
    const nextToken = lastOrderNumber + 1;
  
    const orderData = {
      waiter_id: 1, // Set to 0 for QR/Self-service so the DB accepts it
      customer_id: customerId ? parseInt(customerId) : null,
      table_number: tableNumber.toString(), // Ensure string format
      order_status: 'Pending',
      total_amount: parseFloat(cartTotal.toFixed(2)),
      // CRITICAL: Sending items array so Chef Dashboard can see what to cook
      items: cart.map(item => ({
        name: item.name,
        qty: item.quantity,
        note: "" 
      }))
    };
  
    try {
      const orderResponse = await fetch('http://localhost:8080/Order/Post', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData),
      });
  
      if (!orderResponse.ok) throw new Error('Failed to save order');
      const savedOrder = await orderResponse.json();
  
      // Post to the Tokens Table
      const tokenResponse = await fetch('http://localhost:8080/Token/Post', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          order_id: savedOrder.order_id,
          token_number: nextToken,
          is_called: false
        }),
      });
  
      if (!tokenResponse.ok) throw new Error('Failed to generate token');
  
      setOrderToken(nextToken);
      setLastOrderNumber(nextToken);
      localStorage.setItem('nova_last_token', nextToken.toString());
      localStorage.setItem('table_number', tableNumber); // Save for next time
      setIsCartOpen(false);
  
    } catch (err) {
      console.error("Transaction Error:", err);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const addToOrder = (item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fafafb] dark:bg-[#0b0f1a] font-['Plus_Jakarta_Sans'] text-[#0d121b] dark:text-zinc-100 transition-colors duration-500">
      
      <header className="sticky top-4 z-50 w-full flex justify-center">
        <motion.div 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="w-[85%] max-w-7xl bg-white/70 dark:bg-[#0b0f1a]/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-full px-8 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#135bec] rounded-full text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-ml font-bold">coffee</span>
            </div>
            <h2 className="text-lg font-black tracking-tighter uppercase">Chai</h2>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-8">
              {['Home', 'Menu'].map((name) => (
                <Link key={name} to={`/${name === 'Home' ? '' : name}`} className="text-[11px] font-black text-zinc-500 hover:text-[#135bec] transition-all uppercase tracking-[0.15em]">
                  {name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 p-2.5 bg-zinc-900 dark:bg-[#135bec] text-white rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg group"
              >
                <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] items-center justify-center font-bold">{cartCount}</span>
                  </span>
                )}
              </button>

              {!isLoggedIn ? (
                <Link to="/login" className="px-5 py-2.5 bg-white border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors">
                  Login
                </Link>
              ) : (
                <div className="flex items-center gap-4 pl-2 border-l border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-[#135bec]/10 flex items-center justify-center border border-[#135bec]/20">
                      <span className="material-symbols-outlined text-sm text-[#135bec]">
                        {userRole?.toUpperCase() === 'ADMIN' ? 'admin_panel_settings' : 'person'}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-[10px] font-black uppercase text-red-500 hover:text-red-600 transition-colors tracking-widest"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        <header className="mb-12">
          <p className="text-[#135bec] font-bold text-sm uppercase tracking-widest mb-1">Freshly Brewed</p>
          <h2 className="text-5xl font-black uppercase tracking-tighter">Explore Menu</h2>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#135bec] border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {menuItems.map((item) => (
              <motion.div layout key={item.id} className="group bg-white dark:bg-[#161e31] p-4 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all border border-zinc-100 dark:border-zinc-800">
                <div className="relative h-56 rounded-[2rem] overflow-hidden mb-5">
                  <img src={item.imagesUrl} alt={item.item_name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <button onClick={() => addToOrder(item)} className="absolute bottom-4 right-4 bg-[#135bec] text-white w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 transition-all active:scale-90">
                    <span className="material-symbols-outlined font-bold">add</span>
                  </button>
                </div>
                <div className="flex justify-between items-center px-2 pb-2">
                  <h3 className="font-black text-lg truncate">{item.item_name}</h3>
                  <span className="text-[#135bec] font-black text-xl">{Number(item.price).toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#0b0f1a]/60 backdrop-blur-md z-[60]" onClick={() => setIsCartOpen(false)} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-[#0b0f1a] z-[70] flex flex-col shadow-2xl">
            <div className="p-8 flex justify-between items-center border-b dark:border-zinc-800">
              <h2 className="text-2xl font-black uppercase tracking-tighter">My Order</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"><span className="material-symbols-outlined">close</span></button>
            </div>

            {/* FIXED: Added Table Number Input inside the Cart Drawer */}
            <div className="px-8 py-4 bg-blue-50/50 dark:bg-blue-900/10 border-b dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">table_restaurant</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Enter Table Number</span>
              </div>
              <input 
                type="text"
                placeholder="Ex: 05"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-16 bg-white dark:bg-zinc-800 border-2 border-blue-200 dark:border-zinc-700 rounded-xl py-1 text-center font-black text-sm outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-20 opacity-50 font-bold uppercase tracking-widest text-xs italic">Hungry? Add some items!</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-3xl">
                    <img src={item.imagesUrl} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{item.item_name}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 bg-white dark:bg-zinc-800 rounded-lg shadow-sm text-xs">—</button>
                        <span className="font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 bg-white dark:bg-zinc-800 rounded-lg shadow-sm text-xs">+</button>
                      </div>
                    </div>
                    <p className="font-black text-md text-[#135bec]">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-8 bg-zinc-50 dark:bg-zinc-900/50 border-t dark:border-zinc-800">
              <div className="flex justify-between items-center mb-6">
                <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em]">Subtotal</span>
                <span className="text-3xl font-black text-[#135bec]">${cartTotal.toFixed(2)}</span>
              </div>
              
              {!isLoggedIn ? (
                <button 
                  onClick={() => { setIsCartOpen(false); navigate('/login'); }}
                  className="w-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all"
                >
                  Login to Checkout
                </button>
              ) : (
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || cart.length === 0}
                  className="w-full bg-[#135bec] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all disabled:opacity-30"
                >
                  {isProcessing ? "Processing..." : "Confirm & Pay"}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
      </AnimatePresence>

      {orderToken && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-[#0b0f1a]/90 backdrop-blur-xl" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white dark:bg-[#161e31] w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl font-bold">check_circle</span>
            </div>
            <h2 className="text-2xl font-black uppercase mb-2">Order Success!</h2>
            <div className="bg-[#fafafb] dark:bg-zinc-800 p-8 rounded-[2rem] border-2 border-dashed border-[#135bec] mb-8">
              <p className="text-[10px] uppercase font-black text-zinc-400 tracking-[0.3em] mb-2">Queue Token</p>
              <p className="text-6xl font-black text-[#135bec]">#{orderToken}</p>
            </div>
            <button onClick={() => { setOrderToken(null); setCart([]); }} className="w-full py-4 bg-[#135bec] text-white rounded-2xl font-bold">Done</button>
          </motion.div>
        </div>
      )}
    </div>
  );
};


export default QRMenu;