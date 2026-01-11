"use client";
import { getCountryFlagUrl, getCountryFromTimezone } from "@/lib/country-utils";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import Bowser from "bowser";
import { useQuery } from "convex/react";
import {
  GlobeIcon,
  MailIcon,
  MonitorIcon,
  ClockIcon,
  ExternalLinkIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { toast } from "sonner";

type InfoItem = {
  label: string;
  value: string | React.ReactNode;
  className?: string;
  copyable?: boolean;
};

type InfoSection = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: InfoItem[];
};

export const ContactPanel = () => {
  const params = useParams();
  const conversationId = params.conversationId as Id<"conversations">;
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const contactSession = useQuery(
    api.private.contactSession.getOneByConversationId,
    {
      conversationId,
    }
  );

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const parseUserAgent = useMemo(() => {
    return (userAgent?: string) => {
      if (!userAgent) {
        return { browser: "Unknown", os: "Unknown", device: "Unknown" };
      }
      const browser = Bowser.getParser(userAgent);
      const result = browser.getResult();
      return {
        browser: result.browser.name || "Unknown",
        browserVersion: result.browser.version || "",
        os: result.os.name || "Unknown",
        osVersion: result.os.version || "",
        device: result.platform.type || "desktop",
        deviceVendor: result.platform.vendor || "",
        deviceModel: result.platform.model || "",
      };
    };
  }, []);

  const userAgentInfo = useMemo(
    () => parseUserAgent(contactSession?.metadata?.userAgent),
    [contactSession?.metadata?.userAgent, parseUserAgent]
  );

  const countryInfo = useMemo(() => {
    return getCountryFromTimezone({
      timezone: contactSession?.metadata?.timezone,
    });
  }, [contactSession?.metadata?.timezone]);

  const accordionSection = useMemo<InfoSection[]>(() => {
    if (!contactSession?.metadata) {
      return [];
    }

    const metadata = contactSession.metadata;

    return [
      {
        id: "device-info",
        icon: MonitorIcon,
        title: "Device Information",
        items: [
          {
            label: "Browser",
            value:
              userAgentInfo.browser +
              (userAgentInfo.browserVersion
                ? ` ${userAgentInfo.browserVersion}`
                : ""),
          },
          {
            label: "Operating System",
            value:
              userAgentInfo.os +
              (userAgentInfo.osVersion ? ` ${userAgentInfo.osVersion}` : ""),
          },
          {
            label: "Device Type",
            value:
              userAgentInfo.device +
              (userAgentInfo.deviceModel
                ? ` ${userAgentInfo.deviceModel}`
                : ""),
            className: "capitalize",
          },
          ...(metadata.platform
            ? [{ label: "Platform", value: metadata.platform }]
            : []),
          ...(metadata.vendor
            ? [{ label: "Vendor", value: metadata.vendor }]
            : []),
          ...(metadata.screenResolution
            ? [
                {
                  label: "Screen Resolution",
                  value: metadata.screenResolution,
                },
              ]
            : []),
          ...(metadata.viewportSize
            ? [{ label: "Viewport Size", value: metadata.viewportSize }]
            : []),
          ...(metadata.cookieEnabled !== undefined
            ? [
                {
                  label: "Cookies Enabled",
                  value: metadata.cookieEnabled ? "Yes" : "No",
                },
              ]
            : []),
        ],
      },
      {
        id: "location-info",
        icon: GlobeIcon,
        title: "Location & Language",
        items: [
          ...(countryInfo
            ? [
                {
                  label: "Country",
                  value: (
                    <div className="flex items-center gap-2">
                      <span>{countryInfo.name}</span>
                      {countryInfo.code && (
                        <img
                          src={
                            getCountryFlagUrl({
                              countryCode: countryInfo.code,
                            }) ?? undefined
                          }
                          alt={countryInfo.name}
                          className="size-4 rounded-sm"
                        />
                      )}
                    </div>
                  ),
                },
              ]
            : []),
          ...(metadata.language
            ? [
                {
                  label: "Primary Language",
                  value: metadata.language.toUpperCase(),
                },
              ]
            : []),
          ...(metadata.languages
            ? [{ label: "Languages", value: metadata.languages }]
            : []),
          ...(metadata.timezone
            ? [
                {
                  label: "Timezone",
                  value: metadata.timezone,
                  copyable: true,
                },
              ]
            : []),
          ...(metadata.timezoneOffset !== undefined
            ? [
                {
                  label: "UTC Offset",
                  value: `UTC ${metadata.timezoneOffset > 0 ? "+" : ""}${metadata.timezoneOffset / 60}`,
                },
              ]
            : []),
        ],
      },
      {
        id: "browsing-info",
        icon: ClockIcon,
        title: "Browsing Context",
        items: [
          ...(metadata.currentUrl
            ? [
                {
                  label: "Current Page",
                  value: (
                    <a
                      href={metadata.currentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <span className="max-w-[200px] truncate">
                        {metadata.currentUrl}
                      </span>
                      <ExternalLinkIcon className="size-3 shrink-0" />
                    </a>
                  ),
                },
              ]
            : []),
          ...(metadata.referrer
            ? [
                {
                  label: "Referrer",
                  value: (
                    <a
                      href={metadata.referrer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <span className="max-w-[200px] truncate">
                        {metadata.referrer}
                      </span>
                      <ExternalLinkIcon className="size-3 shrink-0" />
                    </a>
                  ),
                },
              ]
            : []),
        ],
      },
    ].filter((section) => section.items.length > 0);
  }, [contactSession, userAgentInfo, countryInfo]);

  if (contactSession === undefined || contactSession === null) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">Loading contact info...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Contact Header */}
      <div className="shrink-0 border-b bg-card p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <DicebearAvatar
              seed={contactSession._id}
              badgeImageUrl={
                countryInfo?.code
                  ? getCountryFlagUrl({ countryCode: countryInfo.code })
                  : undefined
              }
              size={48}
              className="ring-2 ring-border"
            />
          </div>

          <div className="flex-1 overflow-hidden">
            <h4 className="truncate font-semibold">{contactSession.name}</h4>
            <div className="mt-1 flex items-center gap-2">
              <p className="truncate text-sm text-muted-foreground">
                {contactSession.email}
              </p>
              <button
                onClick={() => copyToClipboard(contactSession.email, "Email")}
                className="shrink-0 rounded p-1 hover:bg-muted"
              >
                {copiedText === contactSession.email ? (
                  <CheckIcon className="size-3 text-green-600" />
                ) : (
                  <CopyIcon className="size-3 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        <Button className="mt-4 w-full gap-2" asChild size="lg">
          <Link href={`mailto:${contactSession.email}`}>
            <MailIcon className="size-4" />
            <span>Send Email</span>
          </Link>
        </Button>
      </div>

      {/* Metadata Accordion */}
      <div className="flex-1 overflow-y-auto">
        {contactSession.metadata && (
          <Accordion
            className="w-full"
            collapsible
            type="single"
            defaultValue="device-info"
          >
            {accordionSection.map((section) => (
              <AccordionItem
                className="border-b"
                key={section.id}
                value={section.id}
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                      <section.icon className="size-4 text-primary" />
                    </div>
                    <span className="font-semibold">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3">
                    {section.items.map((item, index) => (
                      <div
                        className="flex items-start justify-between gap-4 rounded-lg bg-muted/30 p-3"
                        key={`${section.id}-${item.label}-${index}`}
                      >
                        <span className="text-sm font-medium text-muted-foreground">
                          {item.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${item.className || ""}`}
                          >
                            {item.value}
                          </span>
                          {item.copyable && typeof item.value === "string" && (
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  item.value as string,
                                  item.label
                                )
                              }
                              className="shrink-0 rounded p-1 hover:bg-muted"
                            >
                              {copiedText === item.value ? (
                                <CheckIcon className="size-3 text-green-600" />
                              ) : (
                                <CopyIcon className="size-3 text-muted-foreground" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};
