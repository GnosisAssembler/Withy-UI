import * as React from "react";
import { cn } from "../../lib/cn";

export const HOVER_GALLERY_MAX_IMAGES = 10;

export type HoverGalleryImage = {
  src: string;
  alt: string;
};

export type HoverGalleryProps = Omit<React.ComponentProps<"figure">, "children"> & {
  /** Images shown left to right on hover. The first is visible by default. Up to 10. */
  images: readonly HoverGalleryImage[];
  /** Accessible name for the gallery. Defaults to the first image's alt text. */
  label?: string;
};

export function HoverGallery({ images, label, className, ...props }: HoverGalleryProps) {
  const shown = images.slice(0, HOVER_GALLERY_MAX_IMAGES);
  const name = label ?? shown[0]?.alt;

  if (shown.length === 0) return null;

  return (
    <figure
      role="img"
      aria-label={name}
      className={cn("withy-hover-gallery rounded-sm bg-muted", className)}
      {...props}
    >
      {shown.map((image, index) => (
        <img key={`${image.src}-${index}`} src={image.src} alt="" draggable={false} />
      ))}
    </figure>
  );
}
