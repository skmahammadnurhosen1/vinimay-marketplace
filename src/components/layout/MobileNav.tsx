import React from 'react';
import { Home, Grid, Car, Heart, ShoppingBag } from 'lucide-react';
import { useVehicle } from '../../context/VehicleContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface MobileNavProps {
  onNavigateSection: (sectionId: string) => void;
  onNavigateShop?: () => void;
  onNavigateHome?: () => void;
  onNavigateCart?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  onNavigateSection,
  onNavigateShop,
  onNavigateHome,
  onNavigateCart
}) => {
  const { selectedVehicle, setIsSelectorModalOpen } = useVehicle();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 py-1.5 px-3 shadow-lg select-none"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* Home */}
        <button
          onClick={() => (onNavigateHome ? onNavigateHome() : onNavigateSection('hero'))}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 text-gray-700 hover:text-[#0B56D0] transition-colors cursor-pointer"
        >
          <Home className="w-5 h-5 text-[#0B56D0]" />
          <span className="text-[10px] font-semibold text-gray-800">Home</span>
        </button>

        {/* Categories / Shop */}
        <button
          onClick={() => (onNavigateShop ? onNavigateShop() : onNavigateSection('categories'))}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 text-gray-600 hover:text-[#0B56D0] transition-colors cursor-pointer"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-medium text-gray-600">Shop</span>
        </button>

        {/* Vehicle (Center Action Hero) */}
        <button
          onClick={() => setIsSelectorModalOpen(true)}
          className="flex flex-col items-center justify-center -mt-5 min-w-[56px] cursor-pointer group"
          aria-label="Select Vehicle"
        >
          <div className="w-12 h-12 rounded-full bg-[#0B56D0] group-hover:bg-[#0947AD] text-white flex items-center justify-center shadow-lg shadow-blue-900/25 border-2 border-white transition-transform group-hover:scale-105">
            <Car className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-gray-900 mt-1 truncate max-w-[72px]">
            {selectedVehicle ? selectedVehicle.model : 'Vehicle'}
          </span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setIsWishlistOpen(true)}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 text-gray-600 hover:text-[#0B56D0] transition-colors relative cursor-pointer"
          aria-label={`Saved items: ${wishlistCount}`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-rose-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium text-gray-600">Saved</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => (onNavigateCart ? onNavigateCart() : setIsCartOpen(true))}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 text-gray-600 hover:text-[#0B56D0] transition-colors relative cursor-pointer"
          aria-label={`Cart: ${totalItems} items`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-[#FFBA00] text-gray-950 rounded-full text-[9px] font-extrabold flex items-center justify-center border border-amber-300">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium text-gray-600">Cart</span>
        </button>
      </div>
    </nav>
  );
};
