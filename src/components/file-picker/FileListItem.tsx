
import React from 'react';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileItem } from '@/types/file-picker';
import { formatFileSize, getFileIcon } from '@/utils/file-utils';

interface FileListItemProps {
  item: FileItem;
  isSelected: boolean;
  onItemClick: (e: React.MouseEvent, item: FileItem) => void;
  onCheckboxChange: (e: React.MouseEvent, item: FileItem) => void;
}

const FileListItem: React.FC<FileListItemProps> = ({
  item,
  isSelected,
  onItemClick,
  onCheckboxChange,
}) => {
  const Icon = getFileIcon(item.fileType, item.isDirectory);

  return (
    <div
      className={cn(
        "group flex items-center px-4 py-2 gap-3",
        "hover:bg-gray-50 transition-colors cursor-pointer"
      )}
      onClick={(e) => onItemClick(e, item)}
    >
      <div 
        onClick={(e) => onCheckboxChange(e, item)}
        className={cn(
          "w-5 h-5 rounded border transition-colors",
          "flex items-center justify-center",
          isSelected
            ? "bg-blue-500 border-blue-500"
            : "border-gray-300 group-hover:border-gray-400"
        )}
      >
        {isSelected && (
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      <Icon className={cn(
        "w-5 h-5",
        item.isDirectory ? "text-blue-500" : "text-gray-400"
      )} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 truncate">
            {item.name}
          </span>
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <span>Updated by {item.updatedBy}</span>
          <span>•</span>
          <span>{format(new Date(item.updatedAt), 'MMM d, yyyy')}</span>
          {!item.isDirectory && (
            <>
              <span>•</span>
              <span>{formatFileSize(item.size)}</span>
            </>
          )}
        </div>
      </div>

      {item.isDirectory && (
        <ChevronRight className="w-5 h-5 text-gray-400" />
      )}
    </div>
  );
};

export default FileListItem;
