import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShoppingCart,
  Zap,
  SlidersHorizontal,
  ArrowLeft,
  Minus,
  Plus,
  ShieldAlert,
  Check
} from 'lucide-react';
import { Product } from '../../types';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useVehicle } from '../../context/VehicleContext';
import { useCompare } from '../../context/CompareContext';
import { useToast } from '../../context/ToastContext';
import { Breadcrumbs, BreadcrumbItem } from '../shop/Breadcrumbs';
import { CompatibleVehiclesModal } from '../shop/CompatibleVehiclesModal';
import { ProductGallery } from './ProductGallery';
import { ProductHeader } from './ProductHeader';
import { CompatibilityCard } from './CompatibilityCard';
import { PriceBlock } from './PriceBlock';
import { StockIndicator } from './StockIndicator';
import { DeliveryInfo } from './DeliveryInfo';
import { SellerCard } from './SellerCard';
import { WarrantyReturnInstallation } from './WarrantyReturnInstallation';
import { ProductSpecs } from './ProductSpecs';
import { CompatibilityTable } from './CompatibilityTable';
import { ReviewSection } from './ReviewSection';
import { RelatedProducts } from './RelatedProducts';
import { DirectOrderModal, OrderData } from './DirectOrderModal';
import { OrderSuccessModal } from './OrderSuccessModal';
import { MobilePurchaseBar } from './MobilePurchaseBar';
import { ProductDetailsSkeleton } from './ProductDetailsSkeleton';
import { ProductNotFound } from './ProductNotFound';

