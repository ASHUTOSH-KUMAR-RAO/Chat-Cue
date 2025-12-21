"use client";

import { api } from "@workspace/backend/_generated/api";
import type { PublicFile } from "@workspace/backend/private/files";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useMutation } from "convex/react";
import { useState } from "react";
import { AlertTriangleIcon, FileIcon, Loader2Icon } from "lucide-react";

export const DeleteFileDialog = ({
  file,
  onOpenChange,
  open,
  onDeleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: PublicFile | null;
  onDeleted?: () => void;
}) => {
  const deleteFile = useMutation(api.private.files.deleteFile);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!file) {
      return;
    }
    setIsDeleting(true);

    try {
      await deleteFile({
        entryId: file.id,
      });
      onDeleted?.();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10">
              <AlertTriangleIcon className="size-6 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-xl">Delete File</DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {file && (
          <div className="py-2">
            <div className="rounded-lg border-2 border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
                  <FileIcon className="size-5 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="uppercase font-medium">{file.type}</span>
                    {" • "}
                    {file.size}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Are you sure you want to delete this file? This will permanently
              remove the document from your knowledge base.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            disabled={isDeleting || !file}
            onClick={handleDelete}
            variant="destructive"
            className="gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete File"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
