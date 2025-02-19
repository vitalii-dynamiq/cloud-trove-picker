import React, { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { ChevronRight, Folder, File, FileText, FileImage, FileVideo, FileAudio, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface FileItem {
  id: string;
  name: string;
  size?: number;
  fileType?: string;
  updatedAt: string;
  updatedBy: string;
  isDirectory?: boolean;
  children?: FileItem[];
}

interface FilePickerProps {
  connectionId: string;
  onFetchData: (directoryId: string) => Promise<FileItem[]>;
  onSelectionChange: (selectedItems: FileItem[]) => void;
  onError?: (error: Error) => void;
}

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const getFileIcon = (fileType?: string, isDirectory?: boolean) => {
  if (isDirectory) return Folder;
  
  switch (fileType?.toLowerCase()) {
    case 'text':
      return FileText;
    case 'image':
      return FileImage;
    case 'video':
      return FileVideo;
    case 'audio':
      return FileAudio;
    default:
      return File;
  }
};

const FilePicker: React.FC<FilePickerProps> = ({
  connectionId,
  onFetchData,
  onSelectionChange,
  onError,
}) => {
  const [items, setItems] = useState<FileItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([
    { id: 'root', name: 'Root' },
  ]);

  const fetchItems = useCallback(async (directoryId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await onFetchData(directoryId);
      setItems(data);
      onSelectionChange(Array.from(selectedItems).map(id => 
        data.find(item => item.id === id)
      ).filter(Boolean) as FileItem[]);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [onFetchData, onError, selectedItems]);

  useEffect(() => {
    fetchItems('root');
  }, [fetchItems]);

  const handleItemClick = async (e: React.MouseEvent, item: FileItem) => {
    e.preventDefault(); // Prevent default behavior
    if (item.isDirectory) {
      setBreadcrumbs(prev => [...prev, { id: item.id, name: item.name }]);
      await fetchItems(item.id);
    }
  };

  const handleBreadcrumbClick = async (e: React.MouseEvent, index: number) => {
    e.preventDefault(); // Prevent default behavior
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    await fetchItems(newBreadcrumbs[newBreadcrumbs.length - 1].id);
  };

  const handleCheckboxChange = (e: React.MouseEvent, item: FileItem) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Prevent event bubbling
    const newSelected = new Set(selectedItems);
    if (newSelected.has(item.id)) {
      newSelected.delete(item.id);
    } else {
      newSelected.add(item.id);
    }
    setSelectedItems(newSelected);
    onSelectionChange(
      Array.from(newSelected).map(id => 
        items.find(item => item.id === id)
      ).filter(Boolean) as FileItem[]
    );
  };

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500 flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Breadcrumb Navigation */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 overflow-x-auto">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.id}>
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            <button
              onClick={(e) => handleBreadcrumbClick(e, index)}
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

      {/* File List */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            This folder is empty
          </div>
        ) : (
          items.map((item) => {
            const Icon = getFileIcon(item.fileType, item.isDirectory);
            return (
              <div
                key={item.id}
                className={cn(
                  "group flex items-center px-4 py-2 gap-3",
                  "hover:bg-gray-50 transition-colors cursor-pointer"
                )}
                onClick={(e) => handleItemClick(e, item)}
              >
                <div 
                  onClick={(e) => handleCheckboxChange(e, item)}
                  className={cn(
                    "w-5 h-5 rounded border transition-colors",
                    "flex items-center justify-center",
                    selectedItems.has(item.id)
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300 group-hover:border-gray-400"
                  )}
                >
                  {selectedItems.has(item.id) && (
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
          })
        )}
      </div>
    </div>
  );
};

export default FilePicker;
