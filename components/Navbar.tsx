
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search, ChevronDown, ChevronRight, Heart, ChevronLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

// Announcement Bar Messages
const ANNOUNCEMENTS = [
  "7-day easy returns & exchange",
  "Free shipping on all orders",
  "Extra 10% on ₹3999"
];

// Navigation Data Structure
const NAV_ITEMS = [
  {
    label: "New Arrivals",
    path: "/shop",
    items: [
      { label: "Le Tweed", filter: "collection=Le Tweed" },
      { label: "The Minimalist", filter: "collection=The Minimalist" },
      { label: "The Invite", filter: "collection=The Invite" },
      { label: "Nylon Collection", filter: "collection=Nylon Collection" },
      { label: "View All", filter: "sort=newest" }
    ]
  },
  {
    label: "Best Sellers",
    path: "/shop?filter=trending",
    items: [] // Direct link
  },
  {
    label: "Shop by Category",
    path: "/shop",
    items: [
      { label: "Tote Bags", filter: "category=Tote Bags" },
      { label: "Top Handle Bags", filter: "category=Top Handle Bags" },
      { label: "Laptop Bags", filter: "category=Laptop Bags" },
      { label: "Crossbody Bags", filter: "category=Crossbody Bags" },
      { label: "Shoulder Bags", filter: "category=Shoulder Bags" },
      { label: "Hobo Bags", filter: "category=Hobo Bags" },
      { label: "Mini Bags", filter: "category=Mini Bags" },
      { label: "Clutches", filter: "category=Clutches" },
      { label: "Wallets & Card Holders", filter: "category=Wallets & Card Holders" },
      { label: "Charms", filter: "category=Charms" },
      { label: "Passport Covers", filter: "category=Passport Covers" },
      { label: "Travel Pouches", filter: "category=Travel Pouches" },
      { label: "View All", filter: "category=All" }
    ]
  },
  {
    label: "Featured Collections",
    path: "/shop",
    items: [
      { label: "Holiday Collection", filter: "collection=Holiday Collection" },
      { label: "Summer Scoop", filter: "collection=Summer Scoop" },
      { label: "Capsule Collection", filter: "collection=Capsule Collection" },
      { label: "Lora Halle & Deme", filter: "collection=Lora Halle & Deme" },
      { label: "Beyond Basics", filter: "collection=Beyond Basics" },
      { label: "Fierce Collection", filter: "collection=Fierce Collection" }
    ]
  },
  {
    label: "Gifting",
    path: "/shop",
    items: [
      { label: "Build Your Own Box", filter: "collection=Build Your Own Box" },
      { label: "Corporate Gifting", filter: "collection=Corporate Gifting" }
    ]
  },
  {
    label: "Shop by Video",
    path: "/shop", // Placeholder for video shop
    items: []
  }
];

