import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { ViewMode } from '../../types';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
      <button
        type="button"
        onClick={() => onViewModeChange('grid')}
        className={`p-1.5 rounded-md transition-all cursor-pointer ${
          viewMode === 'grid'
            ? 'bg-white text-[#0B56D0] shadow-xs'
            : 'text-gray-500 hover:text-gray-900'
        }`}
        title="Grid View"
        aria-label="Grid View"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onViewModeChange('list')}
        className={`p-1.5 rounded-md transition-all cursor-pointer ${
          viewMode === 'list'
            ? 'bg-white text-[#0B56D0] shadow-xs'
            : 'text-gray-500 hover:text-gray-900'
        }`}
        title="List View"
        aria-label="List View"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
};