interface ProductDetailsPageProps {
  product?: Product | null;
  productId?: string;
  onBackToShop: () => void;
  onBackToHome: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigateCheckout?: () => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product: initialProduct,
  productId,
  onBackToShop,
  onBackToHome,
  onSelectProduct,
  onNavigateCheckout
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { selectedVehicle } = useVehicle();
  const { addToCompare, isInCompare } = useCompare();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialProduct && !!productId);
  const [quantity, setQuantity] = useState(1);

  // Modals state
  const [isCompatibleModalOpen, setIsCompatibleModalOpen] = useState(false);
  const [isDirectOrderOpen, setIsDirectOrderOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderData | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showCompatibilityWarningPrompt, setShowCompatibilityWarningPrompt] = useState(false);

  // Dynamic Product Resolution
  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      setIsLoading(false);
      return;
    }

    if (productId) {
      let isCancelled = false;
      setIsLoading(true);
      productService.getProductById(productId).then(found => {
        if (!isCancelled) {
          setProduct(found || null);
          setIsLoading(false);
        }
      });
      return () => {
        isCancelled = true;
      };
    }
  }, [initialProduct, productId]);

  // Scroll to top on product change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product?.id]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <ProductNotFound
        onBackToShop={onBackToShop}
        onBackToHome={onBackToHome}
      />
    );
  }

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  // Vehicle Compatibility Check
  const isCompatible = selectedVehicle
    ? product.compatibility.some(c => {
        const vMake = selectedVehicle.manufacturer.toLowerCase();
        const vModel = selectedVehicle.model.toLowerCase();
        const cMake = c.manufacturer.toLowerCase();
        const cModel = c.model.toLowerCase();
        const matchMake =
          cMake.includes(vMake) ||
          vMake.includes(cMake) ||
          (vMake.includes('tata') && cMake.includes('tata'));
        const matchModel =
          cModel.includes(vModel) ||
          vModel.includes(cModel) ||
          (vModel.includes('ace') && cModel.includes('ace'));
        return matchMake && matchModel;
      })
    : false;

  // Add to Cart
  const handleAddToCart = () => {
    if (selectedVehicle && !isCompatible && !showCompatibilityWarningPrompt) {
      setShowCompatibilityWarningPrompt(true);
      return;
    }
    addToCart(product, quantity);
    showToast(
      'Added to Cart',
      `${quantity} × ${product.title} added to your cart.`,
      'success'
    );
    setShowCompatibilityWarningPrompt(false);
  };

  // Direct Order ("Buy Now")
  const handleBuyNowDirect = () => {
    if (selectedVehicle && !isCompatible && !showCompatibilityWarningPrompt) {
      setShowCompatibilityWarningPrompt(true);
      return;
    }
    if (onNavigateCheckout) {
      addToCart(product, quantity);
      onNavigateCheckout();
    } else {
      setIsDirectOrderOpen(true);
    }
    setShowCompatibilityWarningPrompt(false);
  };

  const handleOrderPlaced = (orderData: OrderData) => {
    setIsDirectOrderOpen(false);
    setConfirmedOrder(orderData);
    setIsSuccessModalOpen(true);
  };

  // Breadcrumbs
  const categoryLabel = product.category
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', onClick: onBackToHome },
    { label: 'Shop', onClick: onBackToShop },
    { label: categoryLabel, onClick: onBackToShop },
    { label: `${product.brand} ${product.title}`, active: true }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-28 sm:pb-16 overflow-hidden">
      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <Breadcrumbs items={breadcrumbs} />
        <button
          type="button"
          onClick={onBackToShop}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer py-1 self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product Listing</span>
        </button>
      </div>

      {/* Main Two-Column Composition Area */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-7 shadow-xs my-4 overflow-hidden w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* ========================================================= */}
          {/* LEFT COLUMN: High-Res Gallery & Authenticity Badges (5 Cols) */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-4 min-w-0">
            <ProductGallery
              images={product.images}
              title={product.title}
              partNumber={product.partNumber}
              partType={product.partType}
              discountPercentage={product.discountPercentage}
            />
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Header, Compatibility, Pricing & Purchase (7 Cols) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-5 min-w-0">
            {/* 1. Product Brand, Title, Rating, Part Numbers */}
            <ProductHeader product={product} />

            {/* 2. VEHICLE COMPATIBILITY (Highly Visible at Top!) */}
            <CompatibilityCard
              product={product}
              onOpenCompatibleList={() => setIsCompatibleModalOpen(true)}
            />

            {/* Incompatible Safety Warning Interstitial Prompt */}
            {showCompatibilityWarningPrompt && (
              <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl space-y-2.5 animate-in shake duration-300">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-red-950">
                      Vehicle Fitment Warning — Wrong Part Risk
                    </h4>
                    <p className="text-xs text-red-800 leading-relaxed mt-0.5">
                      This spare part is not confirmed for your active vehicle ({selectedVehicle?.model}). Ordering an incorrect automotive part causes vehicle downtime and return shipping delays.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (isDirectOrderOpen) {
                        setIsDirectOrderOpen(true);
                      } else {
                        addToCart(product, quantity);
                        showToast('Added to Cart', 'Item added despite compatibility warning.', 'warning');
                      }
                      setShowCompatibilityWarningPrompt(false);
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    I Understand, Continue Anyway
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCompatibilityWarningPrompt(false)}
                    className="text-xs font-semibold text-stone-600 hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* 3. Pricing & Taxes Block */}
            <PriceBlock
              price={product.price}
              mrp={product.mrp}
              discountPercentage={product.discountPercentage}
            />

            {/* 4. Stock Availability Indicator */}
            <div>
              <StockIndicator
                inStock={product.inStock}
                stockCount={product.stockCount}
              />
            </div>

            {/* 5. Delivery & Pincode Checker */}
            <DeliveryInfo deliveryTime={product.deliveryTime} />

            {/* 6. Quantity Stepper & Dual Purchasing Actions */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-stone-700">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-stone-100 text-stone-600 disabled:opacity-40 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-stone-900 font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-stone-500 font-mono">
                  Subtotal: <strong>₹{(product.price * quantity).toLocaleString('en-IN')}</strong>
                </span>
              </div>

              {/* Action Buttons Grid */}
              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2.5 sm:gap-3 pt-1">
                {/* 1. DIRECT ORDER BUTTON */}
                <button
                  type="button"
                  onClick={handleBuyNowDirect}
                  disabled={!product.inStock}
                  className="sm:col-span-6 w-full py-3.5 px-5 bg-[#0B56D0] hover:bg-[#0947AD] disabled:opacity-50 active:scale-[0.98] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Buy Now (Direct Order)</span>
                </button>

                {/* 2. ADD TO CART BUTTON */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="sm:col-span-4 w-full py-3.5 px-5 bg-[#FFBA00] hover:bg-[#EAA500] disabled:opacity-50 active:scale-[0.98] text-gray-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-gray-950" />
                  <span>Add to Cart</span>
                </button>

                {/* 3 & 4. Compare & Wishlist: Side-by-side on mobile, single columns on desktop */}
                <div className="grid grid-cols-2 sm:contents gap-2">
                  <button
                    type="button"
                    onClick={() => addToCompare(product)}
                    className={`sm:col-span-1 py-2.5 sm:p-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                      inCompare
                        ? 'border-[#0B56D0] bg-blue-50 text-[#0B56D0] font-semibold'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900'
                    }`}
                    title={inCompare ? 'Remove from Comparison' : 'Add to Compare'}
                    aria-label="Compare part"
                  >
                    {inCompare ? <Check className="w-4 h-4 stroke-[3]" /> : <SlidersHorizontal className="w-4 h-4" />}
                    <span className="text-xs font-semibold sm:hidden">{inCompare ? 'Comparing' : 'Compare'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toggleWishlist(product.id);
                      showToast(
                        inWishlist ? 'Removed from Wishlist' : 'Saved to Wishlist',
                        `${product.title} ${inWishlist ? 'removed from' : 'saved to'} wishlist`,
                        'info'
                      );
                    }}
                    className={`sm:col-span-1 py-2.5 sm:p-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                      inWishlist
                        ? 'border-red-200 bg-red-50 text-red-600 font-semibold'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600 hover:text-red-500'
                    }`}
                    title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="text-xs font-semibold sm:hidden">{inWishlist ? 'Saved' : 'Wishlist'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 7. Verified Seller Card */}
            <SellerCard seller={product.seller} />
          </div>
        </div>
      </div>

      {/* Dedicated Visible Section: Warranty, Returns, Installation Guidance */}
      <WarrantyReturnInstallation
        warranty={product.warranty}
        returnDays={product.returnDays}
        installationGuidance={product.installationGuidance}
        category={product.category}
      />

      {/* Dedicated Technical Specifications Table */}
      <ProductSpecs product={product} />

      {/* Detailed Expandable Compatible Vehicles Table */}
      <CompatibilityTable
        compatibilityList={product.compatibility}
        productTitle={product.title}
      />

      {/* Customer Reviews & Installation Feedback Section */}
      <ReviewSection
        productId={product.id}
        rating={product.rating}
        reviewCount={product.reviewCount}
      />

      {/* Related Spare Parts & Assemblies */}
      <RelatedProducts
        currentProduct={product}
        onSelectProduct={(p) => {
          onSelectProduct(p);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modals */}
      <CompatibleVehiclesModal
        product={product}
        isOpen={isCompatibleModalOpen}
        onClose={() => setIsCompatibleModalOpen(false)}
      />

      <DirectOrderModal
        product={product}
        quantity={quantity}
        isOpen={isDirectOrderOpen}
        onClose={() => setIsDirectOrderOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderSuccessModal
        order={confirmedOrder}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onNavigateHome={onBackToHome}
        onNavigateShop={onBackToShop}
      />

      {/* Mobile Sticky Purchase Bar */}
      <MobilePurchaseBar
        product={product}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNowDirect}
        inStock={product.inStock}
      />
    </div>
  );
};
