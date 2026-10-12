import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormField } from "./form-field";
import { ChipPicker } from "./chip-picker";
import type { ComboOption } from "./combobox";

const initialTags: ComboOption[] = [
  { label: "Design", value: "design" },
  { label: "Billing", value: "billing" },
  { label: "Support", value: "support" },
  { label: "Launch", value: "launch" },
];

const meta = {
  title: "Molecules/Chip picker",
  component: ChipPicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A chip picker selects several options and shows them as removable chips. Search the list, and optionally create a new option.",
      },
    },
  },
} satisfies Meta<typeof ChipPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Topics: Story = {
  args: {
    "aria-label": "Topics",
    options: initialTags,
    defaultValue: ["design", "billing"],
    placeholder: "Choose topics",
  },
};

export const Examples: Story = {
  args: {
    options: initialTags,
  },
  render: () => <ExamplesGallery />,
};

function ExamplesGallery() {
  const [options, setOptions] = React.useState(initialTags);
  const [topics, setTopics] = React.useState(["design"]);
  const [filters, setFilters] = React.useState(["support"]);

  return (
    <div className="grid max-w-sm gap-4">
      <FormField label="Topics" hint="Shown as chips on the report.">
        <ChipPicker
          options={options}
          value={topics}
          onValueChange={setTopics}
          placeholder="Choose topics"
          onCreate={(label) => {
            const value = label.toLowerCase().replace(/\s+/g, "-");
            setOptions((current) => [...current, { label, value }]);
          }}
        />
      </FormField>
      <FormField label="Filters">
        <ChipPicker
          options={initialTags}
          value={filters}
          onValueChange={setFilters}
          disabledItemValues={["launch"]}
        />
      </FormField>
      <FormField label="Assigned teams">
        <ChipPicker options={initialTags} defaultValue={["billing"]} disabled />
      </FormField>
    </div>
  );
}
