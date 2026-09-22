import React, { useState, useEffect } from 'react';
import { SellerSidebar } from './components/seller-panel/SellerSidebar';
import { SellerHeader } from './components/seller-panel/SellerHeader';
import { SellerDashboard } from './components/seller-panel/SellerDashboard';
import { SellerProductsPage } from './components/seller-panel/SellerProductsPage';
import { SellerAddProductPage } from './components/seller-panel/SellerAddProductPage';
import { SellerOrdersPage } from './components/seller-panel/SellerOrdersPage';
import { SellerOrderDetailsModal } from './components/seller-panel/SellerOrderDetailsModal';
import { SellerInventoryPage } from './components/seller-panel/SellerInventoryPage';
import { SellerReturnsPage } from './components/seller-panel/SellerReturnsPage';
import { SellerWarrantyPage } from './components/seller-panel/SellerWarrantyPage';
import { SellerSettlementPage } from './components/seller-panel/SellerSettlementPage';
import { SellerProfileKYCPage } from './components/seller-panel/SellerProfileKYCPage';
import { SellerSettingsPage } from './components/seller-panel/SellerSettingsPage';
import { SellerProductPreviewModal } from './components/seller-panel/SellerProductPreviewModal';
import { sellerService } from './services/sellerService';
import {
  SellerNavTab,
  SellerOrder,
  SellerProduct,
  SellerShipmentState,
  SellerReturnWorkflowStatus,
  SellerWarrantyClaimStatus,
  SellerWarrantyOutcome
} from './types/seller';
import { useToast } from './context/ToastContext';

import { ProtectedRoute } from './components/common/ProtectedRoute';
import { SellerLoginPage } from './components/seller-panel/SellerLoginPage';
import { useAuth } from './context/AuthContext';

interface SellerAppProps {
  onSwitchToStorefront: () => void;
  initialTab?: SellerNavTab;
  onRegisterClick?: () => void;
}

