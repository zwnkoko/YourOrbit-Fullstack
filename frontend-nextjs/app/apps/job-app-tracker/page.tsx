"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileDropZone } from "@/components/shared/file-drop-zone";
import { useState } from "react";
import { FileImage } from "lucide-react";

export default function JobAppTrackerPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isBreakAll, setIsBreakAll] = useState(false);
  const [textValue, setTextValue] = useState("");

  // const handleFilesChange = (files: File[]) => {
  //   setUploadedFiles(files);
  // };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const input = event.target.value;
    setTextValue(input);

    // set flag to break all words on textarea if word length exceeds 30 characters
    // this is to prevent invalid long words from stretching the textareao0;5647
    setIsBreakAll(input.split(" ").some((w) => w.length > 30));
  };

  return (
    <div className="size-full flex flex-col justify-center gap-y-4 ">
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
        Job Application Tracker
      </h1>

      <FileDropZone
        accept={{ "image/*": [] }}
        maxSize={5 * 1024 * 1024} // 5MB
        onFilesChange={() => {}}
        placeholder="Upload job posting screenshots"
        description="Drag & drop or click to browse • Max 5MB per file"
        fileIcon={FileImage}
      />

      <Separator />

      <div>
        <Textarea
          aria-label="job description input box"
          placeholder="Paste job description here"
          onChange={handleTextareaChange}
          className={`resize-none min-h-40 max-h-52 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-neutral-500 break-words ${
            isBreakAll ? "break-all" : "break-words"
          }`}
        />
      </div>
      <Button> Submit </Button>
    </div>
  );
}
