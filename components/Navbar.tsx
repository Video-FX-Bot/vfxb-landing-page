import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react'; // Added Icons
import { motion } from 'framer-motion';

// 1. UPDATE INTERFACE to accept user and logout function
interface NavbarProps {
  onLoginClick: () => void;
  user: any;              // <--- New Prop
  onLogout: () => void;   // <--- New Prop
}

export const Navbar: React.FC<NavbarProps> = ({ onLoginClick, user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen ? 'bg-[#0F0F1E]/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}>
            <div className="relative w-10 h-10 flex items-center justify-center">
               <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:scale-110 transition-transform duration-300">
                  <path d="M8 8L32 20L8 32V8Z" fill="url(#logo_gradient_nav)" />
                  <defs>
                    <linearGradient id="logo_gradient_nav" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
               </svg>
            </div>
            <span className="font-black text-2xl tracking-tighter text-white font-sans">VFXB</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {['Features', 'How it Works', 'Pricing', 'Success Stories'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                  className="text-gray-300 hover:text-white transition-all px-3 py-2 rounded-md text-sm font-medium hover:bg-white/5"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* 2. CONDITIONAL RENDERING FOR BUTTONS */}
          <div className="hidden md:flex items-center gap-4">
            
            {user ? (
              // --- IF LOGGED IN SHOW THIS ---
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <User size={16} className="text-brand-primary" />
                  <span className="text-sm font-medium">Hi, {user.name || "User"}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                  title="Log Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              // --- IF NOT LOGGED IN SHOW THIS ---
              <>
                <button 
                  onClick={onLoginClick}
                  className="text-gray-300 hover:text-white font-medium text-sm transition-colors"
                >
                  Log in
                </button>
                <button className="bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-white/10">
                  Get Started Free
                </button>
              </>
            )}

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-[#0F0F1E] border-b border-white/10"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {['Features', 'How it Works', 'Pricing', 'Success Stories'].map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  {item}
                </a>
              ))}
              
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                 {/* 3. MOBILE MENU CONDITIONAL */}
                 {user ? (
                   <>
                     <div className="text-white px-3 py-2 font-medium flex items-center gap-2">
                       <User size={18} className="text-brand-primary"/> 
                       {user.name}
                     </div>
                     <button 
                       onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                       className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 font-medium flex items-center gap-2"
                     >
                       <LogOut size={18} /> Sign Out
                     </button>
                   </>
                 ) : (
                   <>
                     <button 
                       onClick={() => { onLoginClick(); setMobileMenuOpen(false); }}
                       className="w-full text-center text-gray-300 py-2"
                     >
                       Log in
                     </button>
                     <button className="w-full btn-gradient text-white py-3 rounded-lg font-bold">
                       Get Started Free
                     </button>
                   </>
                 )}
              </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};