import React, { useState, useEffect } from 'react';

const QRMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // --- ORDER STATES ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderToken, setOrderToken] = useState(null);
  
  // Initialize sequence from LocalStorage so it persists on refresh
  const [lastOrderNumber, setLastOrderNumber] = useState(() => {
    const saved = localStorage.getItem('nova_last_token');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://6995d141b081bc23e9c48a8f.mockapi.io/Menu');
        if (!response.ok) throw new Error(`Status ${response.status}: Failed to load menu`);
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // --- UPDATED INCREMENTING TOKEN LOGIC ---
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    
    // Calculate the new token number
    const nextToken = lastOrderNumber + 1;

    // The key "token" must match your database column name exactly
    const orderData = {
      token: nextToken, 
      items: cart.map(item => ({ name: item.name, qty: item.quantity })),
      totalPrice: cartTotal,
      status: "pending"
    };

    try {
      const response = await fetch('https://6995d141b081bc23e9c48a8f.mockapi.io/Order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Failed to save to database');

      // Update local state and persistence ONLY after successful API response
      setOrderToken(nextToken);
      setLastOrderNumber(nextToken);
      localStorage.setItem('nova_last_token', nextToken.toString());
      
      setIsCartOpen(false);
    } catch (err) {
      console.error("Database Error:", err);
      alert("Could not save order. Please try again.");
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
  const filteredItems = menuItems.filter(i => activeCategory === 'All' || i.category?.toLowerCase() === activeCategory.toLowerCase());
  const filteredItems1 = menuItems.filter(i => activeCategory === 'Coffee' || i.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="flex h-screen bg-[#f8f7f6] dark:bg-[#1b170d] font-['Plus_Jakarta_Sans'] overflow-hidden text-[#1b170d] dark:text-white transition-colors duration-500">
      
      {/* 1. SIDEBAR */}
      <aside className="w-72 flex-shrink-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-[#eead2b] flex items-center justify-center text-white shadow-lg shadow-[#eead2b]/30">
              <span className="material-symbols-outlined font-bold">coffee</span>
            </div>
            <h1 className="text-xl font-black tracking-tight">CAFÉ NOVA</h1>
          </div>
          <nav className="space-y-2">
            {['All', 'Coffee', 'Pastries', 'Sandwiches', 'Cold Brews'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 ${activeCategory === cat ? 'bg-[#eead2b] text-[#1b170d] font-bold shadow-md' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500'}`}
              >
                <span>{cat}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* 2. MAIN AREA */}
      <main className="flex-1 overflow-y-auto px-10 py-10 relative custom-scrollbar">
        <header className="mb-12">
          <p className="text-[#eead2b] font-bold text-sm uppercase tracking-widest mb-1">Freshly Brewed</p>
          <h2 className="text-5xl font-black uppercase tracking-tighter">{activeCategory}</h2>
        </header>

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-[#eead2b] border-t-transparent rounded-full animate-spin"></div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 pb-32">
            {filteredItems.map((item) => (
                <div key={item.id} className="group bg-white dark:bg-zinc-900 p-4 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-zinc-100 dark:border-zinc-800">
                <div className="relative h-56 rounded-[2rem] overflow-hidden mb-5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <button onClick={() => addToOrder(item)} className="absolute bottom-4 right-4 bg-[#eead2b] text-[#1b170d] w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center hover:bg-white transition-all active:scale-75 z-10">
                    <span className="material-symbols-outlined font-bold">add</span>
                    </button>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-black text-xl truncate">{item.name}</h3>
                    <span className="text-[#eead2b] font-black text-xl">${Number(item.price).toFixed(2)}</span>
                </div>
                </div>
            ))}
            </div>
        ) }
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 pb-32">
          {filteredItems1.map((item) => (
              <div key={item.id} className="group bg-white dark:bg-zinc-900 p-4 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-zinc-100 dark:border-zinc-800">
              <div className="relative h-56 rounded-[2rem] overflow-hidden mb-5">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <button onClick={() => addToOrder(item)} className="absolute bottom-4 right-4 bg-[#eead2b] text-[#1b170d] w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center hover:bg-white transition-all active:scale-75 z-10">
                  <span className="material-symbols-outlined font-bold">add</span>
                  </button>
              </div>
              <div className="flex justify-between items-center mb-2">
                  <h3 className="font-black text-xl truncate">{item.name}</h3>
                  <span className="text-[#eead2b] font-black text-xl">${Number(item.price).toFixed(2)}</span>
              </div>
              </div>
          ))}
          </div>
      

        {/* FLOATING CART BUTTON */}
        {cartCount > 0 && !orderToken && (
          <button onClick={() => setIsCartOpen(true)} className="fixed bottom-10 right-10 bg-[#1b170d] dark:bg-[#eead2b] text-white dark:text-[#1b170d] px-10 py-6 rounded-[2.5rem] flex items-center gap-6 shadow-2xl hover:scale-105 transition-all z-40 animate-bounce-in">
            <span className="material-symbols-outlined text-3xl">shopping_basket</span>
            <div className="text-left border-l border-white/20 pl-6">
              <p className="text-[10px] uppercase font-black opacity-50">View Order</p>
              <p className="text-xl font-black">${cartTotal.toFixed(2)}</p>
            </div>
          </button>
        )}
      </main>

      {/* 3. CART DRAWER */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-[#1b170d]/60 backdrop-blur-md z-[50]" onClick={() => setIsCartOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-zinc-950 z-[60] flex flex-col animate-drawer-slide shadow-2xl">
            <div className="p-10 flex justify-between items-center border-b dark:border-zinc-800">
              <h2 className="text-3xl font-black uppercase tracking-tighter">My Order</h2>
              <button onClick={() => setIsCartOpen(false)}><span className="material-symbols-outlined">close</span></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-6 items-center">
                  <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{item.name}</h4>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl px-2 font-bold">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-2">—</button>
                        <span className="px-2">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-2">+</button>
                      </div>
                    </div>
                  </div>
                  <p className="font-black text-xl">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="p-10 bg-[#f8f7f6] dark:bg-zinc-900/50 rounded-t-[3.5rem]">
              <div className="flex justify-between items-center mb-8">
                <span className="text-zinc-400 font-bold uppercase text-xs tracking-[0.2em]">Total Amount</span>
                <span className="text-4xl font-black text-[#eead2b]">${cartTotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-[#1b170d] dark:bg-[#eead2b] text-white dark:text-[#1b170d] py-6 rounded-3xl font-black text-xl shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <><span>Confirm & Pay</span><span className="material-symbols-outlined">payments</span></>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* 4. ORDER SUCCESS TOKEN OVERLAY */}
      {orderToken && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-[#1b170d]/90 backdrop-blur-xl animate-fade-in" />
          <div className="relative bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl animate-bounce-in">
            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
              <span className="material-symbols-outlined text-4xl font-bold">check_circle</span>
            </div>
            <h2 className="text-2xl font-black uppercase mb-2">Order Received!</h2>
            <p className="text-zinc-500 text-sm mb-8">Please wait for your number to be called.</p>
            
            <div className="bg-[#f8f7f6] dark:bg-zinc-800 p-8 rounded-[2rem] border-2 border-dashed border-[#eead2b] mb-8">
              <p className="text-[10px] uppercase font-black text-zinc-400 tracking-[0.3em] mb-2">Queue Token</p>
              <p className="text-6xl font-black text-[#eead2b] tracking-tighter">#{orderToken}</p>
            </div>

            <button 
              onClick={() => { setOrderToken(null); setCart([]); }}
              className="w-full py-4 bg-[#1b170d] dark:bg-white dark:text-[#1b170d] text-white rounded-2xl font-bold hover:opacity-90 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes drawer-slide { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounce-in { 
          0% { transform: scale(0.7); opacity: 0; } 
          100% { transform: scale(1); opacity: 1; } 
        }
        .animate-drawer-slide { animation: drawer-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eead2b; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default QRMenu;