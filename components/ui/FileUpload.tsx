
import React, { useState, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, className = '' }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onFileSelect]);

  const dragDropClasses = isDragging
    ? 'border-blue-500 bg-blue-500/10'
    : 'border-gray-600 hover:border-blue-500 hover:bg-gray-800/50';

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full h-full p-8 text-center border-2 border-dashed rounded-lg transition-all duration-300 ${dragDropClasses} ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <UploadCloud className="w-16 h-16 text-gray-500 mb-4" />
      <p className="mb-2 text-lg text-gray-400">
        <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-gray-500">CSV file</p>
      <input
        type="file"
        id="file-upload"
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        accept=".csv"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
