import React, { useState, useEffect } from 'react';
import {
  CustomerOrder,
  CustomerReturnRequest,
  CustomerWarrantyClaim,
  Product,
  SelectedVehicle
} from '../../types';
import { orderService } from '../../services/orderService';
import { useVehicle } from '../../context/VehicleContext';
import { useToast } from '../../context/ToastContext';
import { AccountSidebar, AccountTabType } from './AccountSidebar';
import { OrdersListPage } from '../orders/OrdersListPage';
import { OrderDetailsPage } from '../orders/OrderDetailsPage';
import { OrderTrackingModal } from '../orders/OrderTrackingModal';
import { ReturnRequestModal } from '../returns/ReturnRequestModal';
import { ReturnStatusModal } from '../returns/ReturnStatusModal';
import { WarrantyClaimModal } from '../warranty/WarrantyClaimModal';
import { WarrantyStatusModal } from '../warranty/WarrantyStatusModal';
import { SupportHub } from '../support/SupportHub';
import { NotificationCenter } from './NotificationCenter';
import { CreateTicketModal } from '../support/CreateTicketModal';
import { Breadcrumbs, BreadcrumbItem } from '../shop/Breadcrumbs';
import {
  Car,
  ShieldCheck,
  CheckCircle2,
  Package,
  RotateCcw,
  Wrench,
  MapPin,
  Building,
  Plus
} from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

interface AccountHubProps {
  initialTab?: AccountTabType;
  initialOrderId?: string;
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenAuthModal?: () => void;
}

