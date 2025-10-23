"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import {
  CreditCardIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
  Mic,
  PaletteIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const customerSupportItems = [
  {
    title: "Conversations",
    url: "/conversations",
    icon: InboxIcon,
  },
  {
    title: "Knowledge Base",
    url: "/files",
    icon: LibraryBigIcon,
  },
];

const configurationItems = [
  {
    title: "Widget Customization",
    url: "/customization",
    icon: PaletteIcon,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Voice Assistants",
    url: "/plugins/vapi",
    icon: Mic,
  },
];

const accounts = [
  {
    title: "Plans & Billing",
    url: "/billing",
    icon: CreditCardIcon,
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(url);
  };

  return (
    <Sidebar className="group border-r border-border/40" collapsible="icon">
      <SidebarHeader className="border-b border-border/40 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="hover:bg-accent/50 transition-all duration-200">
              <OrganizationSwitcher
                appearance={{
                  elements: {
                    rootBox: "w-full! h-9!",
                    avatarBox: "size-5! rounded-md! ring-2! ring-primary/10!",
                    organizationSwitcherTrigger:
                      "w-full! justify-start! rounded-lg! group-data-[collapsed=icon]:size-9! group-data-[collapsed=icon]:p-2! transition-all! duration-200!",
                    organizationPreview:
                      "group-data-[collapsed=icon]:justify-center! gap-2.5!",
                    organizationPreviewTextContainer:
                      "group-data-[collapsed=icon]:hidden! text-sm! font-semibold! text-sidebar-foreground!",
                    organizationSwitcherTriggerIcon:
                      "group-data-[collapsed=icon]:hidden! ml-auto! text-sidebar-foreground/60! transition-transform! group-hover:translate-x-0.5!",
                  },
                }}
                hidePersonal
                skipInvitationScreen
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Customer Support */}
        <SidebarGroup className="mb-4">
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2 px-2">
            Customer Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {customerSupportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                    className="h-10 rounded-lg transition-all duration-200 hover:bg-accent/80 hover:scale-[1.02] active:scale-[0.98] data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-sm"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuration */}
        <SidebarGroup className="mb-4">
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2 px-2">
            Configuration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {configurationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                    className="h-10 rounded-lg transition-all duration-200 hover:bg-accent/80 hover:scale-[1.02] active:scale-[0.98] data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-sm"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Accounts */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2 px-2">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {accounts.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                    className="h-10 rounded-lg transition-all duration-200 hover:bg-accent/80 hover:scale-[1.02] active:scale-[0.98] data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-sm"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="hover:bg-accent/80 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserButton
                showName
                appearance={{
                  elements: {
                    rootBox: "w-full! h-10!",
                    userButtonTrigger:
                      "w-full! p-2.5! rounded-lg! hover:bg-transparent! transition-all! duration-200! group-data-[collapsed=icon]:size-10! group-data-[collapsed=icon]:p-2!",
                    userButtonBox:
                      "w-full! flex-row-reverse! justify-end! gap-3! group-data-[collapsed=icon]:justify-center! text-sidebar-foreground!",
                    userButtonOuterIdentifier:
                      "pl-0! font-medium! text-sm! group-data-[collapsed=icon]:!hidden!",
                    avatarBox: "size-6! ring-2! ring-primary/10!",
                  },
                }}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