const Navbar = () => {
  const { cart, user, openCart, wishlist } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  // Announcement Slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000); // 4 seconds
    return () => clearInterval(interval);
  }, []);

  const nextAnnouncement = () => {
    setCurrentAnnouncement((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  const prevAnnouncement = () => {
    setCurrentAnnouncement((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <>
      {/* Top Announcement Bar - Slider */}
      <div className="bg-stone-50 border-b border-stone-100 relative z-40">
        <div className="max-w-[1440px] mx-auto px-4 h-10 flex items-center justify-between">
           <button 
             onClick={prevAnnouncement}
             className="text-stone-400 hover:text-stone-900 transition-colors hidden md:block"
             aria-label="Previous Offer"
           >
              <ChevronLeft size={14} />
           </button>
           <div className="flex-1 text-center">
              <span key={currentAnnouncement} className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-stone-800 animate-fade-in block">
                {ANNOUNCEMENTS[currentAnnouncement]}
              </span>
           </div>
           <button 
             onClick={nextAnnouncement}
             className="text-stone-400 hover:text-stone-900 transition-colors hidden md:block"
             aria-label="Next Offer"
           >
              <ChevronRight size={14} />
           </button>
        </div>
      </div>

      {/* Main Navigation */}
      <nav 
        className={`sticky top-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white border-b border-stone-100'}`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            
            {/* 1. Mobile Menu Button */}
            <div className="lg:hidden flex-shrink-0">
                <button 
                  onClick={() => setIsMenuOpen(true)} 
                  className="text-stone-800 p-2 -ml-2 hover:bg-stone-50 rounded-full transition-colors relative z-10"
                  aria-label="Open Menu"
                >
                  <Menu size={24} />
                </button>
            </div>

            {/* 2. Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <span className="text-2xl md:text-3xl font-serif font-bold tracking-widest text-stone-900 whitespace-nowrap">
                  LORA HALLE
                </span>
              </Link>
            </div>

            {/* 3. Desktop Navigation */}
            <div className="hidden lg:flex flex-1 justify-center px-8">
              <div className="flex items-center space-x-6 xl:space-x-8">
                {NAV_ITEMS.map((item) => (
                  <div 
                    key={item.label}
                    className="relative group h-24 flex items-center"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                  >
                    <Link 
                      to={item.path}
                      className={`text-[11px] xl:text-xs font-bold uppercase tracking-[0.15em] transition-colors whitespace-nowrap ${
                        activeDropdown === item.label ? 'text-stone-900' : 'text-stone-900 hover:text-stone-600'
                      }`}
                    >
                      {item.label}
                    </Link>

                    {/* Mega Menu / Dropdown */}
                    {item.items.length > 0 && activeDropdown === item.label && (
                      <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-56 bg-white border border-stone-100 shadow-xl p-5 z-50 animate-fade-in -mt-1">
                         <ul className="space-y-3">
                           {item.items.map(subItem => (
                             <li key={subItem.label}>
                               <Link 
                                 to={`/shop?${subItem.filter}`}
                                 className="block text-sm font-light text-stone-600 hover:text-stone-900 hover:translate-x-1 transition-all"
                                 onClick={() => setActiveDropdown(null)}
                               >
                                 {subItem.label}
                               </Link>
                             </li>
                           ))}
                         </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Icons (User, Search, Wishlist, Bag) */}
            <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
              
              {/* User / Login Icon */}
              <Link 
                to={user ? "/dashboard" : "/auth"} 
                className="text-stone-900 hover:text-stone-600 transition-colors hidden md:block"
                aria-label={user ? "Account" : "Sign In"}
              >
                <User size={22} strokeWidth={1.5} />
              </Link>

              {/* Search Icon */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-stone-900 hover:text-stone-600 transition-colors"
                aria-label="Search"
              >
                <Search size={22} strokeWidth={1.5} />
              </button>
              
              {/* Wishlist Icon */}
              <Link 
                to="/wishlist" 
                className="relative text-stone-900 hover:text-stone-600 transition-colors hidden md:block"
                aria-label="Wishlist"
              >
                <Heart size={22} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-black rounded-full border border-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Icon */}
              <button 
                onClick={openCart}
                className="relative text-stone-900 hover:text-stone-600 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={22} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-black rounded-full border border-white">
                    {cartCount}
                  </span>
                )}
              </button>

            </div>
          </div>
        </div>

        {/* Search Bar Overlay - Inside Nav but Absolute */}
        {isSearchOpen && (
           <div className="absolute top-full left-0 w-full bg-white border-b border-stone-200 py-4 px-4 shadow-sm animate-fade-in z-[110]">
              <div className="max-w-[1440px] mx-auto flex items-center gap-4">
                 <Search size={20} className="text-stone-400 flex-shrink-0" />
                 <input 
                    type="text" 
                    placeholder="Search for..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-base md:text-lg border-none focus:ring-0 placeholder-stone-400 text-stone-900 font-light bg-transparent focus:outline-none h-10" 
                    autoFocus
                 />
                 <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="text-stone-400 hover:text-stone-900 p-2">
                    <X size={24} strokeWidth={1} />
                 </button>
              </div>
           </div>
        )}
      </nav>

      {/* Full Screen Mobile Menu - MOVED OUTSIDE NAV to prevent backdrop-filter clipping */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-white animate-fade-in flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 h-20 border-b border-stone-100 flex-shrink-0">
             <span className="text-2xl font-serif font-bold tracking-widest text-stone-900">
                LORA HALLE
             </span>
             <button 
               onClick={() => setIsMenuOpen(false)} 
               className="p-2 -mr-2 text-stone-900 hover:bg-stone-50 rounded-full"
               aria-label="Close Menu"
             >
               <X size={24} />
             </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-6 space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="border-b border-stone-100">
                  <div className="flex justify-between items-center">
                    {item.items.length > 0 ? (
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                        className="flex-1 text-left py-4 text-sm font-bold uppercase tracking-widest text-stone-900 flex justify-between items-center group"
                      >
                        {item.label}
                        <span className={`text-stone-400 transition-transform duration-200 ${mobileExpanded === item.label ? 'rotate-180' : ''}`}>
                           <ChevronDown size={16} />
                        </span>
                      </button>
                    ) : (
                      <Link 
                        to={item.path} 
                        onClick={() => setIsMenuOpen(false)}
                        className="block flex-1 py-4 text-sm font-bold uppercase tracking-widest text-stone-900"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                  
                  {/* Mobile Submenu */}
                  {item.items.length > 0 && (
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-stone-50 ${mobileExpanded === item.label ? 'max-h-[500px] opacity-100 mb-2' : 'max-h-0 opacity-0'}`}>
                       <div className="px-4 py-2">
                         {item.items.map(subItem => (
                           <Link 
                             key={subItem.label}
                             to={`/shop?${subItem.filter}`}
                             onClick={() => setIsMenuOpen(false)}
                             className="block py-3 text-sm text-stone-600 border-b border-stone-200 last:border-0 hover:text-stone-900"
                           >
                             {subItem.label}
                           </Link>
                         ))}
                       </div>
                    </div>
                  )}
                </div>
              ))}
              
              <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="block py-4 text-sm font-bold uppercase tracking-widest text-stone-900 border-b border-stone-100 flex items-center gap-3">
                <Heart size={18} strokeWidth={1.5} /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
              
              <Link to={user ? "/dashboard" : "/auth"} onClick={() => setIsMenuOpen(false)} className="block py-4 text-sm font-bold uppercase tracking-widest text-stone-900 border-b border-stone-100 flex items-center gap-3">
                <User size={18} strokeWidth={1.5} /> {user ? 'My Account' : 'Sign In / Register'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
