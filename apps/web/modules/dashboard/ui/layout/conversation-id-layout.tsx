import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import React from "react";
import { ContactPanel } from "../components/contact-pannel";

export const ConversationIdLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ResizablePanelGroup
      className="h-full w-full flex-1"
      direction="horizontal"
    >
      {/* Main Chat Area */}
      <ResizablePanel
        defaultSize={70}
        minSize={50}
        maxSize={85}
        className="h-full"
      >
        <div className="flex h-full w-full flex-col">{children}</div>
      </ResizablePanel>

      {/* Resizable Handle - Only visible on larger screens */}
      <ResizableHandle
        className="hidden w-1 bg-border hover:bg-primary/20 transition-colors lg:flex"
        withHandle
      />

      <ResizablePanel
        defaultSize={30}
        minSize={15}
        maxSize={50}
        className="hidden lg:block"
      >
        <div className="h-full w-full border-l bg-background/50 p-4">
        <ContactPanel/>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
