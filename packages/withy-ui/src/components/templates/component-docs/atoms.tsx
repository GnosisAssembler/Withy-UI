"use client";

import * as React from "react";
import { Bell, Pin, Search, Star } from "lucide-react";
import { Aura } from "../../atoms/aura";
import { Avatar } from "../../atoms/avatar";
import { Badge } from "../../atoms/badge";
import { Button } from "../../atoms/button";
import { Checkbox } from "../../atoms/checkbox";
import { ColorSlider } from "../../atoms/color-slider";
import { Eyebrow } from "../../atoms/eyebrow";
import { Figure } from "../../atoms/figure";
import { Heading } from "../../atoms/heading";
import { Icon } from "../../atoms/icon";
import { Input } from "../../atoms/input";
import { Kbd } from "../../atoms/kbd";
import { Label } from "../../atoms/label";
import { Link } from "../../atoms/link";
import { Progress } from "../../atoms/progress";
import { PulseDot } from "../../atoms/pulse-dot";
import { RadioGroup } from "../../atoms/radio-group";
import { ScrollArea } from "../../atoms/scroll-area";
import { Separator } from "../../atoms/separator";
import { Skeleton, SkeletonRows, SkeletonText } from "../../atoms/skeleton";
import { Slider } from "../../atoms/slider";
import { Spinner, SpinnerOverlay } from "../../atoms/spinner";
import { Switch } from "../../atoms/switch";
import { Tag } from "../../atoms/tag";
import { Text } from "../../atoms/text";
import { Textarea } from "../../atoms/textarea";
import { ToggleButton } from "../../atoms/toggle-button";
import { Wraith } from "../../atoms/wraith";
import { RadioField } from "../../molecules/choice-field";
import { FormField } from "../../molecules/form-field";
import { Card, CardBody } from "../../organisms/card";
import type { ComponentDoc } from "./types";

function ProgressDemo() {
  const [value, setValue] = React.useState(62);

  return (
    <div className="flex max-w-sm flex-col gap-4">
      <div>
        <div className="mb-2 flex justify-between text-[13px]">
          <span className="text-heading">Exporting report</span>
          <span className="text-text-3">{value}%</span>
        </div>
        <Progress
          value={value}
          color={value >= 100 ? "success" : "primary"}
          aria-label="Exporting report"
        />
        <Button
          type="button"
          size="sm"
          variant="outlined"
          className="mt-3"
          onClick={() => setValue((current) => (current >= 100 ? 16 : Math.min(100, current + 16)))}
        >
          Advance export
        </Button>
      </div>
      <div>
        <div className="mb-2 flex justify-between text-[13px]">
          <span className="text-heading">Uploading files</span>
          <span className="text-text-3">62%</span>
        </div>
        <Progress value={62} animation="stripes" aria-label="Uploading files" />
      </div>
      <div>
        <div className="mb-2 flex justify-between text-[13px]">
          <span className="text-heading">Syncing contacts</span>
          <span className="text-text-3">40%</span>
        </div>
        <Progress value={40} animation="shimmer" color="info" aria-label="Syncing contacts" />
      </div>
      <div>
        <p className="mb-2 text-[13px] text-heading">Preparing export</p>
        <Progress animation="indeterminate" aria-label="Preparing export" />
      </div>
      <div>
        <div className="mb-2 flex justify-between text-[13px]">
          <span className="text-heading">Import complete</span>
          <span className="text-text-3">100%</span>
        </div>
        <Progress value={100} color="success" aria-label="Import complete" />
      </div>
    </div>
  );
}

function ColorSliderDemo() {
  const [color, setColor] = React.useState("#0e7484");
  return (
    <div className="flex max-w-sm items-start gap-4">
      <span
        className="mt-7 size-8 shrink-0 rounded-sm border border-border"
        style={{ backgroundColor: color }}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <FormField label="Hue" hint={color}>
          <ColorSlider channel="hue" value={color} onValueChange={setColor} />
        </FormField>
        <FormField label="Saturation">
          <ColorSlider channel="saturation" value={color} onValueChange={setColor} />
        </FormField>
        <FormField label="Lightness">
          <ColorSlider channel="lightness" value={color} onValueChange={setColor} />
        </FormField>
        <FormField label="Alpha">
          <ColorSlider channel="alpha" value={color} onValueChange={setColor} />
        </FormField>
      </div>
    </div>
  );
}

