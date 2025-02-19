
import React, { useState, useCallback, useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { FileItem, FilePickerProps } from '@/types/file-picker';
import BreadcrumbNav from './file-picker/BreadcrumbNav';
import FileListItem from './file-picker/FileListItem';

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
    e.preventDefault();
    if (item.isDirectory) {
      setBreadcrumbs(prev => [...prev, { id: item.id, name: item.name }]);
      await fetchItems(item.id);
    }
  };

  const handleBreadcrumbClick = async (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    await fetchItems(newBreadcrumbs[newBreadcrumbs.length - 1].id);
  };

  const handleCheckboxChange = (e: React.MouseEvent, item: FileItem) => {
    e.preventDefault();
    e.stopPropagation();
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
      <BreadcrumbNav 
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={handleBreadcrumbClick}
      />

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
          items.map((item) => (
            <FileListItem
              key={item.id}
              item={item}
              isSelected={selectedItems.has(item.id)}
              onItemClick={handleItemClick}
              onCheckboxChange={handleCheckboxChange}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FilePicker;
