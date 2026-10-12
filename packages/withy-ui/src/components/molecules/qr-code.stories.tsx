import type { Meta, StoryObj } from "@storybook/react-vite";
import { QrCode } from "./qr-code";

const meta = {
  title: "Molecules/QR code",
  component: QrCode,
  tags: ["autodocs"],
  args: {
    value: "https://withy.dev",
    level: "M",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A QR code turns a link or a short text into a code a phone camera can scan. Cover it while it loads, after a scan, or when it expires.",
      },
    },
  },
} satisfies Meta<typeof QrCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { status: "loading" },
};

export const Scanned: Story = {
  args: { status: "success" },
};

export const Expired: Story = {
  args: {
    status: "expired",
    onRefresh: () => {},
  },
};

export const OnABrandPanel: Story = {
  render: (args) => (
    <div className="inline-flex rounded-sm bg-brand p-4">
      <QrCode {...args} className="border-0 bg-transparent text-white" />
    </div>
  ),
};
