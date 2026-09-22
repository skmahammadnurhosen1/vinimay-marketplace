import React, { useState, useEffect } from 'react';
import {
  ManufacturerPortalTab,
  ManufacturerProduct,
  ManufacturerOrder,
  ManufacturerDealer,
  CustomerDemandAnalytics,
  ManufacturerReturnRecord,
  ManufacturerWarrantyClaim,
  ManufacturerInventoryItem,
  RevenueAnalytics,
  ManufacturerBrandProfile,
  ManufacturerNotification,
  ManufacturerKPISummary,
  ManufacturerWarrantyOutcome,
} from './types/manufacturer';
import { manufacturerService } from './services/manufacturerService';
import { ManufacturerLogin } from './components/manufacturer-dashboard/ManufacturerLogin';
import { ManufacturerSidebar } from './components/manufacturer-dashboard/ManufacturerSidebar';
import { ManufacturerHeader } from './components/manufacturer-dashboard/ManufacturerHeader';
import { ManufacturerOverviewPage } from './components/manufacturer-dashboard/ManufacturerOverviewPage';
import { ManufacturerProductsPage } from './components/manufacturer-dashboard/ManufacturerProductsPage';
import { ManufacturerOrdersPage } from './components/manufacturer-dashboard/ManufacturerOrdersPage';
import { ManufacturerDealersPage } from './components/manufacturer-dashboard/ManufacturerDealersPage';
import { ManufacturerDemandPage } from './components/manufacturer-dashboard/ManufacturerDemandPage';
import { ManufacturerReturnsWarrantyPage } from './components/manufacturer-dashboard/ManufacturerReturnsWarrantyPage';
import { ManufacturerInventoryPage } from './components/manufacturer-dashboard/ManufacturerInventoryPage';
import { ManufacturerRevenuePage } from './components/manufacturer-dashboard/ManufacturerRevenuePage';
import { ManufacturerProfilePage } from './components/manufacturer-dashboard/ManufacturerProfilePage';
import { ManufacturerNotificationsPage } from './components/manufacturer-dashboard/ManufacturerNotificationsPage';
import { ManufacturerAddProductModal } from './components/manufacturer-dashboard/ManufacturerAddProductModal';
import { ManufacturerProductDetailsModal } from './components/manufacturer-dashboard/ManufacturerProductDetailsModal';
import { ManufacturerOrderDetailsModal } from './components/manufacturer-dashboard/ManufacturerOrderDetailsModal';
import { ManufacturerWarrantyReviewModal } from './components/manufacturer-dashboard/ManufacturerWarrantyReviewModal';
import { ManufacturerStockAdjustmentModal } from './components/manufacturer-dashboard/ManufacturerStockAdjustmentModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from './context/AuthContext';

interface ManufacturerAppProps {
  onSwitchPortal?: (portal: 'customer' | 'seller' | 'admin' | 'b2b' | 'manufacturer') => void;
}

