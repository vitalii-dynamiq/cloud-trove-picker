
export interface FileItem {
  id: string;
  name: string;
  size?: number;
  fileType?: string;
  updatedAt: string;
  updatedBy: string;
  isDirectory?: boolean;
  children?: FileItem[];
}

export interface FilePickerProps {
  connectionId: string;
  onFetchData: (directoryId: string) => Promise<FileItem[]>;
  onSelectionChange: (selectedItems: FileItem[]) => void;
  onError?: (error: Error) => void;
}
