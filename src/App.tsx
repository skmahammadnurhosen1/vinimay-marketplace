import React, { useState, useEffect } from 'react';
import { VehicleProvider } from './context/VehicleContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { CompareProvider } from './context/CompareContext';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { CinematicHero } from './components/hero/CinematicHero';
import { TrustStrip } from './components/trust/TrustStrip';
import { VehicleSelector } from './components/vehicle-selector/VehicleSelector';
import { ShopByCategory } from './components/categories/ShopByCategory';
import { ShopByVehicle } from './components/brands/ShopByVehicle';
import { FeaturedProducts } from './components/products/FeaturedProducts';
import { CompatibilityBanner } from './components/compatibility/CompatibilityBanner';
import { WhyChooseUs } from './components/trust/WhyChooseUs';
import { HowItWorks } from './components/trust/HowItWorks';
import { BecomeASellerSection } from './components/seller/BecomeASellerSection';
import { CartDrawer } from './components/drawers/CartDrawer';
import { WishlistDrawer } from './components/drawers/WishlistDrawer';
import { VehicleModal } from './components/drawers/VehicleModal';
import { AccountModal } from './components/drawers/AccountModal';
import { SellerModal } from './components/seller/SellerModal';
import { SellerRegistrationPage } from './components/seller/SellerRegistrationPage';
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailsPage } from './components/pdp/ProductDetailsPage';
import { CartPage } from './components/cart/CartPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderConfirmationPage } from './components/confirmation/OrderConfirmationPage';
import { AccountHub } from './components/account/AccountHub';
import { AccountTabType } from './components/account/AccountSidebar';
import { CompareTray } from './components/pdp/CompareTray';
import { CompareModal } from './components/pdp/CompareModal';
import { SellerApp } from './SellerApp';
import { AdminApp } from './AdminApp';
import { B2BApp } from './B2BApp';
import { ManufacturerApp } from './ManufacturerApp';
import { productService } from './services/productService';
import { orderService } from './services/orderService';
import { Product, ConfirmedOrder } from './types';
import { useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/account/AuthModal';

export type PortalMode = 'customer' | 'seller' | 'admin' | 'b2b' | 'manufacturer';

const getInitialPortal = (): PortalMode => {
  if (typeof window === 'undefined') return 'customer';
  const hostname = window.location.hostname;
  const search = window.location.search;
  if (hostname.startsWith('admin.') || search.includes('portal=admin')) {
    return 'admin';
  }
  if (hostname.startsWith('seller.') || search.includes('portal=seller')) {
    return 'seller';
  }
  if (hostname.startsWith('b2b.') || search.includes('portal=b2b')) {
    return 'b2b';
  }
  if (hostname.startsWith('manufacturer.') || search.includes('portal=manufacturer') || search.includes('portal=oem')) {
    return 'manufacturer';
  }
  return 'customer';
};

const MarketplaceContent: React.FC = () => {
  const { showToast } = useToast();
  const { confirmedOrder, setConfirmedOrder } = useCart();

  // Subdomain / Multi-Portal Mode State
  const [activePortal, setActivePortal] = useState<PortalMode>(getInitialPortal);

  const handleSwitchPortal = (portal: PortalMode) => {
    setActivePortal(portal);
    if (typeof window !== 'undefined' && window.history) {
      if (portal === 'customer') {
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        window.history.replaceState({}, '', `${window.location.pathname}?portal=${portal}`);
      }
    }
  };

  // Navigation View State
  const [currentView, setCurrentView] = useState<
    'home' | 'shop' | 'product-details' | 'cart' | 'checkout' | 'order-confirmation' | 'account' | 'seller-register'
  >('home');
  const [accountTab, setAccountTab] = useState<AccountTabType>('orders');
  const [accountOrderId, setAccountOrderId] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [shopCategory, setShopCategory] = useState<string>('all');
  const [shopSearchQuery, setShopSearchQuery] = useState<string>('');

  const [products, setProducts] = useState<Product[]>([]);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup' | 'forgot'>('signin');

  const handleOpenAuthModal = (tab: 'signin' | 'signup' | 'forgot' = 'signin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    const loadProducts = async () => {
      const data = await productService.getPopularProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

  const handleOpenProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSection = (sectionId: string) => {
    // If we're on the shop page and need to scroll to a homepage section, switch to home first
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateShop = (category: string = 'all', query: string = '') => {
    setShopCategory(category);
    setShopSearchQuery(query);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCart = () => {
    setCurrentView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCheckout = () => {
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateAccount = (tab: AccountTabType = 'orders', orderId?: string) => {
    setAccountTab(tab);
    setAccountOrderId(orderId);
    setCurrentView('account');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: ConfirmedOrder) => {
    setConfirmedOrder(order);
    orderService.addConfirmedOrder(order);
    setCurrentView('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBrand = (brandName: string) => {
    showToast('Brand Filter', `Showing parts for ${brandName}`, 'info');
    handleNavigateShop('all', brandName);
  };

  const handleSelectCategory = (categorySlug: string) => {
    showToast('Category Browsing', `Viewing ${categorySlug.replace('-', ' ')}`, 'info');
    handleNavigateShop(categorySlug);
  };

  const handleNavigateSellerRegister = () => {
    setCurrentView('seller-register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Subdomain / Standalone Admin Panel Rendering
  if (activePortal === 'admin') {
    return (
      <AdminApp
        onSwitchPortal={handleSwitchPortal}
      />
    );
  }

  // Subdomain / Standalone Seller Panel Rendering
  if (activePortal === 'seller') {
    return (
      <SellerApp
        onSwitchToStorefront={() => handleSwitchPortal('customer')}
        onRegisterClick={() => {
          handleSwitchPortal('customer');
          setCurrentView('seller-register');
        }}
      />
    );
  }

  // Subdomain / Standalone B2B Wholesale Portal Rendering
  if (activePortal === 'b2b') {
    return (
      <B2BApp
        onSwitchPortal={handleSwitchPortal}
      />
    );
  }

  // Subdomain / Standalone Manufacturer Portal Rendering
  if (activePortal === 'manufacturer') {
    return (
      <ManufacturerApp
        onSwitchPortal={handleSwitchPortal}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-gray-900 flex flex-col font-sans overflow-x-hidden w-full max-w-full relative">
      {/* 1. Header (Top Blue Bar + Subcategory Bar) */}
      <Header
        onOpenSellerModal={() => setIsSellerModalOpen(true)}
        onOpenAccountModal={() => handleNavigateAccount('profile')}
        onOpenAuthModal={handleOpenAuthModal}
        onSelectProduct={handleOpenProductDetails}
        onNavigateSection={handleScrollToSection}
        onNavigateShop={handleNavigateShop}
        onNavigateHome={handleNavigateHome}
        onNavigateCart={handleNavigateCart}
        onNavigateAccount={handleNavigateAccount}
        onOpenSellerPortal={() => handleSwitchPortal('seller')}
        onOpenAdminPortal={() => handleSwitchPortal('admin')}
        onOpenB2BPortal={() => handleSwitchPortal('b2b')}
        onOpenManufacturerPortal={() => handleSwitchPortal('manufacturer')}
        onOpenSellerRegister={handleNavigateSellerRegister}
      />

      <main className="flex-1 pb-20 lg:pb-12 w-full max-w-full overflow-x-hidden">
        {currentView === 'home' ? (
          <>
            {/* 2. Hero Section (Headline + Shop Now + Cars lineup) */}
            <div id="hero">
              <CinematicHero
                onShopPartsClick={() => handleNavigateShop('all')}
              />
            </div>

            {/* 3. Top Trust Strip (3-column floating card) */}
            <TrustStrip />

            {/* 4. SELECT YOUR VEHICLE Card (7 dropdowns + button) */}
            <VehicleSelector
              onVehicleApplied={() => handleNavigateShop('all')}
            />

            {/* 5. Shop by Category (5 cards) */}
            <ShopByCategory onSelectCategory={handleSelectCategory} />

            {/* 6. Shop by Vehicle (9 brand cards) */}
            <ShopByVehicle onSelectBrand={handleSelectBrand} />

            {/* 7. Popular Spare Parts (6 cards) */}
            <FeaturedProducts
              products={products}
              onViewProductDetails={handleOpenProductDetails}
              onViewAllClick={() => handleNavigateShop('all')}
            />

            {/* 8. Get the Right Part. Avoid Wrong Orders. Banner */}
            <CompatibilityBanner
              onSelectVehicle={() => handleScrollToSection('vehicle-selector')}
            />

            {/* 9. Second Trust Strip (4 features) */}
            <div id="why-choose-us">
              <WhyChooseUs />
            </div>

            {/* 10. How It Works (4 circular steps) */}
            <HowItWorks />

            {/* 11. Sell Your Spare Parts With Us Banner */}
            <BecomeASellerSection onOpenSellerModal={handleNavigateSellerRegister} />
          </>
        ) : currentView === 'shop' ? (
          /* Dedicated Shop & Search Results Page */
          <ShopPage
            initialCategory={shopCategory}
            initialQuery={shopSearchQuery}
            onNavigateHome={handleNavigateHome}
            onSelectProduct={handleOpenProductDetails}
          />
        ) : currentView === 'product-details' ? (
          /* Dedicated Product Details Page (No popup modal) */
          selectedProduct && (
            <ProductDetailsPage
              product={selectedProduct}
              onBackToShop={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToHome={handleNavigateHome}
              onSelectProduct={handleOpenProductDetails}
              onNavigateCheckout={handleNavigateCheckout}
            />
          )
        ) : currentView === 'cart' ? (
          /* Dedicated Multi-Vendor Cart Page */
          <CartPage
            onNavigateHome={handleNavigateHome}
            onNavigateShop={() => handleNavigateShop('all')}
            onNavigateCheckout={handleNavigateCheckout}
            onSelectProduct={handleOpenProductDetails}
          />
        ) : currentView === 'checkout' ? (
          /* Dedicated Multi-Step Checkout Page */
          <CheckoutPage
            onNavigateHome={handleNavigateHome}
            onNavigateShop={() => handleNavigateShop('all')}
            onNavigateCart={handleNavigateCart}
            onOrderSuccess={handleOrderSuccess}
          />
        ) : currentView === 'order-confirmation' ? (
          /* Dedicated Order Confirmation Page with Seller Packages */
          <OrderConfirmationPage
            order={confirmedOrder}
            onNavigateHome={handleNavigateHome}
            onNavigateShop={() => handleNavigateShop('all')}
            onNavigateAccount={handleNavigateAccount}
          />
        ) : currentView === 'seller-register' ? (
          /* Dedicated Seller ID Registration Page */
          <SellerRegistrationPage
            onBackToStorefront={handleNavigateHome}
            onOpenSellerPortal={() => handleSwitchPortal('seller')}
          />
        ) : (
          /* Dedicated Customer Account & Order Hub */
          <AccountHub
            initialTab={accountTab}
            initialOrderId={accountOrderId}
            onNavigateHome={handleNavigateHome}
            onNavigateShop={() => handleNavigateShop('all')}
            onSelectProduct={handleOpenProductDetails}
            onOpenAuthModal={handleOpenAuthModal}
          />
        )}
      </main>

      {/* 12. Footer (Midnight Blue 6-column footer) */}
      <Footer
        onOpenSellerModal={() => setIsSellerModalOpen(true)}
        onNavigateSection={handleScrollToSection}
        onNavigateShop={handleNavigateShop}
        onNavigateHome={handleNavigateHome}
        onOpenSellerPortal={() => handleSwitchPortal('seller')}
        onOpenAdminPortal={() => handleSwitchPortal('admin')}
        onOpenB2BPortal={() => handleSwitchPortal('b2b')}
        onOpenSellerRegister={handleNavigateSellerRegister}
        onOpenManufacturerPortal={() => handleSwitchPortal('manufacturer')}
      />

      {/* Mobile Nav Bar (Hidden on Product Details page to let MobilePurchaseBar take full priority) */}
      {currentView !== 'product-details' && (
        <MobileNav
          onNavigateSection={handleScrollToSection}
          onNavigateShop={() => handleNavigateShop('all')}
          onNavigateHome={handleNavigateHome}
          onNavigateCart={handleNavigateCart}
        />
      )}

      {/* Drawers & Modals */}
      <CartDrawer
        onNavigateCart={handleNavigateCart}
        onNavigateCheckout={handleNavigateCheckout}
        onSelectProduct={handleOpenProductDetails}
      />
      <WishlistDrawer onViewProduct={handleOpenProductDetails} />
      <VehicleModal />
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />
      <SellerModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
      />

      {/* Floating Compare Tray & Side-by-Side Comparison Modal */}
      <CompareTray />
      <CompareModal />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <VehicleProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <CompareProvider>
                <MarketplaceContent />
              </CompareProvider>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </VehicleProvider>
    </AuthProvider>
  );
}

export default App;
