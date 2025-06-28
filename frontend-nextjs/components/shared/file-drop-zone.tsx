"use client";

import { useDropzone } from "react-dropzone";
import { Upload, X, File, LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
  accept: Record<string, string[]>;
  maxSize: number;
  multiple?: boolean;
  placeholder: string;
  description: string;
  fileIcon?: LucideIcon;
}

export function FileDropZone({
  onFilesChange,
  accept,
  maxSize,
  multiple = true,
  placeholder,
  description,
  fileIcon: FileIcon = File,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
  } = useDropzone({
    accept: accept,
    maxSize: maxSize,
    multiple: multiple,
    onDrop: (acceptedFiles) => {
      setUploadedFiles((prevFiles) => {
        const newFiles = [...prevFiles, ...acceptedFiles];
        onFilesChange?.(newFiles);
        return newFiles;
      });
    },
  });

  // Show toast notifications for file rejections
  useEffect(() => {
    if (fileRejections.length > 0) {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          const message =
            error.code === "file-too-large"
              ? `File is too large (${(file.size / (1024 * 1024)).toFixed(
                  2
                )}MB). Max size is ${maxSize / (1024 * 1024)}MB.`
              : `File type not supported`;

          toast.error(`${fileRejections.length} Upload Failed`, {
            description: message,
          });
        });
      });
    }
  }, [fileRejections]);

  return (
    <div className="container">
      {/* Toast Notifications for file rejection errors*/}
      <Toaster position="top-center" />

      {/* File Drop Zone */}
      <div
        {...getRootProps({
          className: `border-2 border-dashed p-8 text-center cursor-pointer hover:border-neutral-500 transition-colors rounded-lg ${
            isDragActive && "border-blue-500 bg-blue-50 dark:bg-blue-950"
          }`,
        })}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto  text-neutral-500" />
        <p className="text-lg leading-7 [&:not(:first-child)]:mt-6 font-medium">
          {placeholder}
        </p>
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      </div>

      {/* File Preview */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-sm leading-7 [&:not(:first-child)]:mt-6">
            Uploaded Files ({uploadedFiles.length})
          </p>
          <ul className="mt-4 space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg"
              >
                <FileIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm leading-7 [&:not(:first-child)]:mt-6">
                    {file.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {(file.size / (1024 * 1024)).toFixed(3)} MB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setUploadedFiles((prevFiles) => {
                      const newFiles = prevFiles.filter((_, i) => i !== index);
                      onFilesChange?.(newFiles);
                      return newFiles;
                    });
                  }}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
