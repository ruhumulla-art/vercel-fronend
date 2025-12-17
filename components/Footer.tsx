import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';

const AccordionItem = ({ title, children, defaultOpen = false }: { title: string, children?: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-stone-300 last:border-b-0">
      <button 
        className="w-full py-4 px-4 md:px-0 flex justify-between items-center text-left hover:bg-stone-50/50 md:hover:bg-transparent transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-bold text-stone-800 uppercase tracking-wide">{title}</span>
        <ChevronDown size={16} className={`text-stone-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 md:px-0 text-sm text-stone-600 space-y-2 pt-2">
            {children}
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-stone-200 pt-0 mt-auto">
        {/* Featured On - Marquee */}
        <div className="bg-white py-12 border-t border-b border-stone-200 overflow-hidden">
             <div className="max-w-[1440px] mx-auto px-4 mb-8">
                <h3 className="text-lg font-bold uppercase tracking-widest text-stone-900 text-center md:text-left">Featured On</h3>
             </div>
             
             {/* Marquee Container */}
             <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex gap-16 md:gap-32 items-center px-4">
                    {/* Set 1 */}
                    <span className="text-3xl md:text-4xl font-serif text-stone-400">VOGUE</span>
                    <span className="text-3xl md:text-4xl font-serif text-stone-900">HARPER'S BAZAAR</span>
                    <span className="text-3xl md:text-4xl font-serif text-pink-500 font-bold">COSMOPOLITAN</span>
                    <span className="text-3xl md:text-4xl font-serif text-stone-400">ELLE</span>
                    <span className="text-3xl md:text-4xl font-serif text-stone-900">GRAZIA</span>
                    <span className="text-3xl md:text-4xl font-serif text-stone-400">FEMINA</span>
                    
                    {/* Set 2 (Duplicate for seamless loop) */}
                    <span className="text-3xl md:text-4xl font-serif text-stone-400">VOGUE</span>
                    <span className="text-3xl md:text-4xl font-serif text-stone-900">HARPER'S BAZAAR</span>
                    <span className="text-3xl md:text-4xl font-serif text-pink-500 font-bold">COSMOPOLITAN</span>
                    <span className="text-3xl md:text-4xl font-serif text-stone-400">ELLE</span>
                    <span className="text-3xl md:text-4xl font-serif text-stone-900">GRAZIA</span>
                    <span className="text-3xl md:text-4xl font-serif text-stone-400">FEMINA</span>
                </div>
             </div>
        </div>

        {/* Accordion Sections - Light Gray Background */}
        <div className="bg-[#e5e5e5]">
            <div className="max-w-[1440px] mx-auto px-0 md:px-4 sm:px-6 lg:px-8">
                <AccordionItem title="Top Searched on Lora Halle">
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs md:text-sm font-medium">
                        <Link to="/shop?category=Tote Bags" className="hover:text-stone-900 hover:underline transition-colors">Tote Bags for Women</Link>
                        <Link to="/shop?category=Laptop Bags" className="hover:text-stone-900 hover:underline transition-colors">Laptop Bags</Link>
                        <Link to="/shop?category=Crossbody Bags" className="hover:text-stone-900 hover:underline transition-colors">Crossbody Bags</Link>
                        <Link to="/shop?category=Clutches" className="hover:text-stone-900 hover:underline transition-colors">Clutches</Link>
                        <Link to="/shop?category=Mini Bags" className="hover:text-stone-900 hover:underline transition-colors">Mini Bags</Link>
                        <Link to="/shop?category=Shoulder Bags" className="hover:text-stone-900 hover:underline transition-colors">Shoulder Bags</Link>
                        <Link to="/shop?category=Wallets" className="hover:text-stone-900 hover:underline transition-colors">Ladies Wallets</Link>
                        <Link to="/shop?category=Passport Covers" className="hover:text-stone-900 hover:underline transition-colors">Passport Covers</Link>
                        <Link to="/shop" className="hover:text-stone-900 hover:underline transition-colors">Luxury Handbags</Link>
                        <Link to="/shop" className="hover:text-stone-900 hover:underline transition-colors">Slings</Link>
                    </div>
                </AccordionItem>
                
                <AccordionItem title="Purposeful Picks">
                     <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-xs md:text-sm">
                        <Link to="/shop?category=Travel Pouches" className="hover:text-stone-900 hover:underline transition-colors">Women Travel Bags</Link>
                        <Link to="/shop?category=Clutches" className="hover:text-stone-900 hover:underline transition-colors">Night Out Bags</Link>
                        <Link to="/shop?category=Crossbody Bags" className="hover:text-stone-900 hover:underline transition-colors">Everyday Bags</Link>
                        <Link to="/shop?category=Laptop Bags" className="hover:text-stone-900 hover:underline transition-colors">Women Office Bags</Link>
                     </div>
                </AccordionItem>
                
                <AccordionItem title="Get Support">
                     <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-xs md:text-sm">
                        <Link to="/dashboard" className="hover:text-stone-900 hover:underline transition-colors">Track My Order</Link>
                        <Link to="/shop" className="hover:text-stone-900 hover:underline transition-colors">Returns & Exchange</Link>
                        <Link to="/shop" className="hover:text-stone-900 hover:underline transition-colors">Terms of Service</Link>
                        <Link to="/shop" className="hover:text-stone-900 hover:underline transition-colors">Privacy Policy</Link>
                        <Link to="/shop" className="hover:text-stone-900 hover:underline transition-colors">FAQs</Link>
                        <Link to="/shop?collection=Corporate Gifting" className="hover:text-stone-900 hover:underline transition-colors">Corporate Gifting</Link>
                     </div>
                </AccordionItem>
            </div>
        </div>

        {/* Bottom Bar - Slightly Darker */}
        <div className="bg-[#dcdcdc] py-8 px-4 border-t border-stone-300">
             <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                 <h2 className="text-3xl font-serif font-bold text-stone-900 tracking-wider">LORA HALLE</h2>
                 
                 <div className="flex items-center gap-6">
                     <span className="text-xs font-bold uppercase tracking-widest text-stone-800 hidden md:inline-block">Follow Us On</span>
                     <div className="flex gap-4">
                         {/* Facebook - Blue */}
                         <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity" aria-label="Facebook">
                            <Facebook size={18} fill="currentColor" strokeWidth={0} />
                         </a>
                         {/* Instagram - Gradient */}
                         <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#bc1888] to-[#285AEB] text-white hover:opacity-90 transition-opacity" aria-label="Instagram">
                            <Instagram size={18} />
                         </a>
                         {/* YouTube - Red */}
                         <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FF0000] text-white hover:opacity-90 transition-opacity" aria-label="YouTube">
                            <Youtube size={18} fill="currentColor" strokeWidth={0} />
                         </a>
                         {/* WhatsApp - Green */}
                         <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:opacity-90 transition-opacity" aria-label="WhatsApp">
                            <MessageCircle size={18} fill="currentColor" strokeWidth={0} />
                         </a>
                     </div>
                 </div>
             </div>
             
             <div className="max-w-[1440px] mx-auto mt-8 text-center md:text-left flex flex-col md:flex-row justify-between text-[10px] text-stone-500 uppercase tracking-widest">
                  <p>© 2024 Lora Halle. All Rights Reserved.</p>
                  <p className="mt-2 md:mt-0">India</p>
             </div>
        </div>
    </footer>
  );
};

export default Footer;