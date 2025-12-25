"use client";

import { useVapiAssistants } from "../../hooks/use-vapi-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Loader2Icon, BotIcon } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";

export const VapiAssistantsTabs = () => {
  const { data: assistants, isLoading } = useVapiAssistants();

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-6 py-4 font-semibold">Assistant</TableHead>
            <TableHead className="px-6 py-4 font-semibold">Model</TableHead>
            <TableHead className="px-6 py-4 font-semibold">
              First Message
            </TableHead>
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
                        Loading assistants...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              );
            }

            if (!assistants || assistants.length === 0) {
              return (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                        <BotIcon className="size-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">No assistants found</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Please add assistants in the VAPI dashboard
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            }

            return assistants.map((assistant, index) => (
              <TableRow
                className="transition-colors hover:bg-muted/50"
                key={assistant.id}
                style={{
                  animation: `fadeIn 0.3s ease-in ${index * 0.05}s backwards`,
                }}
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/10">
                      <BotIcon className="size-5 text-purple-600" />
                    </div>
                    <span className="font-semibold">
                      {assistant.name || "Unnamed Assistant"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-4">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {assistant.model?.model || "Not Configured"}
                  </Badge>
                </TableCell>

                <TableCell className="max-w-xs px-6 py-4">
                  <p className="max-w-md truncate text-sm text-muted-foreground">
                    {assistant.firstMessage || "No first message set"}
                  </p>
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
