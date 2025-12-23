"use client";

import {
  Feature,
  PluginCard,
} from "@/modules/plugin/ui/components/plugin-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useMutation, useQuery } from "convex/react";
import {
  GlobeIcon,
  Mic2Icon,
  PhoneCallIcon,
  PhoneIcon,
  WorkflowIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import z from "zod";

const vapiFeatures: Feature[] = [
  {
    icon: GlobeIcon,
    label: "Web Voice Call",
    description: "Voice chat directly in your app",
  },
  {
    icon: PhoneIcon,
    label: "Phone Support",
    description: "Get dedicated phone support for your needs",
  },
  {
    icon: PhoneCallIcon,
    label: "Outbound Calls",
    description: "Automated customer outreach via outbound calls",
  },
  {
    icon: WorkflowIcon,
    label: "Workflows",
    description: "Custom conversation workflows",
  },
];

const formSchema = z.object({
  publicApiKey: z.string().min(1, "Public API Key is required"),
  privateApiKey: z.string().min(1, "Private API Key is required"),
});

const VapiPluginForm = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const upsertSecret = useMutation(api.private.secrets.upsert);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publicApiKey: "",
      privateApiKey: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await upsertSecret({
        service: "vapi",
        value: {
          publicApiKey: values.publicApiKey,
          privateApiKey: values.privateApiKey,
        },
      });
      toast.success("VAPI plugin connected successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error connecting VAPI plugin:", error);
      toast.error("Failed to connect VAPI plugin. Please try again.");
    }
  };
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect VAPI Plugin</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Your API keys are securely and safely encrypted and stored using AWS
          Secrets Manager.
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="gap-y-4 flex flex-col"
          >
            <FormField
              control={form.control}
              name="publicApiKey"
              render={({ field }) => (
                <FormItem>
                  <Label className="mb-2">Public API Key</Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your VAPI Public API Key"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="privateApiKey"
              render={({ field }) => (
                <FormItem>
                  <Label className="mb-2">Private API Key</Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your VAPI Private API Key"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Connecting..."
                  : "Connect VAPI Plugin"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const VapiView = () => {
  const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" });
  const [connectOpen, setConnectOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const handleSubmit = () => {
    if (vapiPlugin) {
      setRemoveOpen(true);
    } else {
      setConnectOpen(true);
    }
  };
  return (
    <>
      <VapiPluginForm open={connectOpen} setOpen={setConnectOpen} />
      <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20 p-6 md:p-8">
        <div className="mx-auto w-full max-w-3xl">
          {/* Header Section */}
          <div className="mb-8 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/10 shadow-lg">
                <Mic2Icon className="size-7 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  VAPI Plugin
                </h1>
                <p className="mt-2 text-base text-muted-foreground md:text-lg">
                  Connect to your favorite services using VAPI (Virtual API)
                  specifications for voice call and phone support
                </p>
              </div>
            </div>

            {/* Info Card */}
            <div className="rounded-lg border bg-blue-500/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                  <PhoneIcon className="size-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Voice-Powered Communication
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Enable seamless voice interactions and phone support for
                    your customers with AI-powered conversations
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Plugin Card */}
          <div className="mt-8">
            {vapiPlugin ? (
              <p>Connected!!</p>
            ) : (
              <PluginCard
                serviceImage="/vapi.jpg"
                serviceName="VAPI"
                features={vapiFeatures}
                isDisabled={vapiPlugin === undefined}
                onSubmit={() => handleSubmit()}
              />
            )}
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By connecting, you agree to share necessary data with VAPI
              services
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
