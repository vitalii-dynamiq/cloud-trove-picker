
import { File, FileText, FileImage, FileVideo, FileAudio, Folder } from 'lucide-react';

export const formatFileSize = (bytes?: number) => {
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

export const getFileIcon = (fileType?: string, isDirectory?: boolean) => {
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
