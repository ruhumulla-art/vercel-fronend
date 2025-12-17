
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, Truck, Heart, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { fetchProducts } from '../services/mockData';
import { Product } from '../types';

// Home Page
// Luxury Slider Hero + Made For Every Moment + Most Loved Styles + Trending Now + Iconic Collections + Style Edit

const HERO_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&q=80&w=1600',
    title: 'Timeless Elegance',
    subtitle: 'Discover the new autumn collection.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1600',
    title: 'The Art of Leather',
    subtitle: 'Handcrafted perfection from Florence.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?auto=format&fit=crop&q=80&w=1600',
    title: 'Modern Sophistication',
    subtitle: 'Essentials for the contemporary muse.'
  }
];

const MOMENT_SECTIONS = [
  {
    id: 1,
    label: "BUILD YOUR OWN BOX",
    link: "/shop?collection=Build Your Own Box",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=600" // Gift box aesthetic
  },
  {
    id: 2,
    label: "WORK",
    link: "/shop?category=Laptop Bags",
    image: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=600" // Professional work bag
  },
  {
    id: 3,
    label: "AFTER HOURS",
    link: "/shop?category=Clutches",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600" // Evening party
  },
  {
    id: 4,
    label: "EVERYDAY",
    link: "/shop?category=Crossbody Bags",
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=600" // Casual bag
  }
];

const TRENDING_SECTIONS = [
  {
    id: 1,
    label: "THE TRAVEL EDIT",
    link: "/shop?category=Passport Covers",
    image: "https://images.unsplash.com/photo-1631160375685-64555db657dc?auto=format&fit=crop&q=80&w=800" // Travel essentials
  },
  {
    id: 2,
    label: "THE FALL PALETTE",
    link: "/shop?collection=Fierce Collection",
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=800" // Elegant clutch/model
  },
  {
    id: 3,
    label: "ACCESSORIZE YOUR WAY",
    link: "/shop?category=Charms",
    image: "https://images.unsplash.com/photo-1616782415714-239632832569?auto=format&fit=crop&q=80&w=800" // Accessories close up
  }
];

const ICONIC_COLLECTIONS = [
  {
    id: 1,
    label: "LE TWEED",
    link: "/shop?collection=Le Tweed",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600" 
  },
  {
    id: 2,
    label: "THE MINIMALIST",
    link: "/shop?collection=The Minimalist",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    label: "THE INVITE",
    link: "/shop?collection=The Invite",
    image: "https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    label: "NYLON",
    link: "/shop?collection=Nylon Collection",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600"
  }
];

const STYLE_EDIT_ITEMS = [
  {
    id: 1,
    name: "ALEXA TOTE BAG",
    price: 3249,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1618221639211-c750eb26244f?auto=format&fit=crop&q=80&w=600",
    link: "/product/tote-1"
  },
  {
    id: 2,
    name: "BIANCA LAPTOP BAG",
    price: 5249,
    originalPrice: 6999,
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=600",
    link: "/product/laptop-1"
  },
  {
    id: 3,
    name: "SHELBY SATCHEL BAG",
    price: 3399,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1575296093822-9807b539c39c?auto=format&fit=crop&q=80&w=600",
    link: "/product/top-handle-1"
  },
  {
    id: 4,
    name: "VANILLA HOBO BAG",
    price: 4249,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1605218427368-35b81a3dd31c?auto=format&fit=crop&q=80&w=600",
    link: "/product/hobo-1"
  },
  {
    id: 5,
    name: "BREE MINI CROSSBODY",
    price: 1999,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=600",
    link: "/product/mini-1"
  },
  {
    id: 6,
    name: "MARTINA TOTE BAG",
    price: 4124,
    originalPrice: 5499,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600",
    link: "/product/tote-2"
  }
];

const MOST_LOVED_TABS = [
  { id: 'all', label: 'ALL BESTSELLERS', category: null },
  { id: 'tote', label: 'TOTE', category: 'Tote Bags' },
  { id: 'shoulder', label: 'SHOULDER', category: 'Shoulder Bags' },
  { id: 'top_handle', label: 'TOP HANDLE', category: 'Top Handle Bags' },
  { id: 'crossbody', label: 'CROSSBODY', category: 'Crossbody Bags' },
  { id: 'mini', label: 'MINI & MICRO', category: 'Mini Bags' },
];

