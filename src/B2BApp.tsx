import React, { useState, useEffect } from 'react';
import {
  B2BPortalTab,
  B2BAccountType,
  B2BOrder,
  B2BGSTInvoice,
  B2BCartItem,
  B2BGarageProfile,
  B2BFleetProfile,
} from './types/b2b';
import { b2bService } from './services/b2bService';
import { B2BSidebar } from './components/b2b/B2BSidebar';
import { B2BHeader } from './components/b2b/B2BHeader';
import { B2BDashboard } from './components/b2b/B2BDashboard';
import { B2BProductsPage } from './components/b2b/B2BProductsPage';
import { B2BBulkOrderPage } from './components/b2b/B2BBulkOrderPage';
import { B2BCartPage } from './components/b2b/B2BCartPage';
import { B2BCheckoutPage } from './components/b2b/B2BCheckoutPage';
import { B2BPurchaseHistoryPage } from './components/b2b/B2BPurchaseHistoryPage';
import { B2BInvoicesPage } from './components/b2b/B2BInvoicesPage';
import { B2BProfilePage } from './components/b2b/B2BProfilePage';
import { B2BCreditPage } from './components/b2b/B2BCreditPage';
import { B2BSupportPage } from './components/b2b/B2BSupportPage';
import { B2BLandingModal } from './components/b2b/B2BLandingModal';
import { B2BOrderDetailsModal } from './components/b2b/B2BOrderDetailsModal';
import { B2BInvoiceModal } from './components/b2b/B2BInvoiceModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface B2BAppProps {
  onSwitchPortal?: (portal: 'customer' | 'seller' | 'admin' | 'b2b') => void;
}

