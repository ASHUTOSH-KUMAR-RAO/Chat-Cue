"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useInfinitScroll } from "@workspace/ui/hooks/use-infinite.scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { PublicFile } from "@workspace/backend/private/files";
import { Button } from "@workspace/ui/components/button";
import {
  FileIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { UploadDiaglog } from "../components/upload-dialog";
import { useState } from "react";
import { DeleteFileDialog } from "../components/delete-file-dialog";

export const FilesViews = () => {
  const files = usePaginatedQuery(
    api.private.files.list,
    {},
    { initialNumItems: 10 }
  );

  const {
    canLoadMore,
    handleLoadMore,
    isLoadingFirstPage,
    isLoadingMore,
    topElementRef,
  } = useInfinitScroll({
    status: files.status,
    loadMore: files.loadMore,
    loadSize: 10,
  });

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null);

  const handleDeleteClick = (file: PublicFile) => {
    setSelectedFile(file);
    setDeleteDialogOpen(true);
  };
  const handleFileDeleted = () => {
    setSelectedFile(null);
  };
  return (
    <>
      <DeleteFileDialog
        onOpenChange={setDeleteDialogOpen}
        open={deleteDialogOpen}
        file={selectedFile}
        onDeleted={handleFileDeleted}
      />
      <UploadDiaglog
        onOpenChange={setUploadDialogOpen}
        open={uploadDialogOpen}
      />
      <div className="min-h-screen p-6 md:p-8">
        <div className="mx-auto w-full max-w-screen-2xl">
          {/* Header */}
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Knowledge Base
            </h1>
            <p className="text-muted-foreground">
              Upload and manage documents for your AI assistant
            </p>
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            {/* Actions Bar */}
            <div className="flex items-center justify-end border-b bg-muted/30 px-6 py-4">
              <Button
                className="gap-2 shadow-sm"
                onClick={() => setUploadDialogOpen(true)}
              >
                <PlusIcon className="size-4" />
                Add New
              </Button>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-6 py-4 font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold">
                    Type
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold">
                    Size
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  if (isLoadingFirstPage) {
                    return (
                      <TableRow>
                        <TableCell
                          className="h-32 text-center text-muted-foreground"
                          colSpan={4}
                        >
                          Loading Files...
                        </TableCell>
                      </TableRow>
                    );
                  }
                  if (files.results.length === 0) {
                    return (
                      <TableRow>
                        <TableCell className="h-32 text-center" colSpan={4}>
                          <div className="flex flex-col items-center gap-2">
                            <FileIcon className="size-10 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">
                              No Files Found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }
                  return files.results.map((file) => (
                    <TableRow
                      className="transition-colors hover:bg-muted/50"
                      key={file.id}
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                            <FileIcon className="size-5" />
                          </div>
                          <span className="font-medium">{file.name}</span>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <Badge className="uppercase" variant="secondary">
                          {file.type}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-6 py-4 text-muted-foreground">
                        {file.size}
                      </TableCell>

                      <TableCell className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className="size-8 p-0"
                              size="sm"
                              variant="ghost"
                            >
                              <MoreHorizontalIcon className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteClick(file)}
                            >
                              <TrashIcon className="mr-2 size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ));
                })()}
              </TableBody>
            </Table>

            {/* Infinite Scroll */}
            {!isLoadingFirstPage && files.results.length > 0 && (
              <div className="border-t bg-muted/30">
                <InfiniteScrollTrigger
                  canLoadMore={canLoadMore}
                  isLoadingMore={isLoadingMore}
                  onLoadMore={handleLoadMore}
                  ref={topElementRef}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