function SliderDemo() {
  const [minutes, setMinutes] = React.useState([30]);
  return (
    <FormField label="Session timeout" hint={`${minutes[0]} minutes`} className="max-w-sm">
      <Slider min={15} max={120} step={15} value={minutes} onValueChange={setMinutes} />
    </FormField>
  );
}

const filterTags = ["Status: Open", "Owner: Ada"];

function ToggleButtonDemo() {
  const [starred, setStarred] = React.useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <ToggleButton icon aria-label="Star" pressed={starred} onPressedChange={setStarred}>
          <Star className={starred ? "fill-current" : undefined} />
        </ToggleButton>
        <Text size="sm" tone="secondary">
          {starred ? "Starred" : "Not starred"}
        </Text>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ToggleButton variant="quiet" defaultPressed>
          <Pin /> Pin
        </ToggleButton>
        <ToggleButton variant="emphasized" defaultPressed>
          Bold
        </ToggleButton>
        <ToggleButton variant="quiet">Italic</ToggleButton>
      </div>
    </div>
  );
}

function TagDemo() {
  const [filters, setFilters] = React.useState(filterTags);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Tag color="cyan">Design</Tag>
        <Tag color="orange">Billing</Tag>
        <Tag color="indigo">Support</Tag>
        <Tag color="teal">Research</Tag>
        <Tag color="pink">Sales</Tag>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <Tag
            key={filter}
            onRemove={() => setFilters((current) => current.filter((item) => item !== filter))}
          >
            {filter}
          </Tag>
        ))}
        {filters.length === 0 ? (
          <Button variant="text" size="sm" onClick={() => setFilters(filterTags)}>
            Restore filters
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function AuraDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start gap-4">
        <Aura>
          <Card className="w-64">
            <CardBody>
              <Text>This plan includes priority support.</Text>
            </CardBody>
          </Card>
        </Aura>
        <Aura variant="rainbow">
          <Card className="w-64">
            <CardBody>
              <Text>Most teams choose this plan.</Text>
            </CardBody>
          </Card>
        </Aura>
        <Aura variant="gold">
          <Card className="w-64">
            <CardBody>
              <Text>Billed once a year.</Text>
            </CardBody>
          </Card>
        </Aura>
        <Aura variant="glow" color="cyan">
          <Card className="w-64">
            <CardBody>
              <Text>This is the current plan.</Text>
            </CardBody>
          </Card>
        </Aura>
      </div>
      <Aura variant="rainbow" radius="full">
        <Button shape="pill">Subscribe</Button>
      </Aura>
    </div>
  );
}

