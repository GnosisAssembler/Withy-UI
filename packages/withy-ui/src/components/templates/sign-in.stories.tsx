import type { Meta, StoryObj } from "@storybook/react-vite";
import { SignInTemplate } from "./sign-in";

const meta = {
  title: "Templates/Sign in",
  component: SignInTemplate,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Auth template. Composes Logo, FormField, Input, Checkbox, and Button on a split canvas.",
      },
    },
  },
} satisfies Meta<typeof SignInTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SignUp: Story = {
  args: { mode: "sign-up" },
};