export const ManufacturerApp: React.FC<ManufacturerAppProps> = ({ onSwitchPortal }) => {
  const { logout } = useAuth();
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Tab & Navigation state
  const [activeTab, setActiveTab] = useState<ManufacturerPortalTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data from service
  const [brand, setBrand] = useState<ManufacturerBrandProfile>(manufacturerService.getActiveBrand());
  const [kpis, setKpis] = useState<ManufacturerKPISummary>(manufacturerService.getKPIs());
  const [products, setProducts] = useState<ManufacturerProduct[]>(manufacturerService.getProducts());
  const [orders, setOrders] = useState<ManufacturerOrder[]>(manufacturerService.getOrders());
  const [dealers, setDealers] = useState<ManufacturerDealer[]>(manufacturerService.getDealers());
  const [demand, setDemand] = useState<CustomerDemandAnalytics>(manufacturerService.getDemandAnalytics());
  const [returns, setReturns] = useState<ManufacturerReturnRecord[]>(manufacturerService.getReturns());
  const [warrantyClaims, setWarrantyClaims] = useState<ManufacturerWarrantyClaim[]>(manufacturerService.getWarrantyClaims());
  const [inventory, setInventory] = useState<ManufacturerInventoryItem[]>(manufacturerService.getInventoryItems());
  const [revenue, setRevenue] = useState<RevenueAnalytics>(manufacturerService.getRevenueAnalytics('30d'));
  const [notifications, setNotifications] = useState<ManufacturerNotification[]>(manufacturerService.getNotifications());

  // Modal States
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ManufacturerProduct | null>(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState<ManufacturerProduct | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<ManufacturerOrder | null>(null);
  const [selectedWarrantyClaim, setSelectedWarrantyClaim] = useState<ManufacturerWarrantyClaim | null>(null);
  const [selectedStockAdjustItem, setSelectedStockAdjustItem] = useState<any>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Subscribe to service state changes
  useEffect(() => {
    const syncState = () => {
      setBrand(manufacturerService.getActiveBrand());
      setKpis(manufacturerService.getKPIs());
      setProducts(manufacturerService.getProducts());
      setOrders(manufacturerService.getOrders());
      setDealers(manufacturerService.getDealers());
      setDemand(manufacturerService.getDemandAnalytics());
      setReturns(manufacturerService.getReturns());
      setWarrantyClaims(manufacturerService.getWarrantyClaims());
      setInventory(manufacturerService.getInventoryItems());
      setRevenue(manufacturerService.getRevenueAnalytics('30d'));
      setNotifications(manufacturerService.getNotifications());
    };

    syncState();
    const unsub = manufacturerService.subscribe(syncState);
    return unsub;
  }, []);

  const handleSwitchBrand = (brandId: string) => {
    manufacturerService.setActiveBrand(brandId);
    showToast(`Switched active OEM Brand to ${manufacturerService.getActiveBrand().brandName}`);
  };

  const handleSelectTab = (tab: ManufacturerPortalTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAddProduct = () => {
    setProductToEdit(null);
    setIsAddProductModalOpen(true);
  };

  const handleEditProduct = (prod: ManufacturerProduct) => {
    setProductToEdit(prod);
    setIsAddProductModalOpen(true);
  };

  const handleSaveProduct = (payload: any) => {
    if (productToEdit) {
      manufacturerService.updateProduct(productToEdit.id, payload);
      showToast(`Updated part ${payload.partNumber} successfully.`);
    } else {
      manufacturerService.addProduct(payload);
      showToast(`Added part ${payload.partNumber} to ${brand.shortName} catalogue.`);
    }
    setIsAddProductModalOpen(false);
    setProductToEdit(null);
  };

  const handleToggleProductStatus = (id: string) => {
    manufacturerService.toggleProductStatus(id);
    showToast('Product status updated.');
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to remove this SKU from the active manufacturer catalogue?')) {
      manufacturerService.deleteProduct(id);
      showToast('Part listing removed from catalogue.');
    }
  };

  const handleUpdateReturnStatus = (id: string, status: ManufacturerReturnRecord['status']) => {
    manufacturerService.updateReturnStatus(id, status);
    showToast(`Return ${id} status updated to ${status}.`);
  };

  const handleUpdateWarrantyOutcome = (
    id: string,
    outcome: ManufacturerWarrantyOutcome,
    notes?: string,
    finding?: string
  ) => {
    manufacturerService.updateWarrantyOutcome(id, outcome, notes, finding);
    showToast(`Warranty claim ${id} outcome set to: ${outcome}`);
  };

  const handleAdjustStock = (
    productId: string,
    delta: number,
    type: 'Inward Production' | 'Stock Adjustment',
    notes: string,
    refDoc?: string
  ) => {
    manufacturerService.adjustStock(productId, delta, type, notes, refDoc);
    showToast(`Stock updated by ${delta > 0 ? `+${delta}` : delta} units.`);
  };

  const handleBackToStorefront = () => {
    if (onSwitchPortal) {
      onSwitchPortal('customer');
    }
  };

  // If logged out, show dedicated gateway
  if (!isAuthenticated) {
    return (
      <ManufacturerLogin
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          showToast(`Welcome back to ${manufacturerService.getActiveBrand().shortName} Console!`);
        }}
        onBackToStorefront={handleBackToStorefront}
        onSwitchPortal={onSwitchPortal}
      />
    );
  }

  const unreadNotifsCount = manufacturerService.getUnreadNotificationCount();

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-gray-900 flex font-sans overflow-x-hidden w-full relative selection:bg-[#0284C7] selection:text-white">
      {/* 1. Sidebar (Non-overlapping Flex Container) */}
      <ManufacturerSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        brand={brand}
        unreadNotifsCount={unreadNotifsCount}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onSwitchPortal={onSwitchPortal}
        onLogout={async () => {
          await logout();
          setIsAuthenticated(false);
          showToast('Signed out of manufacturer session.');
        }}
      />

      {/* 2. Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <ManufacturerHeader
          brand={brand}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenAddProduct={handleOpenAddProduct}
          onNavigateTab={handleSelectTab}
          unreadNotifsCount={unreadNotifsCount}
          onSwitchBrand={handleSwitchBrand}
          onSearchSubmit={(q) => {
            if (q.trim()) {
              setActiveTab('products');
            }
          }}
        />

        {/* Subdomain & OEM Active Status Strip */}
        <div className="bg-[#121418] border-b border-gray-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span className="font-semibold text-white">OEM Brand Terminal:</span>
            <span className="font-mono text-[#38BDF8]">{brand.brandName}</span>
            <span className="hidden sm:inline text-gray-400 font-mono">| GSTIN: {brand.gstin}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Certified Tier-1 OEM</span>
            </span>
            <button
              onClick={handleBackToStorefront}
              className="text-[#FFBA00] hover:underline font-bold cursor-pointer"
            >
              &larr; Return to Storefront
            </button>
          </div>
        </div>

        {/* Workspace Canvas */}
        <main className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <ManufacturerOverviewPage
              kpis={kpis}
              brand={brand}
              demand={demand}
              revenue={revenue}
              onNavigateTab={handleSelectTab}
              onOpenAddProduct={handleOpenAddProduct}
            />
          )}

          {activeTab === 'products' && (
            <ManufacturerProductsPage
              products={products}
              onOpenAddProduct={handleOpenAddProduct}
              onViewProduct={(p) => setSelectedProductDetails(p)}
              onEditProduct={handleEditProduct}
              onToggleStatus={handleToggleProductStatus}
              onDeleteProduct={handleDeleteProduct}
              onOpenStockAdjust={(p) => setSelectedStockAdjustItem(p)}
            />
          )}

          {activeTab === 'orders' && (
            <ManufacturerOrdersPage
              orders={orders}
              onViewOrderDetails={(o) => setSelectedOrderDetails(o)}
            />
          )}

          {activeTab === 'dealers' && (
            <ManufacturerDealersPage
              dealers={dealers}
            />
          )}

          {activeTab === 'demand' && (
            <ManufacturerDemandPage
              demand={demand}
              onNavigateTab={handleSelectTab}
              onOpenAddProduct={handleOpenAddProduct}
            />
          )}

          {activeTab === 'returns-warranty' && (
            <ManufacturerReturnsWarrantyPage
              returns={returns}
              warrantyClaims={warrantyClaims}
              onInspectWarrantyClaim={(c) => setSelectedWarrantyClaim(c)}
              onUpdateReturnStatus={handleUpdateReturnStatus}
            />
          )}

          {activeTab === 'inventory' && (
            <ManufacturerInventoryPage
              inventory={inventory}
              onOpenStockAdjust={(i) => setSelectedStockAdjustItem(i)}
            />
          )}

          {activeTab === 'revenue' && (
            <ManufacturerRevenuePage
              initialRevenue={revenue}
            />
          )}

          {activeTab === 'profile' && (
            <ManufacturerProfilePage
              brand={brand}
              onUpdateProfile={(updates) => manufacturerService.updateProfile(updates)}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'notifications' && (
            <ManufacturerNotificationsPage
              notifications={notifications}
              onMarkAsRead={(id) => manufacturerService.markNotificationAsRead(id)}
              onMarkAllAsRead={() => {
                manufacturerService.markAllNotificationsAsRead();
                showToast('All notifications marked as read.');
              }}
              onNavigateTab={handleSelectTab}
            />
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <ManufacturerAddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => {
          setIsAddProductModalOpen(false);
          setProductToEdit(null);
        }}
        brand={brand}
        productToEdit={productToEdit}
        onSaveProduct={handleSaveProduct}
      />

      <ManufacturerProductDetailsModal
        product={selectedProductDetails}
        onClose={() => setSelectedProductDetails(null)}
        onEdit={(p) => {
          setSelectedProductDetails(null);
          handleEditProduct(p);
        }}
      />

      <ManufacturerOrderDetailsModal
        order={selectedOrderDetails}
        onClose={() => setSelectedOrderDetails(null)}
      />

      <ManufacturerWarrantyReviewModal
        claim={selectedWarrantyClaim}
        onClose={() => setSelectedWarrantyClaim(null)}
        onUpdateOutcome={handleUpdateWarrantyOutcome}
      />

      <ManufacturerStockAdjustmentModal
        item={selectedStockAdjustItem}
        onClose={() => setSelectedStockAdjustItem(null)}
        onAdjustStock={handleAdjustStock}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl bg-[#111D38] border border-sky-500/40 text-white text-xs font-semibold shadow-2xl shadow-black flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