export const atomDocs = [
  {
    slug: "aura",
    name: "Aura",
    category: "Atoms",
    description:
      "An aura draws a moving light around the one card or button you want to stand out. Give the wrapped component an opaque background, and use the same corner radius.",
    imports: ["Aura", "Button", "Card", "CardBody", "Text"],
    code: `<Aura>
  <Card>
    <CardBody>
      <Text>This plan includes priority support.</Text>
    </CardBody>
  </Card>
</Aura>
<Aura variant="rainbow" radius="full">
  <Button shape="pill">Subscribe</Button>
</Aura>
<Aura variant="glow" color="cyan" size="lg">
  <Card>
    <CardBody>
      <Text>This is the current plan.</Text>
    </CardBody>
  </Card>
</Aura>`,
    Demo: AuraDemo,
  },
  {
    slug: "avatar",
    name: "Avatar",
    category: "Atoms",
    description:
      "An avatar shows a person or a team. Initials stand in when there is no image, or while it loads.",
    imports: ["Avatar"],
    code: `<Avatar initials="IC" />
<Avatar initials="AD" tone="success" size="sm" />
<Avatar src="/people/ada.jpg" alt="Ada Lovelace" initials="AL" size="lg" />`,
    Demo: () => (
      <div className="flex flex-wrap items-center gap-3">
        <Avatar initials="IC" size="xs" />
        <Avatar initials="AD" size="sm" tone="success" />
        <Avatar initials="NW" tone="info" />
        <Avatar initials="HC" size="lg" tone="pink" />
      </div>
    ),
  },
  {
    slug: "badge",
    name: "Badge",
    category: "Atoms",
    description:
      "A badge labels a status or a category in a word or two. Use the solid fill for emphasis and the muted tint for a quiet label.",
    imports: ["Badge"],
    code: `<Badge color="success">Paid</Badge>
<Badge variant="muted" color="warning">Due soon</Badge>
<Badge variant="muted" color="cyan">Design</Badge>`,
    Demo: () => (
      <div className="flex flex-wrap items-center gap-2">
        <Badge color="success">Paid</Badge>
        <Badge color="danger">Failed</Badge>
        <Badge variant="muted" color="warning">
          Due soon
        </Badge>
        <Badge variant="muted" color="info">
          Draft
        </Badge>
        <Badge variant="muted" color="cyan">
          Design
        </Badge>
        <Badge shape="pill">New</Badge>
      </div>
    ),
  },
  {
    slug: "button",
    name: "Button",
    category: "Atoms",
    description:
      "A button starts an action. Its label starts with a verb, such as Save changes, and has no period.",
    imports: ["Button"],
    code: `<Button>Save changes</Button>
<Button color="white">Export</Button>
<Button variant="outlined">Preview</Button>
<Button color="danger">Delete invoice</Button>
<Button loading>Save changes</Button>`,
    Demo: () => (
      <div className="flex flex-wrap items-center gap-2">
        <Button>Save changes</Button>
        <Button color="white">Export</Button>
        <Button variant="outlined">Preview</Button>
        <Button variant="text">Forgot password</Button>
        <Button color="danger">Delete invoice</Button>
        <Button loading>Save changes</Button>
        <Button color="white" size="sm">
          <Bell /> Notify me
        </Button>
      </div>
    ),
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    category: "Atoms",
    description:
      "A checkbox turns one option on or off. Give it a name, or use Checkbox field for a visible label.",
    imports: ["Checkbox"],
    code: `<Checkbox aria-label="Select invoice #1048" />
<Checkbox aria-label="Select all invoices" checked="indeterminate" />`,
    Demo: () => (
      <div className="flex items-center gap-4">
        <Checkbox aria-label="Select invoice #1048" />
        <Checkbox aria-label="Select invoice #1049" defaultChecked />
        <Checkbox aria-label="Select all invoices" checked="indeterminate" />
      </div>
    ),
  },
  {
    slug: "color-slider",
    name: "Color slider",
    category: "Atoms",
    description:
      "A color slider sets one channel of a color. Hue draws a rainbow, and saturation, lightness, and alpha follow the rest of the current color. Show the color in the hint.",
    imports: ["ColorSlider", "FormField"],
    code: `<FormField label="Hue" hint={color}>
  <ColorSlider channel="hue" value={color} onValueChange={setColor} />
</FormField>
<FormField label="Saturation">
  <ColorSlider channel="saturation" value={color} onValueChange={setColor} />
</FormField>
<FormField label="Lightness">
  <ColorSlider channel="lightness" value={color} onValueChange={setColor} />
</FormField>
<FormField label="Alpha">
  <ColorSlider channel="alpha" value={color} onValueChange={setColor} />
</FormField>`,
    Demo: ColorSliderDemo,
  },
  {
    slug: "eyebrow",
    name: "Eyebrow",
    category: "Atoms",
    description:
      "An eyebrow is the small Inter label above a title or a figure. Use it for a section label, not for a sentence.",
    imports: ["Eyebrow", "Figure"],
    code: `<Eyebrow as="h2">Sales monitoring</Eyebrow>
<Eyebrow tone="muted">Conversion rate</Eyebrow>
<Figure>0.81%</Figure>`,
    Demo: () => (
      <div className="flex flex-col gap-4">
        <Eyebrow>Sales monitoring</Eyebrow>
        <div>
          <Eyebrow tone="muted">Conversion rate</Eyebrow>
          <Figure className="mt-1.5">0.81%</Figure>
        </div>
      </div>
    ),
  },
  {
    slug: "figure",
    name: "Figure",
    category: "Atoms",
    description:
      "A figure sets a number in Rubik, so metrics read the same on every screen. Use sm inside tables and rows.",
    imports: ["Figure"],
    code: `<Figure size="lg">9.8</Figure>
<Figure>0.81%</Figure>
<Figure as="span" size="sm">$1,240.00</Figure>`,
    Demo: () => (
      <div className="flex flex-wrap items-end gap-6">
        <Figure size="lg">9.8</Figure>
        <Figure>0.81%</Figure>
        <Figure size="sm">$1,240.00</Figure>
      </div>
    ),
  },
  {
    slug: "heading",
    name: "Heading",
    category: "Atoms",
    description:
      "A heading names a section. Set level for the page outline and size for the look, so you never skip a level.",
    imports: ["Heading"],
    code: `<Heading level={2}>Account settings</Heading>
<Heading level={3} size={5}>Billing</Heading>`,
    Demo: () => (
      <div className="flex flex-col gap-2">
        <Heading level={2}>Account settings</Heading>
        <Heading level={3} size={5}>
          Billing
        </Heading>
        <Heading level={4} size={6}>
          Payment method
        </Heading>
      </div>
    ),
  },
  {
    slug: "icon",
    name: "Icon",
    category: "Atoms",
    description:
      "Icon draws a Lucide icon at 14, 16, or 20px. It is hidden from assistive tech unless you give it a label.",
    imports: ["Icon"],
    code: `import { Search } from "lucide-react";

<Icon icon={Search} size="sm" />
<Icon icon={Search} label="Search" />`,
    Demo: () => (
      <div className="flex items-center gap-4 text-text-2">
        <Icon icon={Search} size="sm" />
        <Icon icon={Search} />
        <Icon icon={Search} size="lg" />
        <span className="inline-flex items-center gap-1.5 text-[13px]">
          <Icon icon={Bell} size="sm" /> Notifications
        </span>
      </div>
    ),
  },
  {
    slug: "input",
    name: "Input",
    category: "Atoms",
    description:
      "An input takes one line of text. Put it in a form field so it has a visible label, a hint, and an error.",
    imports: ["FormField", "Input"],
    code: `<FormField label="Report name" hint="Shown on the report cover.">
  <Input defaultValue="Weekly revenue" />
</FormField>`,
    Demo: () => (
      <div className="flex max-w-sm flex-col gap-4">
        <FormField label="Report name" hint="Shown on the report cover.">
          <Input defaultValue="Weekly revenue" />
        </FormField>
        <FormField label="Owner" error="Enter a name between 2 and 20 characters.">
          <Input defaultValue="A" fieldSize="sm" />
        </FormField>
      </div>
    ),
  },
  {
    slug: "kbd",
    name: "Kbd",
    category: "Atoms",
    description: "Kbd shows a key or a shortcut.",
    imports: ["Kbd"],
    code: `<Kbd>⌘</Kbd><Kbd>K</Kbd>`,
    Demo: () => (
      <p className="flex items-center gap-1.5 text-[13px] text-text-2">
        Open the command bar with <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </p>
    ),
  },
  {
    slug: "label",
    name: "Label",
    category: "Atoms",
    description:
      "A label names a control and moves focus to it when clicked. Form field adds one for you.",
    imports: ["Input", "Label"],
    code: `<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />`,
    Demo: () => (
      <div className="flex max-w-sm flex-col gap-1.5">
        <Label htmlFor="docs-label-email">Email</Label>
        <Input id="docs-label-email" type="email" placeholder="ivy@withy.dev" />
      </div>
    ),
  },
  {
    slug: "link",
    name: "Link",
    category: "Atoms",
    description:
      "A link opens another place. Its text says where it goes. It uses your router when you pass one to Withy provider.",
    imports: ["Link"],
    code: `Read the <Link href="/billing/guide">billing guide</Link>.
<Link href="https://lucide.dev" external>Lucide</Link>`,
    Demo: () => (
      <p className="max-w-md text-[13px] text-text-2">
        Read the <Link href="/foundations/content">content guidelines</Link> before you name a
        button. The icons come from{" "}
        <Link href="https://lucide.dev" external>
          Lucide
        </Link>
        .
      </p>
    ),
  },
  {
    slug: "progress",
    name: "Progress",
    category: "Atoms",
    description:
      "Progress shows how far a task has gone. Name the task beside it. When the end is not known yet, use the indeterminate animation.",
    imports: ["Progress"],
    code: `<Progress value={62} aria-label="Exporting report" />
<Progress value={62} animation="stripes" aria-label="Uploading files" />
<Progress value={40} animation="shimmer" color="info" aria-label="Syncing contacts" />
<Progress animation="indeterminate" aria-label="Preparing export" />
<Progress value={100} color="success" aria-label="Import complete" />`,
    Demo: ProgressDemo,
  },
  {
    slug: "pulse-dot",
    name: "Pulse dot",
    category: "Atoms",
    description: "A pulse dot marks something live, such as agents who are online now.",
    imports: ["PulseDot"],
    code: `<PulseDot label="Live" /> 12 agents online`,
    Demo: () => (
      <p className="flex items-center gap-2 text-[13px] text-text-2">
        <PulseDot label="Live" /> 12 agents online
      </p>
    ),
  },
  {
    slug: "radio-group",
    name: "Radio group",
    category: "Atoms",
    description:
      "A radio group picks one option from a short list. Use Radio field for each labeled option.",
    imports: ["Radio", "RadioField", "RadioGroup"],
    code: `<RadioGroup aria-label="Billing period" defaultValue="monthly">
  <RadioField value="monthly" label="Monthly" />
  <RadioField value="yearly" label="Yearly" description="Two months free." />
</RadioGroup>

<Radio value="weekly" aria-label="Weekly" />`,
    Demo: () => (
      <RadioGroup aria-label="Billing period" defaultValue="monthly">
        <RadioField value="monthly" label="Monthly" />
        <RadioField value="yearly" label="Yearly" description="Two months free." />
      </RadioGroup>
    ),
  },
  {
    slug: "scroll-area",
    name: "Scroll area",
    category: "Atoms",
    description: "A scroll area gives a region with a fixed height a thin scrollbar.",
    imports: ["ScrollArea"],
    code: `<ScrollArea className="h-40">
  {invoices.map((invoice) => <p key={invoice.id}>{invoice.name}</p>)}
</ScrollArea>`,
    Demo: () => (
      <ScrollArea className="h-40 max-w-xs rounded-sm border border-border">
        <ul className="flex flex-col p-1">
          {Array.from({ length: 20 }, (_, index) => (
            <li key={index} className="rounded-xs px-3 py-1.5 text-[13px] text-text-2">
              Invoice #{1040 + index}
            </li>
          ))}
        </ul>
      </ScrollArea>
    ),
  },
  {
    slug: "separator",
    name: "Separator",
    category: "Atoms",
    description: "A separator divides groups inside one region.",
    imports: ["Separator"],
    code: `<Separator className="my-3" />`,
    Demo: () => (
      <div className="max-w-sm text-[13px]">
        <p className="text-heading">Profile</p>
        <Separator className="my-3" />
        <p className="text-heading">Security</p>
      </div>
    ),
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    category: "Atoms",
    description:
      "A skeleton holds the shape of a larger region while it loads. Replace it as soon as the content arrives.",
    imports: ["Skeleton", "SkeletonAvatar", "SkeletonRows", "SkeletonText"],
    code: `<Skeleton className="h-8 w-40" />
<SkeletonAvatar />
<SkeletonText lines={3} />
<SkeletonRows rows={3} />`,
    Demo: () => (
      <div className="grid max-w-2xl gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-40" />
          <SkeletonText lines={3} />
        </div>
        <SkeletonRows rows={3} />
      </div>
    ),
  },
  {
    slug: "slider",
    name: "Slider",
    category: "Atoms",
    description: "A slider picks a number in a range. Show the current value in the hint.",
    imports: ["FormField", "Slider"],
    code: `<FormField label="Session timeout" hint={minutes[0] + " minutes"}>
  <Slider min={15} max={120} step={15} value={minutes} onValueChange={setMinutes} />
</FormField>`,
    Demo: SliderDemo,
  },
  {
    slug: "spinner",
    name: "Spinner",
    category: "Atoms",
    description:
      "A spinner shows that a small region is loading. Name what is loading. Skip it for waits under a second.",
    imports: ["Spinner", "SpinnerOverlay"],
    code: `<Spinner label="Loading invoices" />
<div className="relative">
  <SpinnerOverlay label="Loading chart" />
</div>`,
    Demo: () => (
      <div className="flex flex-wrap items-center gap-6">
        <Spinner size="sm" label="Loading invoices" />
        <Spinner label="Loading invoices" />
        <Spinner size="lg" label="Loading invoices" />
        <span className="relative h-16 w-28 rounded-sm border border-border">
          <SpinnerOverlay label="Loading chart" />
        </span>
      </div>
    ),
  },
  {
    slug: "switch",
    name: "Switch",
    category: "Atoms",
    description:
      "A switch turns a setting on or off and saves when it changes. Use Switch field for a labeled settings row.",
    imports: ["Label", "Switch"],
    code: `<Switch id="alerts" defaultChecked />
<Label htmlFor="alerts">Email alerts</Label>`,
    Demo: () => (
      <div className="flex items-center gap-3">
        <Switch id="docs-switch-alerts" defaultChecked />
        <Label htmlFor="docs-switch-alerts">Email alerts</Label>
      </div>
    ),
  },
  {
    slug: "tag",
    name: "Tag",
    category: "Atoms",
    description:
      "A tag marks a category or an active filter. An accent dot separates categories. A remove button clears a filter.",
    imports: ["Tag"],
    code: `<Tag color="cyan">Design</Tag>
<Tag onRemove={() => clear("status")}>Status: Open</Tag>`,
    Demo: TagDemo,
  },
  {
    slug: "text",
    name: "Text",
    category: "Atoms",
    description:
      "Text sets body copy, supporting copy, captions, and status text. Use weight for emphasis and tone for meaning.",
    imports: ["Text"],
    code: `<Text>Body copy at 14px.</Text>
<Text size="sm" tone="secondary">Supporting copy at 13px.</Text>
<Text size="xs" tone="muted">Updated 2 minutes ago</Text>`,
    Demo: () => (
      <div className="flex max-w-md flex-col gap-2">
        <Text>Body copy at 14px.</Text>
        <Text size="sm" tone="secondary">
          Supporting copy at 13px.
        </Text>
        <Text size="xs" tone="muted">
          Updated 2 minutes ago
        </Text>
        <Text size="sm" weight="medium" tone="heading">
          Weekly revenue
        </Text>
        <Text size="sm" tone="danger">
          Payment failed.
        </Text>
      </div>
    ),
  },
  {
    slug: "textarea",
    name: "Textarea",
    category: "Atoms",
    description: "A textarea takes several lines of text.",
    imports: ["FormField", "Textarea"],
    code: `<FormField label="Note" hint="Visible to your team.">
  <Textarea />
</FormField>`,
    Demo: () => (
      <FormField label="Note" hint="Visible to your team." className="max-w-sm">
        <Textarea defaultValue="Send the March invoices on Friday." />
      </FormField>
    ),
  },
  {
    slug: "toggle-button",
    name: "Toggle button",
    category: "Atoms",
    description:
      "A toggle button stays pressed while a selection is on, such as a starred report or bold text. Use Switch field for a setting, and Segmented control when only one option can be on.",
    imports: ["ToggleButton"],
    code: `import { Pin, Star } from "lucide-react";

<ToggleButton icon aria-label="Star" pressed={starred} onPressedChange={setStarred}>
  <Star />
</ToggleButton>
<ToggleButton variant="quiet" defaultPressed>
  <Pin /> Pin
</ToggleButton>
<ToggleButton variant="emphasized">Bold</ToggleButton>`,
    Demo: ToggleButtonDemo,
  },
  {
    slug: "wraith",
    name: "Wraith",
    category: "Atoms",
    description:
      "A wraith is a pixel-art mascot that floats with its lantern in a drift of light. It is decoration, so place one per screen, in a corner away from the content.",
    imports: ["Wraith"],
    code: `<Wraith />
<Wraith size="sm" />
<Wraith size="lg" label="Withy UI wraith" />
<Wraith className="fixed right-2 bottom-2 z-30" />`,
    Demo: () => (
      <div className="flex flex-wrap items-end gap-8">
        <Wraith size="sm" />
        <Wraith />
        <Wraith size="lg" />
      </div>
    ),
  },
] as const satisfies readonly ComponentDoc[];
