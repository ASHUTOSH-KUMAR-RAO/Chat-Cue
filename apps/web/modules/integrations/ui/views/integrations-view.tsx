"use client";

import { useOrganization } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { CheckIcon, CopyIcon, Eye, EyeOff, Puzzle } from "lucide-react";
import { toast } from "sonner";
import { IntegrationId, INTEGRATIONS } from "../../constants";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useState } from "react";
import { createScript } from "../../utils";

export const IntegrationsView = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState("");
  const [copied, setCopied] = useState(false);
  const [showOrgId, setShowOrgId] = useState(false);
  const { organization } = useOrganization();

  const handleIntegrationClick = (integrationId: IntegrationId) => {
    if (!organization) {
      toast.error("Organization ID not found");
      return;
    }

    const snippets = createScript(integrationId, organization.id);
    setSelectedSnippet(snippets);
    setDialogOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(organization?.id ?? "");
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <>
      <IntegrationsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        snippet={selectedSnippet}
      />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 md:p-8">
        <div className="mx-auto w-full max-w-4xl">
          {/* Header Section */}
          <div className="mb-12 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg ring-1 ring-primary/10">
                <Puzzle className="size-7 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Setup & Integrations
                </h1>
                <p className="mt-2 text-base text-muted-foreground md:text-lg">
                  Choose the integrations that work for you
                </p>
              </div>
            </div>

            {/* Organization ID Section */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="space-y-3">
                <Label
                  htmlFor="organization-id"
                  className="text-base font-semibold"
                >
                  Organization ID
                </Label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Input
                      className="flex-1 bg-muted/50 font-mono text-sm pr-10"
                      id="organization-id"
                      readOnly
                      type={showOrgId ? "text" : "password"}
                      value={organization?.id ?? "Loading..."}
                    />
                    <Button
                      className="absolute right-1 top-1/2 -translate-y-1/2 size-8"
                      onClick={() => setShowOrgId(!showOrgId)}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      {showOrgId ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  </div>
                  <Button
                    className="gap-2 min-w-[100px]"
                    onClick={handleCopy}
                    size="default"
                    variant={copied ? "secondary" : "default"}
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="size-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <CopyIcon className="size-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this ID to identify your organization in integrations
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Integrations Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                Available Integrations
              </h2>
              <p className="text-sm text-muted-foreground">
                Click on any integration to get the code snippet for your
                website
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {INTEGRATIONS.map((integration) => (
                <button
                  key={integration.id}
                  onClick={() => handleIntegrationClick(integration.id)}
                  type="button"
                  className="group flex flex-col items-center gap-3 rounded-lg border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md hover:scale-105 active:scale-100"
                >
                  <div className="flex size-12 items-center justify-center rounded-lg bg-muted/50 transition-colors group-hover:bg-primary/10">
                    <Image
                      alt={integration.title}
                      height={28}
                      src={integration.icon}
                      width={28}
                      className="transition-transform group-hover:scale-110"
                    />
                  </div>
                  <p className="text-sm font-medium text-center">
                    {integration.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const IntegrationsDialog = ({
  onOpenChange,
  open,
  snippet,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  snippet: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Integrate with your website
          </DialogTitle>
          <DialogDescription>
            Follow these steps to add the chatbox to your website
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </span>
              <span className="text-sm font-medium">
                Copy the following code
              </span>
            </div>

            <div className="group relative">
              <pre className="max-h-[300px] overflow-x-auto overflow-y-auto whitespace-pre-wrap break-all rounded-lg border bg-muted p-4 pr-14 font-mono text-xs leading-relaxed">
                <code className="break-all">{snippet}</code>
              </pre>
              <Button
                className="absolute right-3 top-3 size-8 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={handleCopy}
                size="icon"
                variant={copied ? "secondary" : "default"}
              >
                {copied ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </span>
              <span className="text-sm font-medium">
                Add the code to your page
              </span>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Paste the chatbox code in your page. You can add it in the HTML{" "}
                <code className="rounded bg-background px-1.5 py-0.5 font-mono text-xs">
                  &lt;head&gt;
                </code>{" "}
                section or before the closing{" "}
                <code className="rounded bg-background px-1.5 py-0.5 font-mono text-xs">
                  &lt;/body&gt;
                </code>{" "}
                tag.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
