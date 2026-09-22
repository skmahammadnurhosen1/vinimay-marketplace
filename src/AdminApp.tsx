import React, { useState, useEffect } from 'react';
import { AdminPortalTab } from './types/admin';
import { adminService } from './services/adminService';
import { AdminSidebar } from './components/admin-panel/AdminSidebar';
import { AdminHeader } from './components/admin-panel/AdminHeader';
import { AdminDashboard } from './components/admin-panel/AdminDashboard';
import { AdminSellersPage } from './components/admin-panel/AdminSellersPage';
import { AdminProductsPage } from './components/admin-panel/AdminProductsPage';
import { AdminOrdersPage } from './components/admin-panel/AdminOrdersPage';
import { AdminReturnsPage } from './components/admin-panel/AdminReturnsPage';
import { AdminRefundsPage } from './components/admin-panel/AdminRefundsPage';
import { AdminWarrantyPage } from './components/admin-panel/AdminWarrantyPage';
import { AdminFinancePage } from './components/admin-panel/AdminFinancePage';
import { AdminCustomersPage } from './components/admin-panel/AdminCustomersPage';
import { AdminReviewsPage } from './components/admin-panel/AdminReviewsPage';
import { AdminSupportPage } from './components/admin-panel/AdminSupportPage';
import { AdminReportsPage } from './components/admin-panel/AdminReportsPage';
import { AdminSettingsSecurityPage } from './components/admin-panel/AdminSettingsSecurityPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminLoginPage } from './components/admin-panel/AdminLoginPage';

interface AdminAppProps {
  onSwitchPortal?: (portal: 'customer' | 'seller' | 'admin') => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({ onSwitchPortal }) => {
  const [activeTab, setActiveTab] = useState<AdminPortalTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setTick] = useState(0); // For reactive re-renders on adminService updates

  useEffect(() => {
    const unsubscribe = adminService.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  const metrics = adminService.getDashboardKPIs();
  const sellers = adminService.getSellers();
  const products = adminService.getProducts();
  const categories = adminService.getCategories();
  const orders = adminService.getMasterOrders();
  const returns = adminService.getReturns();
  const refunds = adminService.getRefunds();
  const warrantyClaims = adminService.getWarrantyClaims();
  const settlements = adminService.getSettlements();
  const gstRecords = adminService.getGSTRecords();
  const customers = adminService.getCustomers();
  const reviews = adminService.getReviews();
  const tickets = adminService.getTickets();
  const users = adminService.getUsers();
  const auditLogs = adminService.getAuditLogs();

  const totalPendingActionItems =
    metrics.actionRequired.pendingSellers +
    metrics.actionRequired.pendingProducts +
    metrics.actionRequired.pendingReturns +
    metrics.actionRequired.pendingWarranty +
    metrics.actionRequired.pendingRefunds +
    metrics.actionRequired.pendingSettlements;

  return (
    <ProtectedRoute
      allowedRoles={['ADMIN']}
      fallbackLogin={
        <AdminLoginPage
          onLoginSuccess={() => setTick((prev) => prev + 1)}
          onSwitchToStorefront={() => onSwitchPortal && onSwitchPortal('customer')}
        />
      }
    >
      <div className="min-h-screen bg-[#F4F7FB] text-gray-900 flex flex-col antialiased overflow-x-hidden font-sans">
      <div className="flex flex-1 min-h-screen">
        {/* Persistent Desktop Sidebar & Mobile Drawer */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onSwitchPortal={onSwitchPortal}
          actionCounts={metrics.actionRequired}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <AdminHeader
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSwitchPortal={onSwitchPortal}
            pendingTotal={totalPendingActionItems}
          />

          {/* Subdomain Indicator Banner */}
          <div className="bg-[#121418] border-b border-gray-800/80 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-white">Subdomain Isolation:</span>
              <span className="font-mono text-[#E5C158]">admin.autopartshub.com</span>
              <span className="hidden sm:inline text-gray-400">| Session Active: Super Admin</span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-gray-400">Environment: Staging/Production Frontend</span>
              <button
                onClick={() => onSwitchPortal && onSwitchPortal('customer')}
                className="text-[#E5C158] hover:underline font-bold cursor-pointer"
              >
                &larr; Return to Storefront
              </button>
            </div>
          </div>

          {/* View Container */}
          <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {activeTab === 'dashboard' && (
              <AdminDashboard
                metrics={metrics}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'sellers' && (
              <AdminSellersPage
                sellers={sellers}
                onUpdateStatus={(id, st) => adminService.updateSellerStatus(id, st)}
                onUpdateCommission={(id, rate) => adminService.updateSellerCommission(id, rate)}
                onUpdateDocumentStatus={(sId, dId, st, notes) =>
                  adminService.updateDocumentStatus(sId, dId, st, notes)
                }
              />
            )}

            {activeTab === 'products' && (
              <AdminProductsPage
                products={products}
                categories={categories}
                onUpdateProductStatus={(id, st) => adminService.updateProductStatus(id, st)}
                onAddCategory={(name, subs) => adminService.addCategory(name, subs)}
              />
            )}

            {activeTab === 'orders' && (
              <AdminOrdersPage orders={orders} />
            )}

            {activeTab === 'returns' && (
              <AdminReturnsPage
                returns={returns}
                onUpdateReturnStage={(id, stage, st, note) =>
                  adminService.updateReturnStage(id, stage, st, note)
                }
              />
            )}

            {activeTab === 'refunds' && (
              <AdminRefundsPage
                refunds={refunds}
                onUpdateRefundStatus={(id, st, utr) =>
                  adminService.updateRefundStatus(id, st, utr)
                }
              />
            )}

            {activeTab === 'warranty' && (
              <AdminWarrantyPage
                warrantyClaims={warrantyClaims}
                onUpdateWarrantyOutcome={(id, out, stg, notes) =>
                  adminService.updateWarrantyOutcome(id, out, stg, notes)
                }
              />
            )}

            {activeTab === 'finance' && (
              <AdminFinancePage
                settlements={settlements}
                gstRecords={gstRecords}
                onExecuteSettlement={(id) => adminService.executeSettlement(id)}
              />
            )}

            {activeTab === 'customers' && (
              <AdminCustomersPage
                customers={customers}
                onUpdateCustomerStatus={(id, st) =>
                  adminService.updateCustomerStatus(id, st)
                }
              />
            )}

            {activeTab === 'reviews' && (
              <AdminReviewsPage
                reviews={reviews}
                onUpdateReviewStatus={(id, st) =>
                  adminService.updateReviewStatus(id, st)
                }
              />
            )}

            {activeTab === 'support' && (
              <AdminSupportPage
                tickets={tickets}
                onSendReply={(id, text, st) => adminService.sendTicketReply(id, text, st)}
              />
            )}

            {activeTab === 'reports' && (
              <AdminReportsPage />
            )}

            {activeTab === 'settings' && (
              <AdminSettingsSecurityPage
                users={users}
                auditLogs={auditLogs}
                onToggle2FA={(id) => adminService.toggleTwoFactor(id)}
                onUpdateUserRole={(id, role) => adminService.updateUserRole(id, role)}
              />
            )}
          </main>

          {/* Admin Footer */}
          <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-700">
            AutoPartsHub Platform Administration & Marketplace Governance • Subdomain Frontend Ready
          </footer>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
};
