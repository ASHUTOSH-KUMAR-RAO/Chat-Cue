"use client";

import { useAtomValue } from "jotai";
import { WidgetAuthScreen } from "@/modules/widget/ui/screens/widget-auth-screen";
import { screenAtom } from "@/modules/widget/atoms/widget-atoms";
import { WidgetErrorScreen } from "@/modules/widget/ui/screens/widget-screen-error";
import { WidgetLoadingScreen } from "../screens/widget-loading-screen";

interface Props {
  organizationId: string | null;
}

const WidgetView = ({ organizationId }: Props) => {

  const screen = useAtomValue(screenAtom)

  const screenComponent = {
    error:<WidgetErrorScreen/>,
    loading:<WidgetLoadingScreen organizationId={organizationId}/>,
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
