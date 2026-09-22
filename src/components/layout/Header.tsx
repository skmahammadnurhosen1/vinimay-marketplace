import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  Cog,
  Store,
  ShieldCheck,
  Wrench
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenSellerModal: () => void;
  onOpenAccountModal: () => void;
  onOpenAuthModal?: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigateSection: (sectionId: string) => void;
  onNavigateShop?: (category?: string, query?: string) => void;
  onNavigateHome?: () => void;
  onNavigateCart?: () => void;
  onNavigateAccount?: (tab?: any, orderId?: string) => void;
  onOpenSellerPortal?: () => void;
  onOpenAdminPortal?: () => void;
  onOpenB2BPortal?: () => void;
  onOpenManufacturerPortal?: () => void;
  onOpenSellerRegister?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSellerModal,
  onOpenAccountModal,
  onOpenAuthModal,
  onSelectProduct,
  onNavigateSection,
  onNavigateShop,
  onNavigateHome,
  onNavigateCart,
  onNavigateAccount,
  onOpenSellerPortal,
  onOpenAdminPortal,
  onOpenB2BPortal,
  onOpenManufacturerPortal,
  onOpenSellerRegister
}) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { currentUser, profile, isAuthenticated, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim().length > 1) {
        const results = await productService.searchProducts(searchQuery);
        setSearchResults(results);
        setIsSearchOpen(true);
      } else {
        setSearchResults([]);
        setIsSearchOpen(false);
      }
    };
    handleSearch();
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full max-w-full overflow-x-hidden shadow-md">
      {/* Top Electric Blue Bar */}
      <div className="bg-[#0B56D0] text-white w-full max-w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            {/* Logo: Gear icon in yellow box + AutoPartsHub */}
            <button
              onClick={() => (onNavigateHome ? onNavigateHome() : onNavigateSection('hero'))}
              className="flex items-center gap-2 sm:gap-2.5 text-left shrink-0 cursor-pointer focus:outline-none group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#FFBA00] flex items-center justify-center text-[#0B56D0] shadow-sm shrink-0">
                <Cog className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white leading-none">
                  AutoParts<span className="text-[#FFBA00]">Hub</span>
                </span>
                <span className="text-[9px] sm:text-[10px] text-blue-100 font-medium tracking-wide mt-0.5">
                  Genuine Parts. Better Journeys
                </span>
              </div>
            </button>

            {/* Center: Search Bar with Yellow Button */}
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl mx-4 relative">
              <div className="flex w-full items-center bg-white rounded-md overflow-hidden shadow-inner">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length > 1 && setIsSearchOpen(true)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setIsSearchOpen(false);
                      if (onNavigateShop) {
                        onNavigateShop(undefined, searchQuery);
                      }
                    }
                  }}
                  placeholder="Search by Part Name, Part Number, Brand or Vehicle"
                  className="flex-1 px-4 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    if (onNavigateShop) {
                      onNavigateShop(undefined, searchQuery);
                    }
                  }}
                  className="bg-[#FFBA00] hover:bg-[#EAA500] text-gray-900 px-4 py-2.5 transition-colors cursor-pointer flex items-center justify-center"
                >
                  <Search className="w-4 h-4 text-gray-900 stroke-[2.5]" />
                </button>
              </div>

              {/* Autocomplete Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                  {searchResults.length > 0 ? (
                    <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                      {searchResults.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            onSelectProduct(p);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full p-2.5 text-left hover:bg-blue-50/50 flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-10 h-10 object-contain rounded bg-gray-50 p-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-gray-900 truncate">
                              {p.brand} {p.title}
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono">
                              Part: {p.partNumber} • ₹{p.price.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <span className="text-xs text-[#0B56D0] font-bold">View →</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-gray-500">
                      No matching parts found.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Header Navigation */}
            <div className="flex items-center space-x-3 sm:space-x-6 text-xs font-semibold shrink-0">
              <button
                onClick={() => (onNavigateAccount ? onNavigateAccount('orders') : onOpenAccountModal())}
                className="text-white hover:text-[#FFBA00] transition-colors cursor-pointer"
              >
                My Orders
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => (onNavigateAccount ? onNavigateAccount('profile') : onOpenAccountModal())}
                    className="text-white hover:text-[#FFBA00] transition-colors cursor-pointer flex items-center gap-1.5 bg-blue-700/60 hover:bg-blue-700 px-2.5 py-1 rounded-lg border border-blue-500/40"
                  >
                    <span className="max-w-[110px] truncate">{profile?.displayName || currentUser?.email?.split('@')[0] || 'Account'}</span>
                    <span className="text-[10px] uppercase font-bold bg-[#FFBA00] text-gray-950 px-1 rounded">{profile?.role || 'USER'}</span>
                  </button>
                  <button
                    onClick={() => logout()}
                    className="text-blue-200 hover:text-white transition-colors cursor-pointer text-[11px]"
                    title="Sign Out"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => (onOpenAuthModal ? onOpenAuthModal() : onOpenAccountModal())}
                  className="bg-[#FFBA00] hover:bg-[#EAA500] text-gray-950 font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              )}

              {/* Cart button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-1.5 text-white hover:text-[#FFBA00] cursor-pointer px-1 py-1"
                aria-label="Cart"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-2 -right-2 bg-[#FFBA00] text-gray-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                </div>
                <span className="hidden sm:inline">Cart</span>
              </button>

              {/* Mobile Hamburger Menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white p-1.5 hover:bg-blue-600/50 rounded-lg transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategory Darker Royal Blue Bar */}
      <div className="bg-[#0947AD] text-white text-xs font-medium border-t border-blue-700/50 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 overflow-x-auto scrollbar-none gap-6">
            {/* All Categories button */}
            <button
              onClick={() => (onNavigateShop ? onNavigateShop('all') : onNavigateSection('categories'))}
              className="flex items-center gap-2 font-bold hover:text-[#FFBA00] transition-colors shrink-0 cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              <span>All Categories</span>
            </button>

            {/* Center Category Links */}
            <div className="flex items-center space-x-6 shrink-0">
              <button
                onClick={() => onNavigateSection('vehicle-selector')}
                className="hover:text-[#FFBA00] transition-colors cursor-pointer"
              >
                Vehicle
              </button>
              <button
                onClick={() => (onNavigateShop ? onNavigateShop('brake-parts') : onNavigateSection('categories'))}
                className="hover:text-[#FFBA00] transition-colors cursor-pointer"
              >
                Brake
              </button>
              <button
                onClick={() => (onNavigateShop ? onNavigateShop('clutch-parts') : onNavigateSection('categories'))}
                className="hover:text-[#FFBA00] transition-colors cursor-pointer"
              >
                Clutch
              </button>
              <button
                onClick={() => (onNavigateShop ? onNavigateShop('suspension') : onNavigateSection('categories'))}
                className="hover:text-[#FFBA00] transition-colors cursor-pointer"
              >
                Suspension
              </button>
              <button
                onClick={() => (onNavigateShop ? onNavigateShop('gearbox-transmission') : onNavigateSection('categories'))}
                className="hover:text-[#FFBA00] transition-colors cursor-pointer"
              >
                Gearbox
              </button>
              <button
                onClick={() => (onNavigateShop ? onNavigateShop('differential-axle') : onNavigateSection('categories'))}
                className="hover:text-[#FFBA00] transition-colors cursor-pointer"
              >
                Differential
              </button>
              <button
                onClick={() => (onNavigateShop ? onNavigateShop('commercial') : onNavigateSection('brands'))}
                className="hover:text-[#FFBA00] transition-colors cursor-pointer"
              >
                Commercial Vehicle Parts
              </button>
              <button
                onClick={() => (onNavigateShop ? onNavigateShop('all') : onNavigateSection('products'))}
                className="hover:text-[#FFBA00] transition-colors cursor-pointer text-[#FFBA00] font-semibold"
              >
                Offers
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer if toggled */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white p-4 border-b border-gray-200 text-xs space-y-4 text-gray-800 shadow-xl max-h-[80vh] overflow-y-auto">
          {/* Mobile Search Input */}
          <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#0B56D0] focus-within:ring-1 focus-within:ring-[#0B56D0]">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  setMobileMenuOpen(false);
                  if (onNavigateShop) {
                    onNavigateShop(undefined, searchQuery.trim());
                  }
                }
              }}
              placeholder="Search parts, numbers, vehicles..."
              className="flex-1 px-3 py-2 text-xs bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (searchQuery.trim()) {
                  setMobileMenuOpen(false);
                  if (onNavigateShop) {
                    onNavigateShop(undefined, searchQuery.trim());
                  }
                }
              }}
              className="bg-[#FFBA00] hover:bg-[#EAA500] text-gray-900 px-3.5 py-2 font-bold transition-colors cursor-pointer"
              aria-label="Submit search"
            >
              <Search className="w-4 h-4 text-gray-900" />
            </button>
          </div>

          {/* Quick Customer Navigation */}
          <div className="grid grid-cols-2 gap-2">
            {isAuthenticated ? (
              <div className="col-span-2 flex items-center justify-between p-2.5 bg-blue-50 text-blue-900 rounded-lg">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-8 h-8 rounded-full bg-[#0284C7] text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    {(profile?.displayName || currentUser?.email || 'U')[0].toUpperCase()}
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-xs truncate">{profile?.displayName || currentUser?.email}</div>
                    <div className="text-[10px] text-gray-500 uppercase font-semibold">{profile?.role || 'CUSTOMER'}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-bold px-2 py-1 hover:bg-rose-50 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (onOpenAuthModal) onOpenAuthModal();
                  else onOpenAccountModal();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 bg-[#FFBA00] text-gray-950 rounded-lg text-center font-bold col-span-2 transition-colors cursor-pointer text-xs"
              >
                Sign In / Register Customer Account
              </button>
            )}

            <button
              onClick={() => {
                if (onNavigateAccount) onNavigateAccount('orders');
                else onOpenAccountModal();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg text-left font-bold col-span-2 transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>My Orders & Account Hub</span>
              <span className="text-blue-600 text-[11px]">Manage →</span>
            </button>
            <button
              onClick={() => {
                onNavigateSection('vehicle-selector');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-left font-semibold text-gray-800 transition-colors cursor-pointer"
            >
              🚗 Select Vehicle
            </button>
            <button
              onClick={() => {
                if (onNavigateShop) onNavigateShop('all');
                else onNavigateSection('categories');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-left font-semibold text-gray-800 transition-colors cursor-pointer"
            >
              📂 All Categories
            </button>
            <button
              onClick={() => {
                if (onNavigateShop) onNavigateShop('all');
                else onNavigateSection('products');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-left font-semibold col-span-2 text-center text-[#0B56D0] transition-colors cursor-pointer"
            >
              Browse All Popular Parts →
            </button>
          </div>

          {/* Business & Merchant Operations Section */}
          <div className="pt-2 border-t border-gray-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Platform & Merchant Portals
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenB2BPortal) onOpenB2BPortal();
                }}
                className="p-2 bg-stone-50 hover:bg-stone-100 rounded-lg text-left font-semibold text-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5 text-[#0B56D0]" />
                <span className="truncate">B2B Wholesale Hub</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenSellerPortal) onOpenSellerPortal();
                }}
                className="p-2 bg-stone-50 hover:bg-stone-100 rounded-lg text-left font-semibold text-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Store className="w-3.5 h-3.5 text-amber-600" />
                <span className="truncate">Seller Panel</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenManufacturerPortal) onOpenManufacturerPortal();
                }}
                className="p-2 bg-stone-50 hover:bg-stone-100 rounded-lg text-left font-semibold text-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Cog className="w-3.5 h-3.5 text-blue-600" />
                <span className="truncate">Brand Dashboard</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAdminPortal) onOpenAdminPortal();
                }}
                className="p-2 bg-stone-50 hover:bg-stone-100 rounded-lg text-left font-semibold text-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                <span className="truncate">Admin Console</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
