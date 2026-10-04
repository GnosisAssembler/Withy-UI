import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "@/components/atoms/checkbox";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Radio, RadioGroup } from "@/components/atoms/radio-group";
import { Switch } from "@/components/atoms/switch";
import { Textarea } from "@/components/atoms/textarea";
import { FormField } from "@/components/molecules/form-field";
import { SearchInput } from "@/components/molecules/search-input";
import { Select } from "@/components/molecules/select";

const meta = {
  title: "Molecules/Controls",
  component: FormField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Form controls are atoms. FormField, SearchInput, and Select group them into molecules.",
      },
    },
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fields: Story = {
  args: { label: "Email", htmlFor: "story-email", children: null },
  render: () => (
    <div className="grid max-w-md gap-4">
      <FormField
        label="Email"
        htmlFor="story-email"
        hint="We will only use this for the workspace."
      >
        <Input id="story-email" placeholder="ivy@sprig.dev" />
      </FormField>
      <FormField label="Password" htmlFor="story-password" error="Use at least 8 characters.">
        <Input id="story-password" type="password" aria-invalid defaultValue="short" />
      </FormField>
      <FormField label="Note" htmlFor="story-note">
        <Textarea id="story-note" placeholder="Write a note" />
      </FormField>
      <SearchInput aria-label="Search" placeholder="Search" fieldSize="md" />
      <Select
        id="story-role"
        placeholder="Choose a role"
        options={[
          { label: "Administrator", value: "admin" },
          { label: "Editor", value: "editor" },
          { label: "Viewer", value: "viewer" },
        ]}
      />
      <div className="flex items-center gap-2">
        <Checkbox id="story-remember" defaultChecked />
        <Label htmlFor="story-remember">Remember me</Label>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="story-alerts">Email alerts</Label>
        <Switch id="story-alerts" defaultChecked />
      </div>
      <RadioGroup defaultValue="light" aria-label="Skin" className="flex gap-4">
        <label className="flex items-center gap-2 text-[13px]">
          <Radio value="light" /> Light
        </label>
        <label className="flex items-center gap-2 text-[13px]">
          <Radio value="dark" /> Dark
        </label>
      </RadioGroup>
    </div>
  ),
};
