
import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Layout Wrapper ---
interface LayoutProps {
  children: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
  progress?: number;
  title?: string;
  subtitle?: string;
  noPadding?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onBack, 
  showBack = true, 
  progress,
  title,
  subtitle,
  noPadding = false
}) => {
  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-white relative">
      {/* Header */}
      <div className="flex flex-col px-6 pt-6 pb-2 shrink-0 z-10 bg-white">
        <div className="flex items-center h-10 mb-2 relative">
          {showBack && onBack && (
            <button 
              onClick={onBack}
              className="absolute left-0 p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          {progress !== undefined && (
            <div className="flex-1 mx-10 h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-black rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          )}
        </div>
        
        {title && (
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold leading-tight mt-2"
          >
            {title}
          </motion.h1>
        )}
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-sm mt-2 leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Scrollable Content */}
      <div className={`flex-1 overflow-y-auto no-scrollbar ${noPadding ? '' : 'px-6'}`}>
        <div className="pb-32"> {/* Bottom padding for sticky button */}
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Primary Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = true,
  className = '',
  ...props 
}) => {
  const baseStyles = "h-14 rounded-full font-semibold text-base transition-all active:scale-95 flex items-center justify-center";
  const variants = {
    primary: "bg-[#111111] text-white hover:bg-black disabled:opacity-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border-2 border-gray-200 text-gray-900 hover:bg-gray-50",
    ghost: "text-gray-500 hover:text-gray-900 bg-transparent"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Sticky Footer Wrapper ---
export const StickyFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-12 max-w-md mx-auto z-20">
    {children}
  </div>
);

// --- Selection Card ---
interface SelectCardProps {
  selected?: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  subLabel?: string;
  className?: string;
}

export const SelectCard: React.FC<SelectCardProps> = ({ selected, onClick, label, icon, subLabel, className = '' }) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full p-4 mb-3 rounded-2xl flex items-center justify-between text-left transition-all border-2 ${
      selected 
        ? 'border-black bg-black text-white shadow-lg' 
        : 'border-transparent bg-gray-50 text-gray-900 hover:bg-gray-100'
    } ${className}`}
  >
    <div className="flex items-center gap-3 w-full">
      {icon && <span className="text-xl shrink-0">{icon}</span>}
      <div className="flex-1">
        <div className="font-semibold">{label}</div>
        {subLabel && <div className={`text-xs ${selected ? 'text-gray-300' : 'text-gray-500'}`}>{subLabel}</div>}
      </div>
    </div>
    {selected && <div className="bg-white text-black rounded-full p-1 shrink-0"><Check size={12} strokeWidth={4} /></div>}
  </motion.button>
);

// --- Input Field ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="w-full mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input 
      className={`w-full h-14 px-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none text-lg ${className}`}
      {...props}
    />
  </div>
);

// --- Scroll Picker (iOS Style) ---
interface ScrollPickerProps {
  items: (string | number)[];
  value: string | number;
  onChange: (value: string | number) => void;
  label?: string;
}

export const ScrollPicker: React.FC<ScrollPickerProps> = ({ items, value, onChange, label }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeight = 48; // h-12
  const isScrolling = useRef(false);

  // Initialize scroll position
  useEffect(() => {
    if (containerRef.current && !isScrolling.current) {
      const index = items.indexOf(value);
      if (index !== -1) {
        containerRef.current.scrollTop = index * itemHeight;
      }
    }
  }, [value, items]);

  const handleScroll = () => {
    if (containerRef.current) {
      isScrolling.current = true;
      const scrollTop = containerRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const boundedIndex = Math.max(0, Math.min(index, items.length - 1));
      
      // Debounce the update slightly to avoid jitter, or update immediately if performance is fine
      if (items[boundedIndex] !== value) {
        onChange(items[boundedIndex]);
      }
      
      // Reset scrolling flag after a delay (simplified)
      setTimeout(() => { isScrolling.current = false; }, 150);
    }
  };

  return (
    <div className="relative h-48 w-full overflow-hidden">
      {/* Selection Highlight (Center) */}
      <div className="absolute top-[calc(50%-24px)] left-0 right-0 h-12 bg-gray-100 rounded-xl -z-10 pointer-events-none" />
      
      {/* Gradients */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />

      {/* Scroll Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar py-[calc(50%-24px)]"
        style={{ scrollBehavior: 'smooth' }}
      >
        {items.map((item, i) => (
          <div 
            key={i} 
            className={`h-12 flex items-center justify-center snap-center transition-all duration-200 ${
              item === value ? 'text-black font-bold text-xl scale-110' : 'text-gray-300 font-medium text-lg'
            }`}
          >
            {item} {label && item === value && <span className="text-sm font-normal ml-1">{label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Toggle Switch ---
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => (
  <button 
    onClick={() => onChange(!checked)}
    className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out ${checked ? 'bg-black' : 'bg-gray-200'}`}
  >
    <div 
      className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-0'}`} 
    />
  </button>
);
