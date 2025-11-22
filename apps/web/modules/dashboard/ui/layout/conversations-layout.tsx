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
    <ResizablePanelGroup className="h-full flex-1" direction="horizontal">
      <ResizablePanel
        defaultSize={25}
        maxSize={35}
        minSize={20}
        className="border-r"
      >
        <ConversationsPanel />
      </ResizablePanel>

      <ResizableHandle withHandle className="hover:bg-accent/50" />

      <ResizablePanel defaultSize={75} minSize={50}>
        <div className="h-full w-full">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
