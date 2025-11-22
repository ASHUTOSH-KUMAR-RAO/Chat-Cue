import Image from "next/image";

export const ConversationsView = () => {
  return (
    <div className="flex h-full flex-1 flex-col gap-y-4 bg-gray-950">
      <div className="flex flex-1 items-center justify-center gap-x-2">
          <Image
            src="/avatar.svg"
            alt="Logo"
            width={40}
            height={40}
            className="opacity-50"
          />
          <p className="font-semibold  text-lg text-muted-foreground">
            Chat-Cue
          </p>
      </div>
    </div>
  );
};
