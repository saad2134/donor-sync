"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import { UploadClient } from "@uploadcare/upload-client";
const client = new UploadClient({ publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY });

export function FileUploader({ field, onFilesChange }) {
  const [uploadedFiles, setUploadedFiles] = useState(() => field.value ?? []);

  const showAlert = (message) => setTimeout(() => alert(message), 0);

  const onDrop = useCallback(
    async (acceptedFiles, fileRejections) => {
      if (acceptedFiles.length + uploadedFiles.length > 3) {
        showAlert("You can only upload up to 3 files.");
        return;
      }

      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === "file-invalid-type") {
            showAlert(`Invalid file type: ${file.name}. Only PDF, PNG, and JPG are allowed.`);
          } else if (error.code === "file-too-large") {
            showAlert(`File too large: ${file.name}. Each file must be under 1MB.`);
          }
        });
      });

      const validFiles = acceptedFiles.filter(
        (file) => ["application/pdf", "image/png", "image/jpeg"].includes(file.type) && file.size <= 1024 * 1024
      );

      const uploadedUrls = await Promise.all(validFiles.map(uploadFileToServer));

      const newFiles = [...uploadedFiles, ...uploadedUrls].slice(0, 3);
      setUploadedFiles(newFiles);
      onFilesChange(newFiles.length > 0 ? newFiles : []);
    },
    [uploadedFiles]
  );

  return (
    <div className="p-4 border border-dashed rounded-lg text-center space-y-4">
      <FileInput onDrop={onDrop} />
      {uploadedFiles.length > 0 && (
        <FileUploaderContent
          files={uploadedFiles}
          onRemove={(index) => {
            const newFiles = uploadedFiles.filter((_, i) => i !== index);
            setUploadedFiles(newFiles);
            onFilesChange(newFiles.length > 0 ? newFiles : []);
          }}
        />
      )}
    </div>
  );
}

function FileInput({ onDrop }) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/pdf": [], "image/png": [], "image/jpeg": [] },
    maxSize: 1024 * 1024,
    maxFiles: 3,
  });

  return (
    <div {...getRootProps()} className="border border-dashed p-6 cursor-pointer hover:bg-gray-100 rounded-lg">
      <input {...getInputProps()} />
      <p className="text-sm text-gray-500">Drag & drop files here, or click to select</p>
      <p className="text-sm text-gray-500">PDF, PNG, or JPG. Max 1MB/file. Up to 3 files.</p>
    </div>
  );
}

function FileUploaderContent({ files, onRemove }) {
  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <FileUploaderItem key={index} file={file} onRemove={() => onRemove(index)} />
      ))}
    </div>
  );
}

function FileUploaderItem({ file, onRemove }) {
  const fileName = typeof file === "object" ? file.name : decodeURIComponent(file.split("/").pop());

  return (
    <div className="flex justify-between items-center p-2 border rounded-lg">
      <a href={file.url || file} target="_blank" rel="noopener noreferrer" className="text-blue-500">
        {fileName}
      </a>
      <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

async function uploadFileToServer(file) {
  const uploadedFile = await client.uploadFile(file);
  return {
    name: file.name,
    url: `https://ucarecdn.com/${uploadedFile.uuid}/`,
  };
}
