import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  accentSwatches,
  brandSwatches,
  graySwatches,
  inkSwatches,
  type Swatch,
} from "../lib/palette";

function Swatches({ swatches }: { swatches: Swatch[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {swatches.map((swatch) => (
        <div key={swatch.name} className="flex items-center gap-3">
          <span
            className="size-10 rounded-sm border border-border"
            style={{ background: swatch.hex }}
          />
          <span>
            <span className="block text-[13px] font-medium text-heading">{swatch.name}</span>
            <span className="block font-inter text-[11px] tracking-[0.4px] text-text-3 uppercase">
              {swatch.hex}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: "Foundations/Color",
  component: Swatches,
} satisfies Meta<typeof Swatches>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Brand: Story = { args: { swatches: brandSwatches } };
export const Ink: Story = { args: { swatches: inkSwatches } };
export const Gray: Story = { args: { swatches: graySwatches } };
export const Accents: Story = { args: { swatches: accentSwatches } };
