import React from 'react';
import { SearchSuggestionGroup, SearchSuggestionItem } from '../../types';
import { Search, Tag, Car, Wrench, Layers, Hash } from 'lucide-react';

interface SearchSuggestionsProps {
  groups: SearchSuggestionGroup[];
  onSelectSuggestion: (item: SearchSuggestionItem) => void;
  query: string;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  groups,
  onSelectSuggestion,
  query
}) => {
  if (groups.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-gray-500 bg-white rounded-xl shadow-xl border border-gray-200">
        No suggestions found for <strong className="text-gray-900">"{query}"</strong>.
      </div>
    );
  }

  const getGroupIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Wrench className="w-3.5 h-3.5 text-[#0B56D0]" />;
      case 'partNumber':
        return <Hash className="w-3.5 h-3.5 text-purple-600" />;
      case 'brand':
        return <Tag className="w-3.5 h-3.5 text-emerald-600" />;
      case 'vehicle':
        return <Car className="w-3.5 h-3.5 text-amber-600" />;
      case 'category':
        return <Layers className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <Search className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100 max-h-96 overflow-y-auto z-50">
      {groups.map((group) => (
        <div key={group.type} className="p-2">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            {getGroupIcon(group.type)}
            <span>{group.label}</span>
          </div>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSuggestion(item)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50/70 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-xs font-semibold text-gray-900 group-hover:text-[#0B56D0] truncate">
                    {item.title}
                  </div>
                  {item.subtitle && (
                    <div className="text-[11px] text-gray-500 font-normal truncate">
                      {item.subtitle}
                    </div>
                  )}
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-gray-100 group-hover:bg-blue-100 text-gray-600 group-hover:text-[#0B56D0] rounded shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
