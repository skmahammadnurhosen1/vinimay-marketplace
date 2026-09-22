import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterGroupProps {
  title: string;
  badgeCount?: number;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({
  title,
  badgeCount,
  defaultExpanded = true,
  children
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-gray-100 py-3.5 first:pt-0 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-xs font-bold text-gray-900 hover:text-[#0B56D0] transition-colors py-1 cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <span>{title}</span>
          {typeof badgeCount === 'number' && badgeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-blue-100 text-[#0B56D0] text-[10px] font-bold flex items-center justify-center">
              {badgeCount}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        )}
      </button>

      {isExpanded && <div className="pt-2.5 space-y-1.5">{children}</div>}
    </div>
  );
};
