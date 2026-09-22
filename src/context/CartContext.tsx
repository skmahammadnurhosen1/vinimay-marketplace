import React, { createContext, useContext, useState, useMemo } from 'react';
import { Product, CartItem, SellerCartGroupData, ConfirmedOrder } from '../types';
import { CheckoutService } from '../services/checkoutService';

export type DemoScenarioType =
  | 'multi-seller'
  | 'single-seller'
  | 'compatibility-warning'
  | 'low-stock'
  | 'out-of-stock'
  | 'empty';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  totalMrp: number;
  totalSavings: number;
  freeDeliveryThreshold: number;
  shippingTotal: number;
  gstAmount: number;
  totalPayable: number;
  groupedBySeller: SellerCartGroupData[];
  loadDemoScenario: (scenario: DemoScenarioType) => void;
  confirmedOrder: ConfirmedOrder | null;
  setConfirmedOrder: (order: ConfirmedOrder | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with realistic multi-seller items by default so the user sees a rich experience immediately
  const [items, setItems] = useState<CartItem[]>(() =>
    CheckoutService.getDemoScenarioItems('multi-seller')
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  const freeDeliveryThreshold = 2999;

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      const existing = prevItems.find(item => item.product.id === product.id);
      if (existing) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stockCount || 99, item.quantity + quantity) }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.product.id === productId) {
          const maxStock = item.product.stockCount || 99;
          return { ...item, quantity: Math.min(maxStock, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const loadDemoScenario = (scenario: DemoScenarioType) => {
    const scenarioItems = CheckoutService.getDemoScenarioItems(scenario);
    setItems(scenarioItems);
  };

  // Calculations
  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [items]
  );

  const totalMrp = useMemo(
    () => items.reduce((acc, item) => acc + item.product.mrp * item.quantity, 0),
    [items]
  );

  const totalSavings = useMemo(
    () => Math.max(0, totalMrp - subtotal),
    [totalMrp, subtotal]
  );

  const groupedBySeller = useMemo(
    () => CheckoutService.groupItemsBySeller(items),
    [items]
  );

  const shippingTotal = useMemo(() => {
    if (items.length === 0) return 0;
    if (subtotal >= freeDeliveryThreshold) return 0;
    // Otherwise sum of seller group shipping
    return groupedBySeller.reduce((acc, g) => acc + g.shippingFee, 0);
  }, [items.length, subtotal, freeDeliveryThreshold, groupedBySeller]);

  const gstAmount = useMemo(
    () => Math.round(subtotal * 0.18),
    [subtotal]
  );

  const totalPayable = useMemo(
    () => subtotal + shippingTotal,
    [subtotal, shippingTotal]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        totalMrp,
        totalSavings,
        freeDeliveryThreshold,
        shippingTotal,
        gstAmount,
        totalPayable,
        groupedBySeller,
        loadDemoScenario,
        confirmedOrder,
        setConfirmedOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
