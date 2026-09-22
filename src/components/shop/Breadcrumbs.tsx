import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-gray-500">
        <li className="flex items-center gap-1.5">
          <button
            onClick={items[0]?.onClick}
            className="flex items-center gap-1 hover:text-[#0B56D0] transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </li>

        {items.slice(1).map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {item.active || !item.onClick ? (
              <span className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-xs">
                {item.label}
              </span>
            ) : (
              <button
                onClick={item.onClick}
                className="hover:text-[#0B56D0] transition-colors cursor-pointer truncate max-w-[150px]"
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
