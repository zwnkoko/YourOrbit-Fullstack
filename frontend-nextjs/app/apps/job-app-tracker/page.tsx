"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileDropZone } from "@/components/shared/file-drop-zone";
import { useState } from "react";
import { FileImage } from "lucide-react";
import { AuthDialog } from "@/components/shared/auth-dialog";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { apiRoutes } from "@/lib/api-routes";
import { useMutation } from "@tanstack/react-query";

export default function JobAppTrackerPage() {
  // Destructure the extractText route from apiRoutes
  const { extractText: extractTextRoute } = apiRoutes.jobAppTracker;

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isBreakAll, setIsBreakAll] = useState(false);
  const [textValue, setTextValue] = useState("");
  const { isPending, requireAuth, showAuthModal, setShowAuthModal } =
    useAuthGuard();

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const input = event.target.value;
    setTextValue(input);

    // set flag to break all words on textarea if word length exceeds 30 characters
    // this is to prevent invalid long words from stretching the textareao0;5647
    setIsBreakAll(input.split(" ").some((w) => w.length > 30));
  };

  const handleSubmit = () => {
    // if authentication pending, do not allow submission
    if (isPending) {
      toast.info("Please try again in a few seconds.");
      return;
    }
    requireAuth(() => {
      if (textValue.trim().length > 0) {
        submitTextMutation.mutate(textValue);
      }
      if (uploadedFiles.length > 0) {
        // Handle file submission logic here
        console.log("Files submitted:", uploadedFiles);
        //setUploadedFiles([]); // Clear the uploaded files after submission
      }
    });
  };

  const submitTextMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch(extractTextRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit text");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success("Text submitted successfully!");
      console.log("Response data:", data);
      setTextValue("");
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
      console.error("Error submitting text:", error);
    },
  });

  return (
    <>
      <div className="size-full flex flex-col justify-center gap-y-4 items-center">
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
          Job Application Tracker
        </h1>

        <FileDropZone
          accept={{ "image/*": [] }}
          maxSize={5 * 1024 * 1024} // 5MB
          uploadedFiles={uploadedFiles}
          onFilesChange={(files: File[]) => {
            setUploadedFiles(files);
          }}
          placeholder={
            textValue.trim().length > 0
              ? "Clear text input to upload files instead"
              : "Upload job posting screenshots"
          }
          description={
            textValue.trim().length > 0
              ? "You can either paste job description OR upload screenshots"
              : "Drag & drop or click to browse • Max 5MB per file"
          }
          fileIcon={FileImage}
          disabled={textValue.trim().length > 0}
        />

        <div className="container relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">OR</span>
          </div>
        </div>

        <div className="container flex flex-col gap-y-2">
          <Textarea
            aria-label="job description input box"
            placeholder={
              uploadedFiles.length > 0
                ? "Remove uploaded files to paste job posting instead"
                : "Paste job posting here"
            }
            value={textValue}
            onChange={handleTextareaChange}
            disabled={uploadedFiles.length > 0}
            className={`resize-none h-40 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-neutral-500 break-words ${
              isBreakAll ? "break-all" : "break-words"
            } ${
              uploadedFiles.length > 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />

          <p className="text-xs text-neutral-500">
            Simply copy everything from the job posting page and paste here
          </p>
        </div>
        <Button className="container" onClick={handleSubmit}>
          Submit
        </Button>
      </div>

      {showAuthModal && (
        <AuthDialog open={showAuthModal} onOpenChange={setShowAuthModal} />
      )}

      <Toaster position="top-center" />
    </>
  );
}
