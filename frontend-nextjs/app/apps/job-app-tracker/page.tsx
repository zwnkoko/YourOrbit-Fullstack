"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "@/components/shared/file-upload";
import { useState } from "react";

export default function JobAppTrackerPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
  };
  return (
    <div className="size-full flex flex-col justify-center gap-y-4">
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
        Job Application Tracker
      </h1>

      <FileUpload
        onFilesChange={handleFilesChange}
        placeholder="Drop job screenshots here"
        description="Upload screenshots of job postings"
      />

      <Separator />

      <div>
        <Textarea
          aria-label="job description input box"
          placeholder="Paste job description here"
          className="resize-none min-h-40 max-h-52 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-neutral-500"
        />
      </div>
      <Button> Submit </Button>
    </div>
  );
}
