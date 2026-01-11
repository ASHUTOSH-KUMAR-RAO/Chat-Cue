"use client";

import { glass } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Avatar, AvatarImage } from "@workspace/ui/components/avatar";
import { useMemo } from "react";
import { cn } from "@workspace/ui/lib/utils";

interface DicebearAvatarProps {
  seed: string;
  size?: number;
  className?: string;
  badgeClassName?: string;
  imageUrl?: string;
  badgeImageUrl?: string | null | undefined; // ✅ Explicit type
  showBorder?: boolean;
  borderColor?: string;
  badgePosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  badgeSize?: number;
  alt?: string;
  loading?: "eager" | "lazy";
}

export const DicebearAvatar = ({
  seed,
  badgeClassName,
  badgeImageUrl,
  className,
  imageUrl,
  size = 32,
  showBorder = true,
  borderColor = "border-border",
  badgePosition = "bottom-right",
  badgeSize,
  alt,
  loading = "lazy",
}: DicebearAvatarProps) => {
  const avatarSrc = useMemo(() => {
    if (imageUrl) {
      return imageUrl;
    }

    const avatar = createAvatar(glass, {
      seed: seed.toLowerCase().trim(),
      size,
    });

    return avatar.toDataUri();
  }, [seed, size, imageUrl]);

  const calculatedBadgeSize = badgeSize ?? Math.round(size * 0.4);

  const badgePositionClasses = {
    "top-right": "top-0 right-0 translate-x-[20%] -translate-y-[20%]",
    "top-left": "top-0 left-0 -translate-x-[20%] -translate-y-[20%]",
    "bottom-right": "bottom-0 right-0 translate-x-[20%] translate-y-[20%]",
    "bottom-left": "bottom-0 left-0 -translate-x-[20%] translate-y-[20%]",
  };

  // ✅ Validate badge URL
  const shouldShowBadge =
    badgeImageUrl &&
    typeof badgeImageUrl === "string" &&
    badgeImageUrl.length > 0;

  return (
    <div
      className="relative inline-block"
      style={{ width: size, height: size }}
      role="img"
      aria-label={alt || `Avatar for ${seed}`}
    >
      <Avatar
        className={cn(
          "transition-all duration-200 hover:ring-2 hover:ring-primary/20",
          showBorder && borderColor,
          className
        )}
        style={{ width: size, height: size }}
      >
        <AvatarImage
          alt={alt || `Avatar for ${seed}`}
          src={avatarSrc}
          loading={loading}
          className="object-cover"
        />
      </Avatar>

      {shouldShowBadge && (
        <div
          className={cn(
            "absolute flex items-center justify-center overflow-hidden rounded-full border-2 border-background bg-background shadow-sm transition-transform hover:scale-110",
            badgePositionClasses[badgePosition],
            badgeClassName
          )}
          style={{
            width: calculatedBadgeSize,
            height: calculatedBadgeSize,
          }}
          role="img"
          aria-label="Badge"
        >
          <img
            alt="Badge"
            className="h-full w-full object-cover"
            height={calculatedBadgeSize}
            width={calculatedBadgeSize}
            src={badgeImageUrl}
            loading={loading}
            onError={(e) => {
              // ✅ Handle image load errors
              console.error("Badge image failed to load:", badgeImageUrl);
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
};