const BRAND_MESSAGES = [
  <span key="1">Designed for today’s woman—<span className="font-bold">refined style</span>, <span className="font-bold">modern trends</span>, and <span className="font-bold">everyday versatility</span></span>,
  <span key="2">Where modern elegance meets versatility—bags designed to <span className="font-bold">move with you</span></span>,
  <span key="3">Timeless design for the modern woman—<span className="font-bold">chic</span>, <span className="font-bold">functional</span>, and <span className="font-bold">effortlessly stylish</span></span>
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeLovedTab, setActiveLovedTab] = useState('all');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const styleEditScrollRef = useRef<HTMLDivElement>(null);

  // Auto-rotate slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Rotate Brand Messages
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % BRAND_MESSAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Data
  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollStyleEditLeft = () => {
    if (styleEditScrollRef.current) {
      styleEditScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollStyleEditRight = () => {
    if (styleEditScrollRef.current) {
      styleEditScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Filter Logic for Most Loved Section
  const getLovedProducts = () => {
    const activeTabObj = MOST_LOVED_TABS.find(t => t.id === activeLovedTab);
    if (!activeTabObj) return products.slice(0, 10);
    
    if (activeTabObj.id === 'all') {
      return products.slice(0, 10); // Return subset for homepage performance
    }
    return products.filter(p => p.category === activeTabObj.category);
  };

  const lovedProducts = getLovedProducts();

  return (
    <div className="pb-20 md:pb-0">
      
      {/* Luxury Carousel Hero */}
      <section className="relative h-[85vh] overflow-hidden bg-stone-100">
        {HERO_SLIDES.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-black/20 z-10"></div>
            <img 
              src={slide.image} 
              alt="Luxury Handbag" 
              className={`w-full h-full object-cover transition-transform duration-[8000ms] ${index === currentSlide ? 'scale-110' : 'scale-100'}`}
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center text-white px-4 max-w-3xl animate-slide-up">
                <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 font-light">LORA HALLE</p>
                <h1 className="text-5xl md:text-7xl font-serif font-medium mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl font-light opacity-90 mb-10 italic font-serif">
                  {slide.subtitle}
                </p>
                <Link to="/shop" className="inline-block px-10 py-4 bg-white text-stone-900 text-sm font-bold uppercase tracking-widest hover:bg-gold-50 transition-colors">
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Indicators */}
        <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center gap-4">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Brand Message Animation Section */}
      <div className="bg-white py-8 border-b border-stone-100 min-h-[120px] flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 text-center">
             <p key={currentMessage} className="text-stone-900 text-lg md:text-2xl font-serif animate-fade-in leading-relaxed">
                {BRAND_MESSAGES[currentMessage]}
             </p>
        </div>
      </div>

      {/* MADE FOR EVERY MOMENT SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-b border-stone-100">
        <div className="mb-10">
           <h2 className="text-2xl md:text-3xl font-serif text-stone-900 uppercase tracking-widest mb-2">Made for Every Moment</h2>
           <div className="w-24 h-px bg-gold-400"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOMENT_SECTIONS.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <Link to={item.link} className="block">
                <div className="relative aspect-[3/4] overflow-hidden mb-5 bg-stone-100">
                  <img 
                    src={item.image} 
                    alt={item.label} 
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>
                <div>
                  <span className="text-sm font-bold text-stone-900 uppercase tracking-widest border-b border-transparent group-hover:border-stone-900 pb-1 transition-all">
                    {item.label}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* MOST-LOVED STYLES SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-b border-stone-100">
        <div className="mb-10">
           <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-stone-900 mb-6">MOST-LOVED STYLES</h2>
           
           {/* Tabs */}
           <div className="flex overflow-x-auto no-scrollbar gap-8 border-b border-stone-200">
              {MOST_LOVED_TABS.map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveLovedTab(tab.id)}
                   className={`whitespace-nowrap pb-3 text-[11px] md:text-xs font-bold uppercase tracking-widest transition-all relative ${
                     activeLovedTab === tab.id ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
                   }`}
                 >
                   {tab.label}
                   {activeLovedTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900"></span>}
                 </button>
              ))}
           </div>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
           {/* Products Slider */}
           <div 
             ref={scrollContainerRef}
             className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x"
           >
              {lovedProducts.length === 0 ? (
                 <div className="w-full py-12 text-center text-stone-400 font-light italic">No products available in this category yet.</div>
              ) : (
                lovedProducts.map(product => {
                  const discountPercentage = product.originalPrice 
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
                    : 0;

                  return (
                    <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                       <div className="relative bg-stone-50 aspect-square mb-4 group cursor-pointer overflow-hidden">
                          <Link to={`/product/${product.id}`}>
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                          </Link>
                          <button className="absolute top-3 right-3 text-stone-400 hover:text-red-500 transition-colors">
                             <Heart size={20} strokeWidth={1.5} />
                          </button>
                       </div>
                       
                       {/* Color Variants Thumbnails */}
                       <div className="flex gap-2 mb-3 h-10">
                          {product.colors && product.colors.length > 0 ? (
                             product.colors.map((colorImg, idx) => (
                               <div key={idx} className="w-8 h-10 border border-stone-200 cursor-pointer hover:border-stone-900 transition-colors">
                                  <img src={colorImg} alt="Color" className="w-full h-full object-cover" />
                               </div>
                             ))
                          ) : (
                             // Fallback if no specific colors
                             <div className="w-8 h-10 border border-stone-200 cursor-pointer hover:border-stone-900 transition-colors">
                                <img src={product.image} alt="Color" className="w-full h-full object-cover" />
                             </div>
                          )}
                       </div>

                       <Link to={`/product/${product.id}`} className="block">
                         <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-1 truncate">{product.name}</h3>
                       </Link>
                       
                       <div className="flex items-center gap-3 text-sm">
                          <span className="font-bold text-stone-900">₹{product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                             <>
                               <span className="text-stone-400 line-through text-xs">₹{product.originalPrice.toLocaleString()}</span>
                               <span className="text-gold-600 text-xs font-bold">{discountPercentage}% OFF</span>
                             </>
                          )}
                       </div>
                    </div>
                  );
                })
              )}
           </div>

           {/* Navigation Arrows */}
           <button 
             onClick={scrollLeft}
             className="absolute left-0 top-1/3 -translate-y-1/2 -ml-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-stone-600 opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0 z-10 hidden md:flex"
           >
             <ChevronLeft size={20} />
           </button>
           <button 
             onClick={scrollRight}
             className="absolute right-0 top-1/3 -translate-y-1/2 -mr-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-stone-600 opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0 z-10 hidden md:flex"
           >
             <ChevronRight size={20} />
           </button>
        </div>
      </section>

      {/* TRENDING NOW SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-b border-stone-100">
        <div className="mb-10">
           <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-stone-900">TRENDING NOW</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRENDING_SECTIONS.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <Link to={item.link} className="block">
                <div className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/3] overflow-hidden mb-4 bg-stone-100">
                  <img 
                    src={item.image} 
                    alt={item.label} 
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-stone-900 uppercase tracking-widest">
                    {item.label}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ICONIC COLLECTIONS SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-b border-stone-100">
        <div className="mb-10">
           <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-stone-900">ICONIC COLLECTIONS</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {ICONIC_COLLECTIONS.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <Link to={item.link} className="block">
                <div className="relative aspect-square overflow-hidden mb-4 bg-stone-100">
                  <img 
                    src={item.image} 
                    alt={item.label} 
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
                  />
                  {/* Optional arrow overlay if needed, similar to screenshot */}
                  {/* <div className="absolute top-1/2 left-0 w-8 h-8 -translate-y-1/2 bg-white/80 rounded-full flex items-center justify-center">...</div> */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-stone-900 uppercase tracking-widest">
                    {item.label}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* THE STYLE EDIT (SHOP BY VIDEO) SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-10">
           <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-stone-900">THE STYLE EDIT</h2>
        </div>

        <div className="relative group/styleedit">
           {/* Video/Image Slider */}
           <div 
             ref={styleEditScrollRef}
             className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x"
           >
              {STYLE_EDIT_ITEMS.map((item) => (
                <div key={item.id} className="min-w-[220px] md:min-w-[260px] snap-start">
                   <div className="relative aspect-[9/16] mb-4 bg-stone-100 overflow-hidden cursor-pointer group/card">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/40 shadow-lg">
                            <Play size={20} fill="currentColor" className="ml-1" />
                         </div>
                      </div>
                      {/* Shop Now Overlay Button - Appears on Hover */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-full group-hover/card:translate-y-0 transition-transform duration-300 w-max">
                         <Link to={item.link} className="bg-white text-stone-900 text-[10px] font-bold uppercase tracking-widest px-4 py-2 shadow-lg">
                            Shop Now
                         </Link>
                      </div>
                   </div>
                   
                   <div className="text-left">
                     <h3 className="text-xs font-bold text-stone-900 uppercase tracking-widest mb-1 truncate">{item.name}</h3>
                     <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-stone-900">₹{item.price.toLocaleString()}</span>
                        {item.originalPrice && (
                           <span className="text-stone-400 line-through">₹{item.originalPrice.toLocaleString()}</span>
                        )}
                     </div>
                   </div>
                </div>
              ))}
           </div>

           {/* Navigation Arrows */}
           <button 
             onClick={scrollStyleEditLeft}
             className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-stone-600 opacity-0 group-hover/styleedit:opacity-100 transition-opacity disabled:opacity-0 z-10 hidden md:flex"
           >
             <ChevronLeft size={20} />
           </button>
           <button 
             onClick={scrollStyleEditRight}
             className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-stone-600 opacity-0 group-hover/styleedit:opacity-100 transition-opacity disabled:opacity-0 z-10 hidden md:flex"
           >
             <ChevronRight size={20} />
           </button>
        </div>
      </section>

      {/* Brand Values / Features */}
      <section className="bg-stone-50 py-16 border-t border-stone-200">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-stone-800 mx-auto mb-6 shadow-sm border border-stone-100">
                <Truck size={20} strokeWidth={1.5} />
              </div>
              <h3 className="text-stone-900 text-lg font-serif mb-3">White Glove Delivery</h3>
              <p className="text-stone-500 font-light text-sm leading-relaxed">Secure and insured shipping to over 50 countries worldwide.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-stone-800 mx-auto mb-6 shadow-sm border border-stone-100">
                <ShieldCheck size={20} strokeWidth={1.5} />
              </div>
              <h3 className="text-stone-900 text-lg font-serif mb-3">Lifetime Guarantee</h3>
              <p className="text-stone-500 font-light text-sm leading-relaxed">We stand behind the craftsmanship of every piece, forever.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-stone-800 mx-auto mb-6 shadow-sm border border-stone-100">
                <Star size={20} strokeWidth={1.5} />
              </div>
              <h3 className="text-stone-900 text-lg font-serif mb-3">Personal Styling</h3>
              <p className="text-stone-500 font-light text-sm leading-relaxed">Book a consultation with our experts to find your perfect match.</p>
            </div>
         </div>
      </section>

      {/* Newsletter / Footer CTA */}
      <section className="bg-stone-900 py-20 px-4 text-center">
          <h2 className="text-3xl font-serif text-white mb-6">Join Lora Halle</h2>
          <p className="text-stone-400 mb-8 max-w-md mx-auto font-light">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <div className="flex max-w-md mx-auto">
             <input type="email" placeholder="Your email address" className="flex-1 bg-transparent border-b border-stone-700 text-white py-3 px-4 focus:outline-none focus:border-gold-500 font-light" />
             <button className="text-gold-500 text-sm font-bold uppercase tracking-widest px-6 hover:text-white transition-colors">Subscribe</button>
          </div>
      </section>
    </div>
  );
};

export default Home;
