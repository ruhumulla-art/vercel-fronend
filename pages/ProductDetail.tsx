
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById, PRODUCTS } from '../services/mockData';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ChevronDown, ChevronUp, Info, Share2, Truck, AlertCircle } from 'lucide-react';

// Accordion Component
const ProductAccordion = ({ title, children, isOpen, onToggle }: { title: string, children?: React.ReactNode, isOpen: boolean, onToggle: () => void }) => (
  <div className="border-b border-stone-200">
    <button 
      onClick={onToggle}
      className="w-full py-5 flex justify-between items-center text-left group transition-colors"
    >
       <span className="text-sm font-medium text-stone-900 group-hover:text-stone-600 uppercase tracking-wide">{title}</span>
       {isOpen ? <ChevronUp size={16} className="text-stone-900" /> : <ChevronDown size={16} className="text-stone-900" />}
    </button>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'}`}>
       <div className="text-xs text-stone-500 leading-relaxed pr-4 font-light">
          {children}
       </div>
    </div>
  </div>
);

// Recommendation Card Component
const RecommendationCard: React.FC<{ product: Product }> = ({ product }) => {
   const { toggleWishlist, isInWishlist } = useStore();
   const [hoveredImage, setHoveredImage] = useState(product.image);
   const discount = product.originalPrice 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
      : 0;
   
   const inWishlist = isInWishlist(product.id);

   const thumbnails = [product.image, ...(product.colors || [])].slice(0, 3);

   return (
      <div className="group">
         <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden mb-3">
            <Link to={`/product/${product.id}`}>
               <img 
                  src={hoveredImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
               />
            </Link>
            <button 
               onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product);
               }}
               className={`absolute top-3 right-3 transition-colors ${inWishlist ? 'text-red-500' : 'text-stone-900 hover:text-red-500'}`}
               aria-label="Add to wishlist"
            >
               <Heart size={18} strokeWidth={1.5} fill={inWishlist ? "currentColor" : "none"} />
            </button>
         </div>

         <div className="flex gap-2 mb-3">
            {thumbnails.map((img, idx) => (
               <button 
                  key={idx} 
                  onMouseEnter={() => setHoveredImage(img)}
                  className={`w-10 h-12 border transition-all ${hoveredImage === img ? 'border-stone-900' : 'border-stone-200 hover:border-stone-400'}`}
               >
                  <img src={img} alt="" className="w-full h-full object-cover" />
               </button>
            ))}
         </div>

         <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide mb-1">{product.name}</h3>
            <div className="flex items-center gap-2 text-xs">
               <span className="font-bold text-stone-900">₹{product.price.toLocaleString()}</span>
               {product.originalPrice && (
                  <>
                     <span className="text-stone-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                     <span className="text-stone-900 font-bold">{discount}% OFF</span>
                  </>
               )}
            </div>
         </Link>
      </div>
   );
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [pincode, setPincode] = useState('');
  
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [pincodeError, setPincodeError] = useState('');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (id) {
      setLoading(true);
      setError(null);
      fetchProductById(id)
        .then(data => {
          if (!data) {
             setError("Product not found");
          } else {
             setProduct(data);
             setActiveImage(data.image);
          }
          setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setError("Failed to load product details");
            setLoading(false);
        });
    }
  }, [id]);

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const handlePincodeCheck = () => {
    const indianPincodeRegex = /^[1-9][0-9]{5}$/;

    if (!indianPincodeRegex.test(pincode)) {
        setDeliveryDate(null);
        setPincodeError("Please enter a valid 6-digit Pincode.");
        return;
    }

    setPincodeError('');
    
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 5);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const getOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const startDay = getOrdinal(startDate.getDate());
    const endDay = getOrdinal(endDate.getDate());
    
    let dateString = "";
    if (startDate.getMonth() !== endDate.getMonth()) {
        dateString = `${startDay} ${monthNames[startDate.getMonth()]} and ${endDay} ${monthNames[endDate.getMonth()]}`;
    } else {
        dateString = `${startDay} and ${endDay} ${monthNames[endDate.getMonth()]}`;
    }

    setDeliveryDate(dateString);
  };

  if (loading) return (
     <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin mb-4"></div>
            <span className="text-xs font-serif italic text-stone-400">Loading Atelier...</span>
        </div>
     </div>
  );

  if (error || !product) return (
     <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <AlertCircle size={48} className="text-stone-300 mb-4" />
        <h2 className="text-2xl font-serif text-stone-900 mb-2">Item Unavailable</h2>
        <p className="text-stone-500 mb-6">{error || "This product may have been discontinued."}</p>
        <button onClick={() => navigate('/shop')} className="px-6 py-3 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-stone-800">Return to Shop</button>
     </div>
  );

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const emiPrice = Math.round(product.price / 3);

  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
  const displayRelated = relatedProducts.length < 4 
    ? [...relatedProducts, ...PRODUCTS.filter(p => p.id !== product.id && !relatedProducts.includes(p))].slice(0, 4)
    : relatedProducts;

  const recentlyViewed = [...PRODUCTS].reverse().filter(p => p.id !== product.id).slice(0, 4);
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 animate-fade-in relative">
      
      <nav className="flex items-center text-[10px] md:text-xs uppercase tracking-widest text-stone-500 mb-8 font-medium overflow-x-auto whitespace-nowrap no-scrollbar">
         <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
         <span className="mx-2 text-stone-300">/</span>
         <Link to="/shop" className="hover:text-stone-900 transition-colors">{product.category}</Link>
         <span className="mx-2 text-stone-300">/</span>
         <span className="text-stone-900 font-bold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-24">
        
        {/* Images */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
           <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-24 md:max-h-[700px] no-scrollbar flex-shrink-0">
              <button 
                onClick={() => setActiveImage(product.image)}
                className={`border transition-all duration-200 w-20 h-24 flex-shrink-0 bg-[#F6F6F6] flex items-center justify-center ${activeImage === product.image ? 'border-stone-900' : 'border-transparent hover:border-stone-300'}`}
              >
                <img src={product.image} alt="Main View" className="w-full h-full object-contain p-1" loading="lazy" />
              </button>
              {product.colors && product.colors.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`border transition-all duration-200 w-20 h-24 flex-shrink-0 bg-[#F6F6F6] flex items-center justify-center ${activeImage === img ? 'border-stone-900' : 'border-transparent hover:border-stone-300'}`}
                >
                  <img src={img} alt={`View ${idx}`} className="w-full h-full object-contain p-1" loading="lazy" />
                </button>
              ))}
           </div>

           <div className="flex-1 bg-[#F6F6F6] relative aspect-[4/5] md:aspect-auto md:h-[700px] flex items-center justify-center overflow-hidden cursor-zoom-in group">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-110 will-change-transform" 
                loading="eager"
                decoding="async"
                style={{ imageRendering: 'auto' }}
              />
              <button className="absolute bottom-6 right-6 p-3 bg-white rounded-full shadow-md hover:bg-stone-50 transition-colors z-10 text-stone-600">
                 <Share2 size={18} />
              </button>
           </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-5 flex flex-col pt-1">
          <h1 className="text-2xl font-bold uppercase tracking-wide text-stone-900 mb-3 font-sans leading-tight">{product.name}</h1>
          <div className="flex items-center gap-3 mb-2">
             <span className="text-xl font-bold text-stone-900">₹{product.price.toLocaleString()}</span>
             {product.originalPrice && (
                <>
                  <span className="text-stone-400 line-through text-sm">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="text-green-700 text-sm font-bold tracking-wide">{discountPercentage}% OFF</span>
                </>
             )}
          </div>
          
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] md:text-xs text-stone-600 mb-8 pb-6 border-b border-stone-100">
             <span>or Pay</span>
             <span className="font-bold text-green-700">₹{emiPrice}</span>
             <span>now & rest later via Lora Halle Pay Later</span>
             <Info size={13} className="text-stone-400 cursor-pointer hover:text-stone-600" />
          </div>

          <div className="mb-8">
             <span className="text-stone-500 text-xs mb-3 block">Color: <span className="text-stone-900 font-bold">Gold</span></span>
             <div className="flex gap-3">
                <button 
                  onClick={() => setActiveImage(product.image)}
                  className={`w-14 h-14 border p-0.5 bg-stone-50 transition-all ${activeImage === product.image ? 'border-stone-900 ring-1 ring-stone-900 ring-offset-1' : 'border-stone-200 hover:border-stone-400'}`}
                >
                   <img src={product.image} className="w-full h-full object-cover" alt="Color 1" />
                </button>
                {product.colors?.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-14 h-14 border p-0.5 bg-stone-50 transition-all ${activeImage === img ? 'border-stone-900 ring-1 ring-stone-900 ring-offset-1' : 'border-stone-200 hover:border-stone-400'}`}
                  >
                     <img src={img} className="w-full h-full object-cover" alt={`Color ${idx + 2}`} />
                  </button>
                ))}
             </div>
          </div>

          <div className="flex gap-4 mb-8">
             <button 
                onClick={() => toggleWishlist(product)}
                className={`flex items-center justify-center border w-14 h-14 transition-all group ${inWishlist ? 'border-stone-900' : 'border-stone-300 hover:border-stone-900 hover:text-red-500'}`}
                aria-label="Add to wishlist"
             >
                <Heart size={22} strokeWidth={1.5} className={`transition-colors ${inWishlist ? 'fill-red-500 stroke-red-500' : 'group-hover:fill-red-500 group-hover:stroke-red-500'}`} />
             </button>
             <button 
                onClick={() => addToCart(product)}
                className="flex-1 bg-black text-white font-bold uppercase tracking-widest text-sm hover:bg-stone-800 active:scale-[0.99] transition-all h-14 shadow-sm"
             >
                ADD TO CART
             </button>
          </div>

          {/* ... Additional details (offers, description, etc) ... */}
          <div className="mb-8">
             <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-medium text-stone-900">Discover All Offers</h4>
                <button className="text-xs text-stone-900 font-bold flex items-center gap-1 hover:opacity-70 transition-opacity">View all <ChevronDown size={12} className="-rotate-90"/></button>
             </div>
             <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
                <div className="min-w-[220px] bg-[#F9F9F9] p-4 text-xs border border-transparent hover:border-stone-200 transition-colors">
                   <span className="font-bold block mb-1 text-stone-900">Latest Offers</span>
                   <span className="text-stone-500">2 offers available</span>
                </div>
                <div className="min-w-[220px] bg-[#F9F9F9] p-4 text-xs border border-transparent hover:border-stone-200 transition-colors">
                   <span className="font-bold block mb-1 text-stone-900">Bank Offers</span>
                   <span className="text-stone-500">6 offers available</span>
                </div>
             </div>
          </div>

          <div className="mb-8">
             <h4 className="text-sm font-medium text-stone-900 mb-3">Delivery Details</h4>
             <div className="flex h-11 relative mb-2">
                <input 
                  type="text" 
                  placeholder="Enter your pincode" 
                  value={pincode}
                  onChange={(e) => {
                     setPincode(e.target.value);
                     if (pincodeError) setPincodeError('');
                     if (deliveryDate) setDeliveryDate(null);
                  }}
                  maxLength={6}
                  className="flex-1 border border-stone-300 border-r-0 px-4 text-sm focus:outline-none focus:border-stone-900 placeholder:text-stone-400 bg-transparent transition-colors"
                />
                <button 
                  onClick={handlePincodeCheck}
                  className="bg-black text-white px-8 text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors"
                >
                   CHECK
                </button>
             </div>
             {pincodeError && <p className="text-red-500 text-xs mt-1 animate-fade-in">{pincodeError}</p>}
             {deliveryDate && (
                <div className="flex items-center gap-2 mt-2 animate-fade-in">
                   <Truck size={16} className="text-stone-900" />
                   <span className="text-xs text-stone-600">
                      Delivery between <span className="text-green-700 font-bold">{deliveryDate}</span>
                   </span>
                </div>
             )}
          </div>

          <div className="mb-8">
             <p className="text-sm text-stone-600 leading-7 font-light text-justify">{product.description}</p>
          </div>

          <div className="mb-10">
             <h4 className="text-sm font-medium text-stone-900 mb-4">Key Features</h4>
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 pl-4">
                {product.features ? product.features.map((feature, index) => (
                   <li key={index} className="text-[11px] md:text-xs text-stone-600 list-disc marker:text-stone-400 leading-snug">{feature}</li>
                )) : (
                   <>
                     <li className="text-[11px] md:text-xs text-stone-600 list-disc marker:text-stone-400 leading-snug">Push Lock Closure</li>
                     <li className="text-[11px] md:text-xs text-stone-600 list-disc marker:text-stone-400 leading-snug">Functional Pockets</li>
                     <li className="text-[11px] md:text-xs text-stone-600 list-disc marker:text-stone-400 leading-snug">Top Handle Adjustable & Detachable Crossbody Strap</li>
                   </>
                )}
             </ul>
          </div>

          <div className="border-t border-stone-200">
             <ProductAccordion title="Why You'll Love It?" isOpen={openAccordion === 'love'} onToggle={() => toggleAccordion('love')}>
                Designed for the modern muse, this piece combines functionality with high-fashion aesthetics. The premium materials ensure longevity while the thoughtful organization keeps your essentials secure. Perfect for day-to-night transitions.
             </ProductAccordion>
             <ProductAccordion title="Details & Dimensions" isOpen={openAccordion === 'details'} onToggle={() => toggleAccordion('details')}>
                <div className="space-y-2">
                  <p><span className="font-semibold text-stone-700">Dimensions:</span> 20cm (L) x 12cm (H) x 8cm (W)</p>
                  <p><span className="font-semibold text-stone-700">Material:</span> Premium Faux Leather (Cruelty-Free)</p>
                  <p><span className="font-semibold text-stone-700">Hardware:</span> Gold-tone finished alloy</p>
                  <p><span className="font-semibold text-stone-700">Lining:</span> Polyester</p>
                  <p><span className="font-semibold text-stone-700">Weight:</span> 0.4 kg</p>
                </div>
             </ProductAccordion>
             <ProductAccordion title="Shipping & Returns" isOpen={openAccordion === 'shipping'} onToggle={() => toggleAccordion('shipping')}>
                <p className="mb-3">We offer complimentary standard shipping on all orders over ₹2000. Orders are typically processed within 1-2 business days.</p>
                <p>Returns are accepted within 14 days of delivery. Items must be unused, in original packaging, and with all tags attached.</p>
             </ProductAccordion>
             <ProductAccordion title="More Information" isOpen={openAccordion === 'more'} onToggle={() => toggleAccordion('more')}>
                <p className="mb-2"><strong>Country of Origin:</strong> India</p>
                <p className="mb-2"><strong>Manufacturer:</strong> Lora Halle Pvt Ltd.</p>
                <p><strong>Care Instructions:</strong> Wipe with a clean, dry cloth to remove dust. Avoid contact with water and perfumes.</p>
             </ProductAccordion>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200 pt-16 mb-16">
         <div className="flex items-baseline gap-4 mb-10">
            <h2 className="text-xl font-bold uppercase tracking-widest text-stone-900 border-b-2 border-stone-900 pb-1">You May Also Like</h2>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {displayRelated.map(item => (
               <RecommendationCard key={item.id} product={item} />
            ))}
         </div>
      </div>

      <div className="border-t border-stone-200 pt-16 mb-12">
         <h2 className="text-xl font-bold uppercase tracking-widest text-stone-900 mb-10">Recently Viewed Products</h2>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {recentlyViewed.map(item => (
               <RecommendationCard key={item.id} product={item} />
            ))}
         </div>
      </div>
    </div>
  );
};

export default ProductDetail;
