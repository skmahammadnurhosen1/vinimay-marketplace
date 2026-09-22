import React from 'react';
import { Cog, ShieldCheck, ChevronRight, ShoppingBag, Wrench, Building2, Headphones, FileText } from 'lucide-react';

interface FooterProps {
  onOpenSellerModal: () => void;
  onNavigateSection: (sectionId: string) => void;
  onNavigateShop?: (category?: string, query?: string) => void;
  onNavigateHome?: () => void;
  onOpenSellerPortal?: () => void;
  onOpenAdminPortal?: () => void;
  onOpenB2BPortal?: () => void;
  onOpenSellerRegister?: () => void;
  onOpenManufacturerPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSellerModal,
  onNavigateSection,
  onNavigateShop,
  onNavigateHome,
  onOpenSellerPortal,
  onOpenAdminPortal,
  onOpenB2BPortal,
  onOpenSellerRegister,
  onOpenManufacturerPortal,
}) => {
  return (
    <footer className="bg-[#071530] text-gray-300 text-xs pt-12 pb-8 border-t border-blue-950 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-10 border-b border-gray-800/80">
          {/* Logo & Social */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFBA00] flex items-center justify-center text-[#071530] shadow-sm">
                <Cog className="w-5 h-5 animate-spin-slow" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white leading-none tracking-tight">
                  AutoParts<span className="text-[#FFBA00]">Hub</span>
                </span>
                <span className="text-[9px] text-gray-400 mt-0.5 tracking-wide">
                  Genuine Parts. Better Journeys
                </span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed">
              India’s online marketplace for passenger and commercial vehicle spare parts.
            </p>

            {/* Authentic Social vector SVGs */}
            <div className="flex items-center space-x-2.5 text-gray-400 pt-1">
              {/* Facebook */}
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-gray-800/80 hover:bg-[#1877F2] text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-gray-800/80 hover:bg-[#0A66C2] text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#youtube"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-gray-800/80 hover:bg-[#FF0000] text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="#x"
                aria-label="X"
                className="w-8 h-8 rounded-full bg-gray-800/80 hover:bg-black text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs hover:scale-110 border border-gray-700/50"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-gray-800/80 hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>

            {/* Quick Operational & Merchant Direct Links */}
            <div className="pt-2.5 border-t border-gray-800/80 space-y-1.5 text-[11px] text-gray-400">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Merchant & Platform Operations:
              </span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {onOpenSellerRegister && (
                  <button
                    onClick={onOpenSellerRegister}
                    className="text-gray-400 hover:text-[#FFBA00] transition-colors cursor-pointer"
                  >
                    Create Seller ID
                  </button>
                )}
                {onOpenSellerPortal && (
                  <button
                    onClick={onOpenSellerPortal}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Seller Hub
                  </button>
                )}
                {onOpenAdminPortal && (
                  <button
                    onClick={onOpenAdminPortal}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Admin Console
                  </button>
                )}
                {onOpenB2BPortal && (
                  <button
                    onClick={onOpenB2BPortal}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    B2B Wholesale
                  </button>
                )}
                {onOpenManufacturerPortal && (
                  <button
                    onClick={onOpenManufacturerPortal}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Brand Hub
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 1. Marketplace */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#FFBA00]" />
              <span>Marketplace</span>
            </h4>
            <ul className="space-y-2 text-[11px] text-gray-400">
              <li>
                <button onClick={() => (onNavigateHome ? onNavigateHome() : onNavigateSection('hero'))} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button onClick={() => (onNavigateShop ? onNavigateShop('all') : onNavigateSection('products'))} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Shop</span>
                </button>
              </li>
              <li>
                <button onClick={() => (onNavigateShop ? onNavigateShop('all') : onNavigateSection('categories'))} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Categories</span>
                </button>
              </li>
              <li>
                <button onClick={() => (onNavigateShop ? onNavigateShop('all') : onNavigateSection('products'))} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Offers</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('why-choose-us')} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>About Us</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 2. Vehicle Parts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#FFBA00]" />
              <span>Vehicle Parts</span>
            </h4>
            <ul className="space-y-2 text-[11px] text-gray-400">
              <li>
                <button onClick={() => (onNavigateShop ? onNavigateShop('brake-parts') : onNavigateSection('categories'))} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Brake Parts</span>
                </button>
              </li>
              <li>
                <button onClick={() => (onNavigateShop ? onNavigateShop('clutch-parts') : onNavigateSection('categories'))} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Clutch Parts</span>
                </button>
              </li>
              <li>
                <button onClick={() => (onNavigateShop ? onNavigateShop('suspension') : onNavigateSection('categories'))} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Suspension Parts</span>
                </button>
              </li>
              <li>
                <button onClick={() => (onNavigateShop ? onNavigateShop('gearbox-transmission') : onNavigateSection('categories'))} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Gearbox & Transmission</span>
                </button>
              </li>
              <li>
                <button onClick={() => (onNavigateShop ? onNavigateShop('differential-axle') : onNavigateSection('categories'))} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Differential & Axle</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 3. For Sellers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#FFBA00]" />
              <span>For Sellers</span>
            </h4>
            <ul className="space-y-2 text-[11px] text-gray-400">
              <li>
                <button
                  onClick={onOpenSellerRegister || onOpenSellerModal}
                  className="hover:text-[#FFBA00] text-gray-300 hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Create / Register Seller ID</span>
                </button>
              </li>
              {onOpenSellerPortal && (
                <li>
                  <button
                    onClick={onOpenSellerPortal}
                    className="hover:text-white text-gray-400 hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                    <span>Seller Panel Hub</span>
                  </button>
                </li>
              )}
              {onOpenB2BPortal && (
                <li>
                  <button
                    onClick={onOpenB2BPortal}
                    className="hover:text-white text-gray-400 hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                    <span>B2B Workshop & Fleet Hub</span>
                  </button>
                </li>
              )}
              {onOpenAdminPortal && (
                <li>
                  <button
                    onClick={onOpenAdminPortal}
                    className="hover:text-white text-gray-400 hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                    <span>Marketplace Admin Console</span>
                  </button>
                </li>
              )}
              {onOpenManufacturerPortal && (
                <li>
                  <button
                    onClick={onOpenManufacturerPortal}
                    className="hover:text-white text-gray-400 hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                    <span>Manufacturer / Brand Hub</span>
                  </button>
                </li>
              )}
              <li>
                <button onClick={onOpenSellerModal} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Seller Login</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenSellerModal} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Seller Help</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenSellerModal} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Commission & Fees</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 4. Customer Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-[#FFBA00]" />
              <span>Customer Support</span>
            </h4>
            <ul className="space-y-2 text-[11px] text-gray-400">
              <li>
                <button onClick={() => {}} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Contact Us</span>
                </button>
              </li>
              <li>
                <button onClick={() => {}} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Track Order</span>
                </button>
              </li>
              <li>
                <button onClick={() => {}} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Returns & Refunds</span>
                </button>
              </li>
              <li>
                <button onClick={() => {}} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Warranty Claim</span>
                </button>
              </li>
              <li>
                <button onClick={() => {}} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Support Ticket</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 5. Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#FFBA00]" />
              <span>Policies</span>
            </h4>
            <ul className="space-y-2 text-[11px] text-gray-400">
              <li>
                <button onClick={() => {}} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Terms & Conditions</span>
                </button>
              </li>
              <li>
                <button onClick={() => {}} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button onClick={() => {}} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Return Policy</span>
                </button>
              </li>
              <li>
                <button onClick={() => {}} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Warranty Policy</span>
                </button>
              </li>
              <li>
                <button onClick={() => {}} className="hover:text-white hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#FFBA00] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Shipping Policy</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© 2026 AutoPartsHub. All rights reserved.</span>
            <span className="text-gray-600 hidden sm:inline">•</span>
            {onOpenSellerRegister && (
              <button
                onClick={onOpenSellerRegister}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Create Seller ID
              </button>
            )}
            {onOpenSellerPortal && (
              <button
                onClick={onOpenSellerPortal}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Seller Hub
              </button>
            )}
            {onOpenB2BPortal && (
              <button
                onClick={onOpenB2BPortal}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                B2B Wholesale
              </button>
            )}
            {onOpenAdminPortal && (
              <button
                onClick={onOpenAdminPortal}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Admin Console
              </button>
            )}
            {onOpenManufacturerPortal && (
              <button
                onClick={onOpenManufacturerPortal}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Manufacturer Portal
              </button>
            )}
          </div>

          {/* Authentic Payment vector SVGs & Security badge */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 sm:gap-3">
            <span className="text-gray-400 text-[11px] font-medium mr-0.5">We Accept:</span>

            {/* VISA */}
            <div
              className="h-6 sm:h-7 px-2.5 bg-white rounded flex items-center justify-center shadow-xs border border-gray-200/20 hover:scale-105 transition-transform"
              title="VISA"
            >
              <svg className="h-3 sm:h-3.5 w-auto" viewBox="0 0 64 20" fill="none">
                <path
                  d="M25.6 19.3L28.9 1.1H34L30.7 19.3H25.6ZM48.6 1.7C47.4 1.2 45.6 0.8 43.4 0.8C37.8 0.8 33.9 3.6 33.9 7.6C33.8 10.6 36.6 12.2 38.7 13.2C40.9 14.2 41.7 14.8 41.7 15.8C41.7 17.3 39.9 17.9 38.2 17.9C36.1 17.9 34.9 17.6 33.4 16.9L32.7 16.6L32 20.7C33.2 21.2 35.5 21.6 37.9 21.6C43.9 21.6 47.8 18.8 47.9 14.6C47.9 12.3 46.4 10.5 43.3 9.1C41.5 8.2 40.4 7.6 40.4 6.7C40.4 5.8 41.5 4.9 43.8 4.9C45.6 4.9 47 5.3 48 5.7L48.5 5.9L49.1 1.9L48.6 1.7ZM61.8 1.1H57.8C56.6 1.1 55.6 1.4 55.1 2.6L46.9 19.3H52.2L53.2 16.4H59.7L60.3 19.3H65L61.8 1.1ZM54.7 12.6L57.5 4.8L59.1 12.6H54.7ZM20.6 1.1L15.6 13.7L15 10.7C14 7.4 11 3.9 7.7 2.1L12.4 19.3H17.8L25.9 1.1H20.6Z"
                  fill="#1A1F71"
                />
                <path
                  d="M11.6 1.1H3.1L3 1.5C9.7 3.2 14.1 7.2 16 12.3L14.2 2.6C13.9 1.4 12.9 1.1 11.6 1.1Z"
                  fill="#F7B600"
                />
              </svg>
            </div>

            {/* Mastercard */}
            <div
              className="h-6 sm:h-7 px-2 sm:px-2.5 bg-white rounded flex items-center justify-center gap-1 shadow-xs border border-gray-200/20 hover:scale-105 transition-transform"
              title="Mastercard"
            >
              <svg className="h-3.5 sm:h-4 w-auto" viewBox="0 0 38 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#EB001B" />
                <circle cx="26" cy="12" r="10" fill="#F79E1B" />
                <path
                  d="M19 4.8A10 10 0 0 0 14.9 12 10 10 0 0 0 19 19.2 10 10 0 0 0 23.1 12 10 10 0 0 0 19 4.8Z"
                  fill="#FF5F00"
                />
              </svg>
              <span className="text-[8px] sm:text-[9px] font-bold text-gray-900 tracking-tight">Mastercard</span>
            </div>

            {/* RuPay */}
            <div
              className="h-6 sm:h-7 px-2 sm:px-2.5 bg-white rounded flex items-center justify-center gap-1 shadow-xs border border-gray-200/20 hover:scale-105 transition-transform"
              title="RuPay"
            >
              <span className="text-[10px] sm:text-[11px] font-black italic text-[#092E69] tracking-tight">RuPay</span>
              <svg className="h-2.5 sm:h-3 w-auto" viewBox="0 0 24 16" fill="none">
                <path d="M0 0L8 8L0 16H6L14 8L6 0H0Z" fill="#00A651" />
                <path d="M9 0L17 8L9 16H15L23 8L15 0H9Z" fill="#F37021" />
              </svg>
            </div>

            {/* UPI */}
            <div
              className="h-6 sm:h-7 px-2 sm:px-2.5 bg-white rounded flex items-center justify-center gap-1 shadow-xs border border-gray-200/20 hover:scale-105 transition-transform"
              title="UPI"
            >
              <svg className="h-2.5 sm:h-3 w-auto" viewBox="0 0 24 16" fill="none">
                <path d="M0 0L7 8L0 16H5L12 8L5 0H0Z" fill="#008000" />
                <path d="M8 0L15 8L8 16H13L20 8L13 0H8Z" fill="#FF6600" />
              </svg>
              <span className="text-[9px] sm:text-[10px] font-black text-[#0B2046] tracking-wider">UPI</span>
            </div>

            {/* Secure Shipping Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-500/30 rounded text-emerald-300 ml-1 sm:ml-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-medium whitespace-nowrap">Secure Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

