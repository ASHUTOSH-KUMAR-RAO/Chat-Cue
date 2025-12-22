import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import { ConversationsPanel } from "../components/conversations-panel";

export const ConversationsLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        {/* Left Panel - Conversations List */}
        <ResizablePanel
          defaultSize={30}
          maxSize={40}
          minSize={20}
          className="bg-muted/30"
        >
          <div className="h-full overflow-hidden border-r">
            <ConversationsPanel />
          </div>
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle
          withHandle
          className="w-1 bg-border transition-colors hover:bg-primary/50 active:bg-primary data-[resize-handle-state=drag]:bg-primary"
        />

        {/* Right Panel - Conversation Details */}
        <ResizablePanel defaultSize={70} minSize={50} className="bg-background">
          <div className="h-full w-full overflow-hidden">{children}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
