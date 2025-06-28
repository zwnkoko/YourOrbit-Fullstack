"use client";

import { useDropzone } from "react-dropzone";
import { Upload, X, Image } from "lucide-react";
import { useState } from "react";

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
  placeholder?: string;
  description?: string;
  className?: string;
}

export function FileUpload({
  onFilesChange,
  accept = { "image/*": [".png", ".jpg", ".jpeg", ".gif"] },
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = true,
  placeholder = "Drop files here or click to upload",
  description = "PNG, JPG, GIF up to 10MB",
  className = "",
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxSize,
    multiple,
    onDrop: (acceptedFiles) => {
      const newFiles = [...uploadedFiles, ...acceptedFiles];
      setUploadedFiles(newFiles);
      onFilesChange?.(newFiles);
    },
  });

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
              : "border-gray-300 hover:border-gray-400"
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-lg font-medium">Drop the files here...</p>
        ) : (
          <>
            <p className="text-lg font-medium">{placeholder}</p>
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          </>
        )}
      </div>

      {/* File Preview */}
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="relative group">
              <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
