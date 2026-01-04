import { useAtomValue, useSetAtom } from "jotai";
import { screenAtom, widgetSettingsAtom } from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, Check, Copy, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export const WidgetContactScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const phoneNumber = widgetSettings?.vapiSettings?.phoneNumber;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!phoneNumber) {
      return;
    }
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);

      // Haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <WidgetHeader>
        <div className="flex items-center gap-x-3 px-4 py-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScreen("selection")}
            className="h-9 w-9 rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <p className="font-semibold">Contact Us</p>
        </div>
      </WidgetHeader>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 p-6 relative">
        {/* Copy Success Toast */}
        {copied && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-lg">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">
                Phone number copied to clipboard!
              </span>
            </div>
          </div>
        )}
        {/* Phone Icon */}
        <div className="flex items-center justify-center rounded-full border-2 bg-card p-5">
          <Phone className="size-7 text-muted-foreground" />
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-green-500" />
          <p className="text-sm text-muted-foreground">Available 24/7</p>
        </div>

        {/* Phone Number */}
        <p
          className={`font-bold text-2xl tracking-tight transition-all duration-300 ${
            copied ? "scale-110 text-green-600" : ""
          }`}
        >
          {phoneNumber}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="border-t bg-card p-4">
        <div className="flex flex-col gap-2">
          <Button
            className="w-full h-11 rounded-lg transition-all"
            onClick={handleCopy}
            size="lg"
            variant="outline"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 animate-in zoom-in duration-200" />
                <span className="animate-in fade-in slide-in-from-left-2 duration-200">
                  Ready to Call
                </span>
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Number
              </>
            )}
          </Button>
          <Button
            className="w-full h-11 rounded-lg transition-colors"
            size="lg"
            asChild
          >
            <Link href={`tel:${phoneNumber}`}>
              <Phone className="mr-2 h-4 w-4" />
              Call Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