export const SellerApp: React.FC<SellerAppProps> = ({
  onSwitchToStorefront,
  initialTab = 'dashboard',
  onRegisterClick,
}) => {
  const { showToast } = useToast();
  const { profile: userProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<SellerNavTab>(initialTab);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Reactive state from sellerService
  const [profile, setProfile] = useState(() => sellerService.getProfile());
  const [metrics, setMetrics] = useState(() => sellerService.getKPIMetrics());
  const [orders, setOrders] = useState(() => sellerService.getOrders());
  const [products, setProducts] = useState(() => sellerService.getProducts());
  const [inventory, setInventory] = useState(() => sellerService.getInventory());
  const [returns, setReturns] = useState(() => sellerService.getReturns());
  const [warranties, setWarranties] = useState(() => sellerService.getWarranties());
  const [settlements, setSettlements] = useState(() => sellerService.getSettlements());
  const [notifications, setNotifications] = useState(() => sellerService.getNotifications());
  const salesChart = sellerService.getSalesChart();

  // Modals state
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<SellerOrder | null>(null);
  const [previewProduct, setPreviewProduct] = useState<SellerProduct | null>(null);

  // Synchronize metrics whenever orders/returns/products change
  const refreshState = () => {
    setMetrics(sellerService.getKPIMetrics());
    setOrders(sellerService.getOrders());
    setProducts(sellerService.getProducts());
    setInventory(sellerService.getInventory());
    setReturns(sellerService.getReturns());
    setWarranties(sellerService.getWarranties());
    setProfile(sellerService.getProfile());
    setNotifications(sellerService.getNotifications());
  };

  // HANDLERS
  const handleUpdateShipment = (
    orderId: string,
    newStatus: SellerShipmentState,
    courier?: string,
    trackingNum?: string
  ) => {
    sellerService.updateOrderShipment(orderId, newStatus, courier, trackingNum);
    refreshState();
    showToast(
      'Shipment State Updated',
      `Order ${orderId} marked as ${newStatus.toUpperCase()}.`,
      'success'
    );
  };

  const handleSaveProduct = (newProd: Omit<SellerProduct, 'id' | 'createdAt'>) => {
    sellerService.addProduct(newProd);
    refreshState();
    setActiveTab('products');
  };

  const handleToggleProductStatus = (id: string) => {
    sellerService.toggleProductStatus(id);
    refreshState();
    showToast('Catalog Updated', 'Listing visibility status changed.', 'info');
  };

  const handleAdjustStock = (productId: string, delta: number) => {
    sellerService.adjustStock(productId, delta);
    refreshState();
  };

  const handleUpdateReturnStatus = (
    returnId: string,
    status: SellerReturnWorkflowStatus,
    notes?: string
  ) => {
    sellerService.updateReturnStatus(returnId, status, notes);
    refreshState();
  };

  const handleUpdateWarranty = (
    claimId: string,
    status: SellerWarrantyClaimStatus,
    outcome?: SellerWarrantyOutcome,
    notes?: string
  ) => {
    sellerService.updateWarrantyStatus(claimId, status, outcome, notes);
    refreshState();
  };

  const handleUpdateProfile = (updates: any) => {
    sellerService.updateProfile(updates);
    refreshState();
  };

  const handleMarkNotificationRead = (id: string) => {
    sellerService.markNotificationRead(id);
    refreshState();
  };

  const handleMarkAllNotificationsRead = () => {
    sellerService.markAllNotificationsRead();
    refreshState();
    showToast('Notifications Cleared', 'All notifications marked as read.', 'info');
  };

  const isUnderReview = userProfile?.role === 'SELLER' && (profile.kycStatus === 'Submitted' || profile.kycStatus === 'Under Review');

  return (
    <ProtectedRoute
      allowedRoles={['SELLER', 'ADMIN']}
      fallbackLogin={
        <SellerLoginPage
          onLoginSuccess={refreshState}
          onBackToStorefront={onSwitchToStorefront}
          onRegisterClick={onRegisterClick}
        />
      }
    >
      <div className="min-h-screen bg-[#F4F7FB] text-stone-900 flex font-sans w-full max-w-full overflow-x-hidden relative">
        {/* 1. Sidebar Navigation (Desktop Persistent + Mobile Drawer) */}
        <SellerSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpenMobile={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          profile={profile}
          pendingOrdersCount={metrics.pendingOrders}
          returnsCount={returns.length}
          warrantyCount={warranties.length}
          lowStockCount={metrics.lowStockCount}
          onSwitchToStorefront={onSwitchToStorefront}
        />

        {/* 2. Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen w-full max-w-full overflow-x-hidden">
          {/* Top Header */}
          <SellerHeader
            onOpenMobileNav={() => setIsMobileNavOpen(true)}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            profile={profile}
            notifications={notifications}
            onMarkNotificationRead={handleMarkNotificationRead}
            onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
            onSwitchToStorefront={onSwitchToStorefront}
          />

          {/* Under Review Notice Banner if applicable */}
          {isUnderReview && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-3 text-xs sm:text-sm text-amber-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-semibold">Merchant Account Verification in Progress:</span>
                <span className="text-amber-800">Your documents are under platform review. Active dispatch operations will be enabled upon admin approval.</span>
              </div>
              <button
                onClick={() => setActiveTab('profile_kyc')}
                className="text-xs font-bold text-amber-900 underline hover:text-amber-950 shrink-0"
              >
                View KYC
              </button>
            </div>
          )}

          {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <SellerDashboard
              metrics={metrics}
              recentOrders={orders}
              pendingReturns={returns}
              pendingWarranties={warranties}
              salesChart={salesChart}
              onSelectTab={setActiveTab}
              onSelectOrder={order => setSelectedOrderForModal(order)}
            />
          )}

          {activeTab === 'orders' && (
            <SellerOrdersPage
              orders={orders}
              onUpdateShipment={handleUpdateShipment}
            />
          )}

          {activeTab === 'products' && (
            <SellerProductsPage
              products={products}
              onSelectTab={setActiveTab}
              onToggleStatus={handleToggleProductStatus}
              onPreviewProduct={p => setPreviewProduct(p)}
              onEditProduct={p => {
                showToast('Editing Part', `Loaded ${p.title} for modification.`, 'info');
                setActiveTab('add_product');
              }}
            />
          )}

          {activeTab === 'add_product' && (
            <SellerAddProductPage
              onSelectTab={setActiveTab}
              onSaveProduct={handleSaveProduct}
              onPreviewProduct={p => setPreviewProduct(p)}
            />
          )}

          {activeTab === 'inventory' && (
            <SellerInventoryPage
              inventory={inventory}
              onAdjustStock={handleAdjustStock}
            />
          )}

          {activeTab === 'returns' && (
            <SellerReturnsPage
              returns={returns}
              onUpdateReturnStatus={handleUpdateReturnStatus}
            />
          )}

          {activeTab === 'warranty' && (
            <SellerWarrantyPage
              claims={warranties}
              onUpdateWarranty={handleUpdateWarranty}
            />
          )}

          {activeTab === 'sales_settlement' && (
            <SellerSettlementPage settlements={settlements} />
          )}

          {activeTab === 'profile_kyc' && (
            <SellerProfileKYCPage
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeTab === 'settings' && <SellerSettingsPage />}
        </main>
      </div>

      {/* Global Modals for Seller Operations */}
      <SellerOrderDetailsModal
        order={selectedOrderForModal}
        isOpen={!!selectedOrderForModal}
        onClose={() => setSelectedOrderForModal(null)}
        onUpdateStatus={(id, status, courier, tracking) => {
          handleUpdateShipment(id, status, courier, tracking);
          setSelectedOrderForModal(null);
        }}
      />

      <SellerProductPreviewModal
        product={previewProduct}
        isOpen={!!previewProduct}
        onClose={() => setPreviewProduct(null)}
      />
      </div>
    </ProtectedRoute>
  );
};
