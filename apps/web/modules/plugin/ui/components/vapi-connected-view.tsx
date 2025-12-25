import { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import {
  BotIcon,
  PhoneIcon,
  SettingsIcon,
  UnplugIcon,
  CheckCircle2Icon,
} from "lucide-react";
import Link from "next/link";
import { VapiPhoneNumbersTabs } from "./vapi-phone-numbers-tabs";
import { VapiAssistantsTabs } from "./vapi-assistant-tabs";

interface VapiConnectedViewProps {
  onDisconnect: () => void;
}

export const VapiConnectedView = ({ onDisconnect }: VapiConnectedViewProps) => {
  const [activeTab, setActiveTab] = useState("phone-numbers");

  return (
    <div className="space-y-6">
      {/* Connection Status Card */}
      <Card className="overflow-hidden border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {/* Vapi Logo with Animation */}
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-xl bg-primary/20 blur-lg" />
                <div className="relative flex size-14 items-center justify-center overflow-hidden rounded-xl border-2 border-primary/20 bg-background shadow-lg">
                  <Image
                    alt="Vapi"
                    height={40}
                    width={40}
                    className="rounded-lg object-contain p-1"
                    src="/vapi.jpg"
                  />
                </div>
              </div>

              {/* Title and Description */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl">Vapi Integration</CardTitle>
                  <div className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5">
                    <CheckCircle2Icon className="size-3 text-green-600" />
                    <span className="text-xs font-medium text-green-600">
                      Connected
                    </span>
                  </div>
                </div>
                <CardDescription className="mt-1">
                  Manage your phone numbers and AI assistants connected via Vapi
                </CardDescription>
              </div>
            </div>

            {/* Disconnect Button */}
            <Button
              onClick={onDisconnect}
              size="sm"
              variant="destructive"
              className="gap-2 shadow-sm"
            >
              <UnplugIcon className="size-4" />
              Disconnect
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Widget Configuration Card */}
      <Card className="overflow-hidden shadow-md transition-shadow hover:shadow-lg">
        <CardHeader className="bg-muted/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {/* Settings Icon */}
              <div className="flex size-12 items-center justify-center rounded-xl border bg-gradient-to-br from-blue-500/10 to-blue-500/5 shadow-sm">
                <SettingsIcon className="size-6 text-blue-600" />
              </div>

              {/* Title and Description */}
              <div className="flex-1">
                <CardTitle className="text-lg">Widget Configure</CardTitle>
                <CardDescription className="mt-1">
                  Set up voice call and phone support widgets for your website
                </CardDescription>
              </div>
            </div>

            {/* Configure Button */}
            <Button asChild className="gap-2 shadow-sm">
              <Link href="/customization">
                <SettingsIcon className="size-4" />
                Configure
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs Section */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-lg">
        <Tabs
          className="gap-0"
          defaultValue="phone-numbers"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          {/* Tab Headers */}
          <TabsList className="grid h-14 w-full grid-cols-2 gap-0 rounded-none border-b bg-muted/30 p-0">
            <TabsTrigger
              className="h-full gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:shadow-sm"
              value="phone-numbers"
            >
              <PhoneIcon className="size-4" />
              <span className="font-semibold">Phone Numbers</span>
            </TabsTrigger>
            <TabsTrigger
              className="h-full gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:shadow-sm"
              value="assistants"
            >
              <BotIcon className="size-4" />
              <span className="font-semibold">AI Assistants</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="phone-numbers" className="m-0">
            <VapiPhoneNumbersTabs />
          </TabsContent>

          <TabsContent value="assistants" className="m-0">
            <VapiAssistantsTabs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
