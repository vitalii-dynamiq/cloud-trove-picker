
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbNavProps {
  breadcrumbs: { id: string; name: string }[];
  onBreadcrumbClick: (e: React.MouseEvent, index: number) => void;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  breadcrumbs,
  onBreadcrumbClick,
}) => {
  return (
    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 overflow-x-auto">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.id}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          <button
            onClick={(e) => onBreadcrumbClick(e, index)}
            className={cn(
              "text-sm px-2 py-1 rounded-md transition-colors",
              index === breadcrumbs.length - 1
                ? "text-gray-900 bg-gray-100"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            {crumb.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default BreadcrumbNav;
