import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HoverGallery, HOVER_GALLERY_MAX_IMAGES } from "./hover-gallery";

const images = [
  { src: "/hat-1.webp", alt: "Classic cap, front" },
  { src: "/hat-2.webp", alt: "Classic cap, side" },
  { src: "/hat-3.webp", alt: "Classic cap, back" },
  { src: "/hat-4.webp", alt: "Classic cap, detail" },
];

describe("HoverGallery", () => {
  it("shows the images and names the gallery from the first alt text", () => {
    render(<HoverGallery images={images} className="max-w-60" />);

    const gallery = screen.getByRole("img", { name: "Classic cap, front" });
    expect(gallery.tagName).toBe("FIGURE");
    expect(gallery).toHaveClass("withy-hover-gallery", "max-w-60");

    const pics = gallery.querySelectorAll("img");
    expect(pics).toHaveLength(4);
    expect(pics[0]).toHaveAttribute("src", "/hat-1.webp");
    expect(pics[3]).toHaveAttribute("src", "/hat-4.webp");
    for (const pic of pics) {
      expect(pic).toHaveAttribute("alt", "");
    }
  });

  it("uses an explicit label when given", () => {
    render(<HoverGallery images={images} label="Product photos" />);
    expect(screen.getByRole("img", { name: "Product photos" })).toBeInTheDocument();
  });

  it("renders nothing without images", () => {
    const { container } = render(<HoverGallery images={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it(`keeps at most ${HOVER_GALLERY_MAX_IMAGES} images`, () => {
    const many = Array.from({ length: HOVER_GALLERY_MAX_IMAGES + 3 }, (_, index) => ({
      src: `/photo-${index}.webp`,
      alt: `Photo ${index + 1}`,
    }));
    render(<HoverGallery images={many} />);

    const gallery = screen.getByRole("img", { name: "Photo 1" });
    expect(gallery.querySelectorAll("img")).toHaveLength(HOVER_GALLERY_MAX_IMAGES);
  });
});
