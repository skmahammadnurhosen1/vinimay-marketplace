import React, { createContext, useContext, useState } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (isOpen: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const { showToast } = useToast();

  const addToCompare = (product: Product) => {
    if (compareItems.some(item => item.id === product.id)) {
      removeFromCompare(product.id);
      return;
    }

    if (compareItems.length >= 4) {
      showToast(
        'Comparison Limit Reached',
        'You can compare up to 4 spare parts simultaneously.',
        'warning'
      );
      return;
    }

    setCompareItems(prev => [...prev, product]);
    showToast(
      'Added to Compare',
      `${product.brand} ${product.title} added to comparison list.`,
      'info'
    );
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems(prev => prev.filter(item => item.id !== productId));
    showToast('Removed from Compare', 'Product removed from comparison list.', 'info');
  };

  const isInCompare = (productId: string) => {
    return compareItems.some(item => item.id === productId);
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        isCompareModalOpen,
        setIsCompareModalOpen
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