export const AccountHub: React.FC<AccountHubProps> = ({
  initialTab = 'orders',
  initialOrderId,
  onNavigateHome,
  onNavigateShop,
  onSelectProduct,
  onOpenAuthModal,
}) => {
  const { currentUser, profile, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const { selectedVehicle, setVehicle, setIsSelectorModalOpen } = useVehicle();

  const [activeTab, setActiveTab] = useState<AccountTabType>(initialTab);
  const [orders, setOrders] = useState<CustomerOrder[]>(() => orderService.getAllOrders());
  const [returns, setReturns] = useState<CustomerReturnRequest[]>(() => orderService.getReturnRequests());
  const [warranties, setWarranties] = useState<CustomerWarrantyClaim[]>(() => orderService.getWarrantyClaims());
  const [unreadNotifs, setUnreadNotifs] = useState(() =>
    orderService.getNotifications().filter(n => !n.read).length
  );

  // Deep-dive state
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(() => {
    if (initialOrderId) {
      return orderService.getOrderById(initialOrderId) || null;
    }
    return null;
  });

  // Modals state
  const [trackingOrder, setTrackingOrder] = useState<CustomerOrder | null>(null);
  const [returnRequestOrder, setReturnRequestOrder] = useState<CustomerOrder | null>(null);
  const [returnRequestProduct, setReturnRequestProduct] = useState<Product | null>(null);
  const [activeReturnModal, setActiveReturnModal] = useState<CustomerReturnRequest | null>(null);
  const [warrantyClaimOrder, setWarrantyClaimOrder] = useState<CustomerOrder | null>(null);
  const [warrantyClaimProduct, setWarrantyClaimProduct] = useState<Product | null>(null);
  const [activeWarrantyModal, setActiveWarrantyModal] = useState<CustomerWarrantyClaim | null>(null);
  const [ticketModalOrderId, setTicketModalOrderId] = useState<string | undefined>(undefined);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const refreshData = () => {
    setOrders(orderService.getAllOrders());
    setReturns(orderService.getReturnRequests());
    setWarranties(orderService.getWarrantyClaims());
    setUnreadNotifs(orderService.getNotifications().filter(n => !n.read).length);
  };

  const handleOpenReturnModal = (order: CustomerOrder, product: Product) => {
    setReturnRequestOrder(order);
    setReturnRequestProduct(product);
  };

  const handleOpenWarrantyModal = (order: CustomerOrder, product: Product) => {
    setWarrantyClaimOrder(order);
    setWarrantyClaimProduct(product);
  };

  const handleOpenTicketModal = (orderId: string) => {
    setTicketModalOrderId(orderId);
    setIsTicketModalOpen(true);
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', onClick: onNavigateHome },
    { label: 'Marketplace Account', onClick: () => { setSelectedOrder(null); setActiveTab('orders'); } },
    {
      label: selectedOrder
        ? `Order #${selectedOrder.id}`
        : activeTab === 'orders'
        ? 'My Orders'
        : activeTab === 'returns'
        ? 'Returns'
        : activeTab === 'warranties'
        ? 'Warranties'
        : activeTab.charAt(0).toUpperCase() + activeTab.slice(1),
      active: true
    }
  ];

  // Saved Garage Vehicles Demo
  const savedGarageVehicles: SelectedVehicle[] = [
    {
      vehicleType: 'commercial',
      manufacturer: 'Tata',
      model: 'Ace Gold',
      year: 2022,
      fuelType: 'Diesel',
      engine: '700cc Dicor',
      variant: 'Plus'
    },
    {
      vehicleType: 'passenger',
      manufacturer: 'Maruti Suzuki',
      model: 'Swift',
      year: 2021,
      fuelType: 'Petrol',
      engine: '1.2L DualJet',
      variant: 'ZXi+'
    },
    {
      vehicleType: 'commercial',
      manufacturer: 'Mahindra',
      model: 'Bolero Maxi Truck',
      year: 2020,
      fuelType: 'Diesel',
      engine: '2.5L m2DiCR',
      variant: 'Plus'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      <Breadcrumbs items={breadcrumbs} />

      {/* Main Grid: Sidebar Left, Content Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <AccountSidebar
            activeTab={activeTab}
            onSelectTab={tab => {
              setSelectedOrder(null);
              setActiveTab(tab);
            }}
            unreadCount={unreadNotifs}
            onLogout={async () => {
              await logout();
              showToast('Signed Out', 'You have been safely signed out.', 'info');
              onNavigateHome();
            }}
            onOpenAuth={onOpenAuthModal}
          />
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            selectedOrder ? (
              <OrderDetailsPage
                order={selectedOrder}
                onBack={() => setSelectedOrder(null)}
                onRequestReturn={handleOpenReturnModal}
                onClaimWarranty={handleOpenWarrantyModal}
                onOpenSupportTicket={handleOpenTicketModal}
              />
            ) : (
              <OrdersListPage
                orders={orders}
                onViewOrderDetails={order => setSelectedOrder(order)}
                onTrackOrder={order => setTrackingOrder(order)}
                onRequestReturn={order => {
                  const firstItem = order.packages[0]?.items[0]?.product;
                  if (firstItem) handleOpenReturnModal(order, firstItem);
                }}
                onBrowseShop={onNavigateShop}
              />
            )
          )}

          {/* TAB 2: RETURNS */}
          {activeTab === 'returns' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-gray-950 tracking-tight">
                    Returns & Replacement Requests
                  </h2>
                  <p className="text-xs text-gray-500">
                    Track verification, doorstep reverse pickups, and refund processing
                  </p>
                </div>
              </div>

              {returns.length > 0 ? (
                <div className="space-y-4">
                  {returns.map(ret => (
                    <div
                      key={ret.id}
                      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={ret.product.images[0]}
                          alt={ret.product.title}
                          className="w-14 h-14 rounded-xl object-contain bg-gray-50 border border-gray-200 p-1 shrink-0"
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900">
                              {ret.product.title}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                              #{ret.id}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 font-mono">
                            Reason: <strong className="text-gray-800">{ret.reason}</strong> • Order #{ret.orderId}
                          </div>
                          <div className="text-[11px] text-purple-900 font-medium">
                            Status: <strong className="uppercase">{ret.status.replace(/_/g, ' ')}</strong>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setActiveReturnModal(ret)}
                        rightIcon={<RotateCcw className="w-3.5 h-3.5" />}
                        className="text-xs font-bold shrink-0"
                      >
                        View Return Status
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center space-y-3">
                  <RotateCcw className="w-12 h-12 text-gray-300 mx-auto" />
                  <h4 className="text-sm font-bold text-gray-900">No Return Requests</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    All delivered items are eligible for 10-day returns if damaged or incompatible.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WARRANTIES */}
          {activeTab === 'warranties' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-gray-950 tracking-tight">
                    Active Warranty Claims & Coverage
                  </h2>
                  <p className="text-xs text-gray-500">
                    Direct OEM engineering defect evaluations and replacement status
                  </p>
                </div>
              </div>

              {warranties.length > 0 ? (
                <div className="space-y-4">
                  {warranties.map(w => (
                    <div
                      key={w.id}
                      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={w.product.images[0]}
                          alt={w.product.title}
                          className="w-14 h-14 rounded-xl object-contain bg-gray-50 border border-gray-200 p-1 shrink-0"
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900">
                              {w.product.title}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                              #{w.id}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 font-mono">
                            Part: {w.partNumber} • Coverage: {w.warrantyPeriod}
                          </div>
                          <div className="text-[11px] text-blue-900 font-medium">
                            Status: <strong className="uppercase">{w.status.replace(/_/g, ' ')}</strong>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setActiveWarrantyModal(w)}
                        rightIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                        className="text-xs font-bold shrink-0"
                      >
                        Track Claim
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center space-y-3">
                  <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto" />
                  <h4 className="text-sm font-bold text-gray-900">No Active Warranty Claims</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    All genuine spare parts sold on AutoPartsHub come with 12 to 24-month manufacturer warranties.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: VEHICLE GARAGE */}
          {activeTab === 'garage' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-gray-950 tracking-tight">
                    My Vehicle Garage & Fleet
                  </h2>
                  <p className="text-xs text-gray-500">
                    Manage vehicles to unlock 1-click guaranteed part compatibility across the marketplace
                  </p>
                </div>

                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => setIsSelectorModalOpen(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  className="text-xs font-bold"
                >
                  Add Vehicle
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedGarageVehicles.map((v, i) => {
                  const isActive =
                    selectedVehicle?.manufacturer === v.manufacturer &&
                    selectedVehicle?.model === v.model;

                  return (
                    <div
                      key={i}
                      className={`p-5 rounded-2xl border-2 transition-all ${
                        isActive
                          ? 'border-[#0B56D0] bg-blue-50/50 shadow-xs'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#071530] text-[#FFBA00] flex items-center justify-center font-bold">
                            <Car className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-gray-950">
                              {v.manufacturer} {v.model}
                            </h4>
                            <span className="text-[11px] text-gray-500">
                              {v.year} • {v.fuelType} • {v.engine}
                            </span>
                          </div>
                        </div>

                        {isActive ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Active Car
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setVehicle(v);
                              showToast('Active Vehicle Set', `${v.manufacturer} ${v.model} selected for catalog fitment.`, 'success');
                            }}
                            className="text-xs font-bold text-[#0B56D0] hover:underline cursor-pointer"
                          >
                            Set Active
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <NotificationCenter
              onNavigateOrder={orderId => {
                const o = orderService.getOrderById(orderId);
                if (o) {
                  setSelectedOrder(o);
                  setActiveTab('orders');
                }
              }}
              onNavigateReturn={retId => {
                const r = orderService.getReturnRequestById(retId);
                if (r) setActiveReturnModal(r);
              }}
            />
          )}

          {/* TAB 6: SUPPORT */}
          {activeTab === 'support' && (
            <SupportHub
              onNavigateOrders={() => {
                setSelectedOrder(null);
                setActiveTab('orders');
              }}
              onNavigateReturns={() => setActiveTab('returns')}
              onNavigateWarranties={() => setActiveTab('warranties')}
            />
          )}

          {/* TAB 7: PROFILE & GSTIN */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-6 space-y-5">
              <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Buyer Profile & Account Information
                  </h3>
                  <p className="text-xs text-gray-500">
                    Authenticated customer credentials, session details, and marketplace preferences
                  </p>
                </div>
                {isAuthenticated && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50"
                    onClick={async () => {
                      await logout();
                      showToast('Signed Out', 'You have been safely signed out.', 'info');
                      onNavigateHome();
                    }}
                  >
                    Sign Out
                  </Button>
                )}
              </div>

              {isAuthenticated ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Account Holder</span>
                    <div className="font-bold text-gray-900 text-sm">
                      {profile?.displayName || currentUser?.displayName || 'Marketplace Member'}
                    </div>
                    <div className="text-gray-500">{profile?.email || currentUser?.email}</div>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Account Role & Status</span>
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                      <span className="uppercase text-xs bg-[#0B56D0] text-white px-2 py-0.5 rounded-md font-extrabold">
                        {profile?.role || 'CUSTOMER'}
                      </span>
                      <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        {profile?.accountStatus || 'ACTIVE'}
                      </span>
                    </div>
                    <div className="text-gray-400 text-[10px] font-mono mt-1">
                      UID: {currentUser?.uid}
                    </div>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1 sm:col-span-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Security & Permissions</span>
                    <div className="text-xs font-semibold text-gray-800">
                      Email Verified: {currentUser?.emailVerified ? '✅ Yes' : '⚠️ Pending Verification'}
                    </div>
                    <div className="text-gray-500 text-[11px]">
                      Access permissions granted: {profile?.permissions?.join(', ') || 'CATALOG_READ, ORDER_CREATE'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-blue-50/50 border border-blue-100 rounded-2xl space-y-3">
                  <h4 className="text-sm font-bold text-gray-900">Sign in to manage your customer account</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Save your shipping addresses, manage vehicle fitment garage, and track all dispatches in real-time.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-[#0284C7] hover:bg-[#0369A1] font-bold text-xs"
                    onClick={onOpenAuthModal}
                  >
                    Sign In or Create Account
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      <OrderTrackingModal
        order={trackingOrder}
        isOpen={!!trackingOrder}
        onClose={() => setTrackingOrder(null)}
      />

      <ReturnRequestModal
        order={returnRequestOrder}
        product={returnRequestProduct}
        isOpen={!!returnRequestOrder && !!returnRequestProduct}
        onClose={() => {
          setReturnRequestOrder(null);
          setReturnRequestProduct(null);
        }}
        onSuccess={returnId => {
          refreshData();
          const r = orderService.getReturnRequestById(returnId);
          if (r) setActiveReturnModal(r);
        }}
      />

      <ReturnStatusModal
        returnRequest={activeReturnModal}
        isOpen={!!activeReturnModal}
        onClose={() => setActiveReturnModal(null)}
        onUpdate={refreshData}
      />

      <WarrantyClaimModal
        order={warrantyClaimOrder}
        product={warrantyClaimProduct}
        isOpen={!!warrantyClaimOrder && !!warrantyClaimProduct}
        onClose={() => {
          setWarrantyClaimOrder(null);
          setWarrantyClaimProduct(null);
        }}
        onSuccess={claimId => {
          refreshData();
          const c = orderService.getWarrantyClaimById(claimId);
          if (c) setActiveWarrantyModal(c);
        }}
      />

      <WarrantyStatusModal
        claim={activeWarrantyModal}
        isOpen={!!activeWarrantyModal}
        onClose={() => setActiveWarrantyModal(null)}
        onUpdate={refreshData}
      />

      <CreateTicketModal
        initialOrderId={ticketModalOrderId}
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSuccess={() => refreshData()}
      />
    </div>
  );
};
