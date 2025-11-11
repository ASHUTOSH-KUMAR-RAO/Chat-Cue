"use client";

import { useAtomValue } from "jotai";
import { WidgetAuthScreen } from "@/modules/widget/ui/screens/widget-auth-screen";
import { screenAtom } from "@/modules/widget/atoms/widget-atoms";

interface Props {
  organizationId: string;
}

const WidgetView = ({ organizationId }: Props) => {

  const screen = useAtomValue(screenAtom)

  const screenComponent = {
    error: <p>Todo: Error</p>,
    loading: <p>Todo Loading</p>,
    auth: <WidgetAuthScreen />,
    voice: <p>Todo voice</p>,
    inbox: <p>Todo inbox</p>,
    selection: <p>Todo:Selection</p>,
    chat: <p>Todo: Chat</p>,
    contact: <p>Todo: Contact</p>,
  };
  return (
    <main className="min-h-screen min-w-screen flex flex-col overflow-hidden rounded-xl h-full w-full border border-border/50 bg-gradient-to-br from-muted via-muted/95 to-muted/90 shadow-xl">
        {screenComponent[screen]}
    </main>
  );
};

export default WidgetView;
