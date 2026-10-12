import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../atoms/checkbox";
import { Input } from "../atoms/input";
import { Label } from "../atoms/label";
import { Radio, RadioGroup } from "../atoms/radio-group";
import { Switch } from "../atoms/switch";
import { Textarea } from "../atoms/textarea";
import { FormField } from "./form-field";
import { NumberInput } from "./number-input";
import { SearchInput } from "./search-input";
import { Select } from "./select";

const meta = {
  title: "Molecules/Controls",
  component: FormField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Form controls are atoms. FormField, NumberInput, SearchInput, and Select group them into molecules.",
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
        <Input id="story-email" placeholder="ivy@withy.dev" />
      </FormField>
      <FormField label="Password" htmlFor="story-password" error="Use at least 8 characters.">
        <Input id="story-password" type="password" aria-invalid defaultValue="short" />
      </FormField>
      <FormField label="Note" htmlFor="story-note">
        <Textarea id="story-note" placeholder="Write a note" />
      </FormField>
      <FormField label="Seats" hint="Between 1 and 20.">
        <NumberInput min={1} max={20} defaultValue={2} />
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