export const B2BApp: React.FC<B2BAppProps> = ({ onSwitchPortal }) => {
  const [activeTab, setActiveTab] = useState<B2BPortalTab>('dashboard');
  const [activeAccountType, setActiveAccountType] = useState<B2BAccountType>(
    b2bService.getActiveAccountType()
  );
  const [profile, setProfile] = useState<B2BGarageProfile | B2BFleetProfile>(
    b2bService.getActiveProfile()
  );
  const [cartItems, setCartItems] = useState<B2BCartItem[]>(b2bService.getCartItems());
  const [orders, setOrders] = useState<B2BOrder[]>(b2bService.getOrders());
  const [invoices, setInvoices] = useState<B2BGSTInvoice[]>(b2bService.getInvoices());

  // Navigation & Modal UI states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLandingModal, setShowLandingModal] = useState(false);
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<B2BOrder | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<B2BGSTInvoice | null>(null);
  const [toastNotification, setToastNotification] = useState<{
    message: string;
    type?: 'success' | 'info';
  } | null>(null);
  const [catalogSearchTerm, setCatalogSearchTerm] = useState('');

  // Subscribe to service state changes
  useEffect(() => {
    const updateState = () => {
      setActiveAccountType(b2bService.getActiveAccountType());
      setProfile(b2bService.getActiveProfile());
      setCartItems(b2bService.getCartItems());
      setOrders(b2bService.getOrders());
      setInvoices(b2bService.getInvoices());
    };

    updateState();
    const unsub = b2bService.subscribe(updateState);
    return unsub;
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 3200);
  };

  const handleSwitchAccountType = (type: B2BAccountType) => {
    b2bService.setActiveAccountType(type);
    showToast(`Switched account mode to ${type === 'garage' ? 'Garage & Workshop' : 'Fleet Operations'}`);
  };

  const handleSelectTab = (tab: B2BPortalTab) => {
    setIsCheckoutMode(false);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (query: string) => {
    setCatalogSearchTerm(query);
    setActiveTab('products');
    setIsCheckoutMode(false);
  };

  const handleQuickReorder = (order: B2BOrder) => {
    b2bService.reorderItems(order);
    showToast(`Reordered ${order.totalUnits} items from ${order.orderId}! Added to B2B Cart.`);
    setActiveTab('cart');
    setIsCheckoutMode(false);
  };

  const handleOrderSuccess = (order: B2BOrder, invoice: B2BGSTInvoice) => {
    setIsCheckoutMode(false);
    setActiveTab('orders');
    setSelectedInvoice(invoice);
    showToast(`Purchase Order ${order.orderId} placed successfully! Tax invoice generated.`);
  };

  const businessName =
    profile.accountType === 'garage'
      ? (profile as B2BGarageProfile).businessName
      : (profile as B2BFleetProfile).companyName;

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-800 flex flex-col antialiased">
      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top duration-300 pointer-events-none">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 max-w-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{toastNotification.message}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <B2BHeader
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onNavigateTab={handleSelectTab}
        cartItemCount={totalCartCount}
        activeAccountType={activeAccountType}
        onSwitchAccountType={handleSwitchAccountType}
        onOpenOnboardingModal={() => setShowLandingModal(true)}
        onSwitchPortal={onSwitchPortal}
        businessName={businessName}
        creditAvailable={profile.creditAvailable}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Workspace Layout with Sticky Sidebar */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Desktop Sidebar & Mobile Drawer */}
        <B2BSidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          cartItemCount={totalCartCount}
          activeAccountType={activeAccountType}
          onSwitchAccountType={handleSwitchAccountType}
          onSwitchPortal={onSwitchPortal}
          businessName={businessName}
        />

        {/* Dynamic Center Workspaces */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-full overflow-x-hidden">
          {isCheckoutMode ? (
            <B2BCheckoutPage
              onOrderSuccess={handleOrderSuccess}
              onNavigateCart={() => setIsCheckoutMode(false)}
            />
          ) : activeTab === 'dashboard' ? (
            <B2BDashboard
              onNavigateTab={handleSelectTab}
              activeAccountType={activeAccountType}
              orders={orders}
              onQuickReorder={handleQuickReorder}
              onOpenOrderModal={setSelectedOrder}
            />
          ) : activeTab === 'products' ? (
            <B2BProductsPage
              onNavigateBulkOrder={() => handleSelectTab('bulk-order')}
              onNavigateCart={() => handleSelectTab('cart')}
              initialSearchQuery={catalogSearchTerm}
            />
          ) : activeTab === 'bulk-order' ? (
            <B2BBulkOrderPage onNavigateCart={() => handleSelectTab('cart')} />
          ) : activeTab === 'cart' ? (
            <B2BCartPage
              onNavigateCheckout={() => setIsCheckoutMode(true)}
              onNavigateProducts={() => handleSelectTab('products')}
            />
          ) : activeTab === 'orders' ? (
            <B2BPurchaseHistoryPage
              onViewOrder={setSelectedOrder}
              onViewInvoice={(invNumber) => {
                const inv = b2bService.getInvoiceByNumber(invNumber);
                if (inv) setSelectedInvoice(inv);
              }}
              onReorder={handleQuickReorder}
              onGoToProducts={() => handleSelectTab('products')}
            />
          ) : activeTab === 'invoices' ? (
            <B2BInvoicesPage invoices={invoices} />
          ) : activeTab === 'profile' || activeTab === 'settings' ? (
            <B2BProfilePage
              activeAccountType={activeAccountType}
              onSwitchAccountType={handleSwitchAccountType}
            />
          ) : activeTab === 'credit' ? (
            <B2BCreditPage onGoToProducts={() => handleSelectTab('products')} />
          ) : activeTab === 'support' ? (
            <B2BSupportPage />
          ) : (
            <B2BDashboard
              onNavigateTab={handleSelectTab}
              activeAccountType={activeAccountType}
              orders={orders}
              onQuickReorder={handleQuickReorder}
              onOpenOrderModal={setSelectedOrder}
            />
          )}
        </main>
      </div>

      {/* B2B Onboarding / Switch Modal */}
      <B2BLandingModal
        isOpen={showLandingModal}
        onClose={() => setShowLandingModal(false)}
        onSelectAccount={(type) => {
          handleSwitchAccountType(type);
          setShowLandingModal(false);
        }}
      />

      {/* Order Details Modal with Decomposed Consignments */}
      {selectedOrder && (
        <B2BOrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onReorder={handleQuickReorder}
          onViewInvoice={(inv) => setSelectedInvoice(inv)}
        />
      )}

      {/* GST Tax Invoice Modal */}
      {selectedInvoice && (
        <B2BInvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};
