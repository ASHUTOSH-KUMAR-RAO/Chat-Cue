"use client";

import { useVapi } from "@/modules/widget/hooks/use-vapi";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const {
    isSpeaking,
    isConnecting,
    isConnected,
    transcript,
    startCall,
    endCall,
  } = useVapi();
  return (
    <div className="flex flex-col items-center justify-center min-h-svh max-w-md mx-auto w-full">
      <p>app/widget</p>
      <Button
        onClick={() => startCall()}
        variant="outline"
        className="cursor-pointer hover:animate-bounce"
      >
        Start Call
      </Button>
      <Button
        onClick={() => endCall()}
        variant="destructive"
        className="cursor-pointer hover:animate-bounce"
      >
        End Call
      </Button>

      <p>Is Connected : {`${isConnected}`}</p>
      <p>Is Connecting : {`${isConnecting}`}</p>
      <p>Is Speaking : {`${isSpeaking}`}</p>

      <p>{JSON.stringify(transcript,null,2)}</p>

    </div>
  );
}
