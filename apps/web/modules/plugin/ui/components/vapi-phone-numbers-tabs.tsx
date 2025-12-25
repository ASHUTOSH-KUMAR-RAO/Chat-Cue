"use client";

import { Badge } from "@workspace/ui/components/badge";
import { useVapiPhoneNumbers } from "../../hooks/use-vapi-data";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  CheckCircleIcon,
  PhoneIcon,
  XCircleIcon,
  Loader2Icon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import { useState } from "react";

export const VapiPhoneNumbersTabs = () => {
  const { data: phoneNumbers, isLoading } = useVapiPhoneNumbers();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Phone number copied!", {
        description: text,
        duration: 2000,
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
      toast.error("Failed to copy", {
        description: "Please try again",
      });
    }
  };

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-6 py-4 font-semibold">
              Phone Number
            </TableHead>
            <TableHead className="px-6 py-4 font-semibold">Name</TableHead>
            <TableHead className="px-6 py-4 font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(() => {
            if (isLoading) {
              return (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2Icon className="size-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Loading phone numbers...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              );
            }

            if (!phoneNumbers || phoneNumbers.length === 0) {
              return (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                        <PhoneIcon className="size-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">No phone numbers found</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Please add phone numbers in the VAPI dashboard
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            }

            return phoneNumbers.map((phone, index) => (
              <TableRow
                className="group transition-colors hover:bg-muted/50"
                key={phone.id}
                style={{
                  animation: `fadeIn 0.3s ease-in ${index * 0.05}s backwards`,
                }}
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <PhoneIcon className="size-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">
                        {phone.number || "Not Configured"}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(phone.number || "", phone.id)
                        }
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-muted rounded-md"
                        title="Copy phone number"
                      >
                        {copiedId === phone.id ? (
                          <CheckIcon className="size-4 text-green-600" />
                        ) : (
                          <CopyIcon className="size-4 text-muted-foreground hover:text-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-4">
                  <span className="font-medium">
                    {phone.name || "Unnamed Number"}
                  </span>
                </TableCell>

                <TableCell className="px-6 py-4">
                  <Badge
                    className="gap-1.5 capitalize font-medium"
                    variant={
                      phone.status === "active" ? "default" : "destructive"
                    }
                  >
                    {phone.status === "active" && (
                      <CheckCircleIcon className="size-3" />
                    )}
                    {phone.status !== "active" && (
                      <XCircleIcon className="size-3" />
                    )}
                    {phone.status || "unknown"}
                  </Badge>
                </TableCell>
              </TableRow>
            ));
          })()}
        </TableBody>
      </Table>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
