"use client"

import { useAtomValue } from "jotai"

import { AlertTriangleIcon } from "lucide-react"
import { errorMessageAtom } from "@/modules/widget/atoms/widget-atoms"
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header"


export const WidgetErrorScreen = () => {

  const errorMessage = useAtomValue(errorMessageAtom)
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2.5 px-4 py-6 bg-gradient-to-r from-background/50 to-transparent">
          <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text rounded-lg">
            Hi there ! 👋
          </h1>
          <p className="text-base font-medium text-muted-foreground/90">
            Let&apos;s get you started
          </p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <AlertTriangleIcon/>
        <p className="text-sm">{errorMessage || "Invalid Configuration"}</p>
      </div>
    </>
  );
}
