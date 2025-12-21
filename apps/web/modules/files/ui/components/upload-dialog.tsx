import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";

import { Input } from "@workspace/ui/components/input";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@workspace/ui/components/dropzone";
import { useAction } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";

export const UploadDiaglog = ({
  open,
  onOpenChange,
  onFileUploaded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUploaded?: () => void;
}) => {
  const addFile = useAction(api.private.files.addFile);

  const [uploadFile, setUploadFile] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    category: "",
    filename: "",
  });

  const handleFileDrop = (acceptedFile: File[]) => {
    const file = acceptedFile[0];

    if (file) {
      setUploadFile([file]);
      if (!uploadForm.filename) {
        setUploadForm((prev) => ({ ...prev, filename: file.name }));
      }
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const blob = uploadFile[0];
      if (!blob) {
        return;
      }

      const filename = uploadForm.filename || blob.name;

      await addFile({
        bytes: await blob.arrayBuffer(),
        filename,
        mimeType: blob.type || "text/plain",
        category: uploadForm.category,
      });
      onFileUploaded?.();
      handleCancel();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setUploadFile([]);
    setUploadForm({
      category: "",
      filename: "",
    });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upload Document</DialogTitle>
          <DialogDescription className="text-base">
            Upload documents to your knowledge base for AI-powered search and
            retrieval
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Input
              className="h-11"
              id="category"
              onChange={(e) => {
                setUploadForm((prev) => ({
                  ...prev,
                  category: e.target.value,
                }));
              }}
              placeholder="e.g: Document, Support, Report..."
              type="text"
              value={uploadForm.category}
            />
          </div>

          {/* Filename */}
          <div className="space-y-2">
            <Label htmlFor="filename" className="text-sm font-medium">
              File Name{" "}
              <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <Input
              className="h-11"
              id="filename"
              onChange={(e) => {
                setUploadForm((prev) => ({
                  ...prev,
                  filename: e.target.value,
                }));
              }}
              placeholder="Override default filename"
              type="text"
              value={uploadForm.filename}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Document</Label>
            <Dropzone
              accept={{
                "application/pdf": [".pdf"],
                "text/csv": [".csv"],
                "text/plain": [".txt"],
              }}
              disabled={isUploading}
              maxFiles={1}
              onDrop={handleFileDrop}
              src={uploadFile}
              className="min-h-[200px] rounded-lg border-2 border-dashed transition-colors hover:border-primary/50 hover:bg-muted/50"
            >
              <DropzoneContent />
              <DropzoneEmptyState />
            </Dropzone>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            disabled={isUploading}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            disabled={
              uploadFile.length === 0 || isUploading || !uploadForm.category
            }
            onClick={handleUpload}
            className="shadow-sm"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
