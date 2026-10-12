import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormField } from "./form-field";
import { InlineMessage } from "./inline-message";
import { InputOtp } from "./input-otp";

const meta = {
  title: "Molecules/Input OTP",
  component: InputOtp,
  tags: ["autodocs"],
  args: {
    "aria-label": "Verification code",
  },
  parameters: {
    docs: {
      description: {
        component:
          "An input OTP takes a one-time code, one character per slot. Paste and autofill fill the whole code.",
      },
    },
  },
} satisfies Meta<typeof InputOtp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Code: Story = {};

export const Examples: Story = {
  render: () => <ExamplesGallery />,
};

function ExamplesGallery() {
  const [code, setCode] = React.useState("");
  const [received, setReceived] = React.useState(false);

  return (
    <div className="grid max-w-sm gap-4">
      <FormField label="Verification code" hint="Enter the 6-digit code from your email.">
        <InputOtp
          value={code}
          onValueChange={(next) => {
            setCode(next);
            setReceived(false);
          }}
          onComplete={() => setReceived(true)}
        />
      </FormField>
      {received ? <InlineMessage tone="success">Code received.</InlineMessage> : null}
      <FormField label="Backup code" hint="Letters and digits from your recovery card.">
        <InputOtp length={8} groups={[4, 4]} pattern="alphanumeric" />
      </FormField>
      <FormField label="Sign-in code" error="Enter the 6-digit code from your email.">
        <InputOtp defaultValue="123" groups={[3, 3]} />
      </FormField>
      <FormField label="Saved code">
        <InputOtp defaultValue="123456" mask disabled />
      </FormField>
    </div>
  );
}
