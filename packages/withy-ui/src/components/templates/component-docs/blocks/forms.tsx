"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Badge } from "../../../atoms/badge";
import { Icon } from "../../../atoms/icon";
import { Input } from "../../../atoms/input";
import { Link } from "../../../atoms/link";
import { Radio, RadioGroup } from "../../../atoms/radio-group";
import { Text } from "../../../atoms/text";
import { Textarea } from "../../../atoms/textarea";
import { Column as GridColumn, Columns } from "../../../layout/grid";
import { Container } from "../../../layout/container";
import { Stack } from "../../../layout/stack";
import { Separator } from "../../../atoms/separator";
import { CheckboxField, RadioField } from "../../../molecules/choice-field";
import { Fieldset } from "../../../molecules/fieldset";
import { FormField } from "../../../molecules/form-field";
import { InlineMessage } from "../../../molecules/inline-message";
import { NumberInput } from "../../../molecules/number-input";
import { Select } from "../../../molecules/select";
import { cn } from "../../../../lib/cn";
import { Card, CardBody, CardHeader, CardTitle } from "../../../organisms/card";
import type { ComponentDoc } from "../types";
import {
  BlockIntro,
  FormActions,
  SectionIntro,
  emailError,
  hasError,
  requiredError,
} from "./shared";

const fullRow = "col-span-1 md:col-span-2";

const emptyRegistration = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
};

function registrationErrors(value: typeof emptyRegistration) {
  return {
    firstName: requiredError(value.firstName, true, "Enter a first name."),
    lastName: requiredError(value.lastName, true, "Enter a last name."),
    email: emailError(value.email, true),
  };
}

function RegistrationFormDemo() {
  const [form, setForm] = React.useState(emptyRegistration);
  const [submitted, setSubmitted] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const errors = submitted ? registrationErrors(form) : undefined;

  function update(key: keyof typeof emptyRegistration, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <Container width="narrow">
      <BlockIntro
        title="Register for a workspace"
        description="Add your name and email so the team can give you access."
      />
      <form
        className="flex flex-col"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const next = registrationErrors(form);
          setSubmitted(true);
          setSaved(!hasError(next));
        }}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="First name" error={errors?.firstName}>
            <Input
              autoComplete="given-name"
              placeholder="Ivy"
              value={form.firstName}
              onChange={(event) => update("firstName", event.target.value)}
            />
          </FormField>
          <FormField label="Last name" error={errors?.lastName}>
            <Input
              autoComplete="family-name"
              placeholder="Calder"
              value={form.lastName}
              onChange={(event) => update("lastName", event.target.value)}
            />
          </FormField>
          <div className={fullRow}>
            <FormField label="Email" error={errors?.email}>
              <Input
                type="email"
                autoComplete="email"
                placeholder="ivy@withy.dev"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
              />
            </FormField>
          </div>
          <div className={fullRow}>
            <FormField label="Address">
              <Input
                autoComplete="street-address"
                placeholder="200 Market Street"
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
              />
            </FormField>
          </div>
          <div className={fullRow}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField label="City">
                <Input
                  autoComplete="address-level2"
                  placeholder="Boston"
                  value={form.city}
                  onChange={(event) => update("city", event.target.value)}
                />
              </FormField>
              <FormField label="State">
                <Input
                  autoComplete="address-level1"
                  placeholder="MA"
                  value={form.state}
                  onChange={(event) => update("state", event.target.value)}
                />
              </FormField>
              <FormField label="Postal code">
                <Input
                  autoComplete="postal-code"
                  placeholder="02110"
                  value={form.postalCode}
                  onChange={(event) => update("postalCode", event.target.value)}
                />
              </FormField>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          {saved ? (
            <InlineMessage tone="success">Registration saved on this page.</InlineMessage>
          ) : null}
          <FormActions
            submitLabel="Join workspace"
            onCancel={() => {
              setForm(emptyRegistration);
              setSubmitted(false);
              setSaved(false);
            }}
          />
        </div>
      </form>
    </Container>
  );
}

const initialProfile = {
  firstName: "Ivy",
  lastName: "Calder",
  email: "ivy@withy.dev",
  year: 1994 as number | null,
  workspace: "Withy",
  visibility: "private",
  description: "Shared reports and billing for the workspace.",
  newsletter: "month",
  teamRequests: true,
  teamDigest: false,
  apiSpikes: false,
  caching: true,
  storage: true,
};

function profileErrors(value: typeof initialProfile) {
  return {
    firstName: requiredError(value.firstName, true, "Enter a first name."),
    lastName: requiredError(value.lastName, true, "Enter a last name."),
    email: emailError(value.email, true),
    workspace: requiredError(value.workspace, true, "Enter a workspace name."),
  };
}

function ProfileFormDemo() {
  const [form, setForm] = React.useState(initialProfile);
  const [submitted, setSubmitted] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const errors = submitted ? profileErrors(form) : undefined;

  function update<K extends keyof typeof initialProfile>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const next = profileErrors(form);
        setSubmitted(true);
        setSaved(!hasError(next));
      }}
    >
      <BlockIntro
        title="Profile and workspace"
        description="Personal details, workspace settings, and the alerts you want to receive."
      />
      <div className="flex flex-col">
        <Columns gap="xl" className="items-start">
          <GridColumn span={4}>
            <SectionIntro
              title="Personal information"
              description="This is the name and email on your account."
            />
          </GridColumn>
          <GridColumn span={8}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="First name" error={errors?.firstName}>
                <Input
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(event) => update("firstName", event.target.value)}
                />
              </FormField>
              <FormField label="Last name" error={errors?.lastName}>
                <Input
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(event) => update("lastName", event.target.value)}
                />
              </FormField>
              <div className={fullRow}>
                <FormField label="Email" error={errors?.email}>
                  <Input
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                  />
                </FormField>
              </div>
              <FormField label="Birth year">
                <NumberInput
                  value={form.year}
                  onValueChange={(year) => update("year", year)}
                  min={1900}
                  max={2026}
                  controls="none"
                />
              </FormField>
              <FormField label="Role" hint="An admin changes this role.">
                <Input defaultValue="Admin" disabled />
              </FormField>
            </div>
          </GridColumn>
        </Columns>
        <Separator className="my-8" />
        <Columns gap="xl" className="items-start">
          <GridColumn span={4}>
            <SectionIntro
              title="Workspace settings"
              description="The name people see when they switch workspaces."
            />
          </GridColumn>
          <GridColumn span={8}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Workspace name" error={errors?.workspace}>
                <Input
                  value={form.workspace}
                  onChange={(event) => update("workspace", event.target.value)}
                />
              </FormField>
              <FormField label="Visibility">
                <Select
                  value={form.visibility}
                  onValueChange={(visibility) => update("visibility", visibility)}
                  options={[
                    { label: "Private", value: "private" },
                    { label: "Public", value: "public" },
                  ]}
                />
              </FormField>
              <div className={fullRow}>
                <FormField
                  label="Workspace description"
                  hint="Only people in the workspace can read this."
                >
                  <Textarea
                    value={form.description}
                    onChange={(event) => update("description", event.target.value)}
                  />
                </FormField>
              </div>
            </div>
          </GridColumn>
        </Columns>
        <Separator className="my-8" />
        <Columns gap="xl" className="items-start">
          <GridColumn span={4}>
            <SectionIntro
              title="Notification settings"
              description="Choose the messages this workspace sends you. These save with the form."
            />
          </GridColumn>
          <GridColumn span={8}>
            <Stack gap="xl">
              <Fieldset
                legend="Newsletter"
                hint="Choose how often you want news about the workspace."
              >
                <RadioGroup
                  value={form.newsletter}
                  onValueChange={(newsletter) => update("newsletter", newsletter)}
                >
                  <RadioField value="week" label="Every week" />
                  <RadioField value="month" label="Every month" />
                  <RadioField value="never" label="Never" />
                </RadioGroup>
              </Fieldset>
              <Fieldset legend="Team" hint="Alerts about people in this workspace.">
                <CheckboxField
                  label="Team join requests"
                  description="When someone asks to join."
                  checked={form.teamRequests}
                  onCheckedChange={(checked) => update("teamRequests", checked === true)}
                />
                <CheckboxField
                  label="Weekly team digest"
                  description="A Monday summary of workspace activity."
                  checked={form.teamDigest}
                  onCheckedChange={(checked) => update("teamDigest", checked === true)}
                />
              </Fieldset>
              <Fieldset legend="Usage" hint="Alerts about requests, caching, and storage.">
                <CheckboxField
                  label="API request spikes"
                  description="When requests rise well above the recent average."
                  checked={form.apiSpikes}
                  onCheckedChange={(checked) => update("apiSpikes", checked === true)}
                />
                <CheckboxField
                  label="Query caching"
                  description="When the cache is full or a query misses it."
                  checked={form.caching}
                  onCheckedChange={(checked) => update("caching", checked === true)}
                />
                <CheckboxField
                  label="Storage"
                  description="When stored data passes 80 percent of the plan."
                  checked={form.storage}
                  onCheckedChange={(checked) => update("storage", checked === true)}
                />
              </Fieldset>
            </Stack>
          </GridColumn>
        </Columns>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {saved ? <InlineMessage tone="success">Settings saved on this page.</InlineMessage> : null}
        <FormActions
          submitLabel="Save settings"
          onCancel={() => {
            setForm(initialProfile);
            setSubmitted(false);
            setSaved(false);
          }}
        />
      </div>
    </form>
  );
}

const packages = [
  {
    id: "starter",
    title: "Starter",
    detail: "Up to 10,000 requests a day.",
    price: "Free",
    features: ["Community support", "50 GB of storage", "Application builder"],
  },
  {
    id: "premium",
    title: "Premium",
    detail: "500,000 requests a day.",
    price: "$900 a month",
    features: ["Slack support", "100 GB of storage", "Managed workspace"],
  },
  {
    id: "enterprise",
    title: "Enterprise",
    detail: "Limits that follow your usage.",
    price: "Custom",
    features: ["Priority support", "Unlimited storage", "Single sign-on"],
  },
] as const;

const companySizes = [
  { label: "1 to 9", value: "1-9" },
  { label: "10 to 50", value: "10-50" },
  { label: "51 to 250", value: "51-250" },
  { label: "251 or more", value: "251+" },
];

const emptyApplication = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  size: "1-9",
  plan: "premium",
};

function applicationErrors(value: typeof emptyApplication) {
  return {
    firstName: requiredError(value.firstName, true, "Enter a first name."),
    email: emailError(value.email, true),
  };
}

function PlanApplicationDemo() {
  const [form, setForm] = React.useState(emptyApplication);
  const [submitted, setSubmitted] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const errors = submitted ? applicationErrors(form) : undefined;
  const selected = packages.find((item) => item.id === form.plan) ?? packages[1];

  function update<K extends keyof typeof emptyApplication>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <Container width="narrow">
      <BlockIntro
        title="Apply for early access"
        description="Tell us about the company and the package you want to try."
      />
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const next = applicationErrors(form);
          setSubmitted(true);
          setSaved(!hasError(next));
        }}
      >
        <Stack gap="lg">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="First name" error={errors?.firstName}>
              <Input
                autoComplete="given-name"
                value={form.firstName}
                onChange={(event) => update("firstName", event.target.value)}
              />
            </FormField>
            <FormField label="Last name">
              <Input
                autoComplete="family-name"
                value={form.lastName}
                onChange={(event) => update("lastName", event.target.value)}
              />
            </FormField>
            <div className={fullRow}>
              <FormField label="Work email" error={errors?.email}>
                <Input
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                />
              </FormField>
            </div>
            <FormField label="Company">
              <Input
                autoComplete="organization"
                value={form.company}
                onChange={(event) => update("company", event.target.value)}
              />
            </FormField>
            <FormField label="Company size">
              <Select
                value={form.size}
                onValueChange={(size) => update("size", size)}
                options={companySizes}
              />
            </FormField>
          </div>
          <Fieldset
            legend="Workspace package"
            hint="Starter includes 10,000 requests a day. After that, requests are $0.50 per 10,000. No card is required to apply."
          >
            <RadioGroup
              value={form.plan}
              onValueChange={(plan) => update("plan", plan)}
              className="grid gap-4 sm:grid-cols-3"
            >
              {packages.map((item) => {
                const checked = form.plan === item.id;
                return (
                  <label
                    key={item.id}
                    className={cn(
                      "flex cursor-pointer gap-3 rounded-sm border bg-card p-4",
                      checked ? "border-primary" : "border-border",
                    )}
                  >
                    <Radio value={item.id} aria-label={item.title} className="mt-0.5" />
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <Text as="span" size="sm" weight="medium" tone="heading">
                        {item.title}
                      </Text>
                      <Text as="span" size="sm" tone="muted">
                        {item.detail}
                      </Text>
                      <Text as="span" size="sm" weight="medium" tone="heading" className="mt-4">
                        {item.price}
                      </Text>
                    </span>
                  </label>
                );
              })}
            </RadioGroup>
            <div>
              <Text size="sm" weight="medium" tone="heading">
                Includes
              </Text>
              <ul className="mt-2 flex flex-col gap-2">
                {selected?.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Icon icon={Check} size="sm" className="text-primary" />
                    <Text as="span" size="sm">
                      {feature}
                    </Text>
                  </li>
                ))}
              </ul>
            </div>
          </Fieldset>
        </Stack>
        <div className="mt-6 flex flex-col gap-4">
          {saved ? (
            <InlineMessage tone="success">Application saved on this page.</InlineMessage>
          ) : null}
          <FormActions
            submitLabel="Apply"
            onCancel={() => {
              setForm(emptyApplication);
              setSubmitted(false);
              setSaved(false);
            }}
          />
        </div>
      </form>
    </Container>
  );
}

const workspacePlans = [
  {
    id: "hobby",
    name: "Hobby",
    price: "$40 a month",
    features: ["1,000 requests a day", "3 environments", "10 people", "Community support"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$80 a month",
    recommended: true,
    features: ["100,000 requests a day", "10 environments", "50 people", "Slack support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$160 a month",
    features: [
      "Unlimited requests",
      "Unlimited environments",
      "Single sign-on",
      "99.99% uptime target",
    ],
  },
] as const;

const emptyWorkspace = {
  organization: "acme",
  name: "",
  region: "eu-west",
  plan: "premium",
};

function CreateWorkspaceDemo() {
  const [form, setForm] = React.useState(emptyWorkspace);
  const [submitted, setSubmitted] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const nameError = submitted
    ? requiredError(form.name, true, "Enter a workspace name.")
    : undefined;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const invalid = requiredError(form.name, true, "Enter a workspace name.");
        setSubmitted(true);
        setSaved(!invalid);
      }}
    >
      <BlockIntro
        title="Create a workspace"
        description="Choose an organization, name the workspace, and pick a plan."
      />
      <Columns gap="xl" className="items-start">
        <GridColumn span={7}>
          <Stack gap="lg">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Organization">
                <Select
                  value={form.organization}
                  onValueChange={(organization) =>
                    setForm((current) => ({ ...current, organization }))
                  }
                  options={[
                    { label: "Acme", value: "acme" },
                    { label: "Northwind", value: "northwind" },
                    { label: "Harbor Co", value: "harbor" },
                  ]}
                />
              </FormField>
              <FormField label="Workspace name" error={nameError}>
                <Input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </FormField>
            </div>
            <FormField
              label="Region"
              hint="Choose a region close to the people who use this workspace."
            >
              <Select
                value={form.region}
                onValueChange={(region) => setForm((current) => ({ ...current, region }))}
                options={[
                  { label: "EU West, Frankfurt", value: "eu-west" },
                  { label: "US East, Boston", value: "us-east" },
                  { label: "US West, San Francisco", value: "us-west" },
                ]}
              />
            </FormField>
            <Fieldset legend="Plan type">
              <RadioGroup
                value={form.plan}
                onValueChange={(plan) => setForm((current) => ({ ...current, plan }))}
                className="flex flex-col gap-4"
              >
                {workspacePlans.map((plan) => {
                  const checked = form.plan === plan.id;
                  return (
                    <label
                      key={plan.id}
                      className={cn(
                        "block cursor-pointer overflow-hidden rounded-sm border bg-card",
                        checked ? "border-primary" : "border-border",
                      )}
                    >
                      <span className="flex gap-3 p-4">
                        <Radio value={plan.id} aria-label={plan.name} className="mt-0.5" />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <Text as="span" size="sm" weight="medium" tone="heading">
                              {plan.name}
                            </Text>
                            {"recommended" in plan && plan.recommended ? (
                              <Badge variant="muted" color="primary">
                                Recommended
                              </Badge>
                            ) : null}
                          </span>
                          <ul className="mt-2 flex flex-col gap-1">
                            {plan.features.map((feature) => (
                              <li key={feature} className="flex items-center gap-2">
                                <Icon icon={Check} size="sm" className="text-text-3" />
                                <Text as="span" size="sm">
                                  {feature}
                                </Text>
                              </li>
                            ))}
                          </ul>
                        </span>
                      </span>
                      <span className="flex items-center justify-end border-t border-border bg-muted px-4 py-3">
                        <Text size="sm" weight="medium" tone="heading">
                          {plan.price}
                        </Text>
                      </span>
                    </label>
                  );
                })}
              </RadioGroup>
            </Fieldset>
          </Stack>
        </GridColumn>
        <GridColumn span={5}>
          <Card>
            <CardHeader>
              <CardTitle as="h4">Which plan fits</CardTitle>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <Text size="sm">
                Premium is the suggested plan for a shared workspace. You can change it later
                without moving reports.
              </Text>
              <ul className="flex flex-col gap-2">
                {[
                  "Request limits follow the plan you pick.",
                  "People and reports stay put when you change plans.",
                  "Enterprise adds single sign-on and an uptime target.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Icon icon={Check} size="sm" className="mt-0.5 text-primary" />
                    <Text as="span" size="sm">
                      {item}
                    </Text>
                  </li>
                ))}
              </ul>
              <Link href="/components/plan-application">Compare plans</Link>
            </CardBody>
          </Card>
        </GridColumn>
      </Columns>
      <div className="mt-6 flex flex-col gap-4">
        {saved ? (
          <InlineMessage tone="success">Workspace created on this page.</InlineMessage>
        ) : null}
        <FormActions
          submitLabel="Create workspace"
          onCancel={() => {
            setForm(emptyWorkspace);
            setSubmitted(false);
            setSaved(false);
          }}
        />
      </div>
    </form>
  );
}

export const formBlocks = [
  {
    slug: "registration-form",
    name: "Registration form",
    category: "Blocks",
    description:
      "A short form for joining a workspace. The name, email, and address sit on a grid that stacks on a narrow screen.",
    imports: ["Button", "Container", "FormField", "Heading", "Input", "Text"],
    code: `<Container width="narrow">
  <Heading level={3} size={4}>Register for a workspace</Heading>
  <Text size="sm" tone="muted">Add your name and email so the team can give you access.</Text>
  <form noValidate onSubmit={joinWorkspace}>
    <FormField label="First name" error={errors.firstName}>
      <Input autoComplete="given-name" value={firstName} onChange={setFirstName} />
    </FormField>
    <FormField label="Last name" error={errors.lastName}>
      <Input autoComplete="family-name" value={lastName} onChange={setLastName} />
    </FormField>
    <FormField label="Email" error={errors.email}>
      <Input type="email" autoComplete="email" value={email} onChange={setEmail} />
    </FormField>
    <FormField label="Address">
      <Input autoComplete="street-address" value={address} onChange={setAddress} />
    </FormField>
    <Button type="button" variant="text" onClick={cancel}>Cancel</Button>
    <Button type="submit">Join workspace</Button>
  </form>
</Container>`,
    Demo: RegistrationFormDemo,
  },
  {
    slug: "profile-form",
    name: "Profile form",
    category: "Blocks",
    description:
      "Personal details, workspace settings, and notification choices. The description sits beside the fields, and the fields stack on a narrow screen.",
    imports: [
      "Button",
      "CheckboxField",
      "Columns",
      "Fieldset",
      "FormField",
      "GridColumn",
      "Heading",
      "Input",
      "NumberInput",
      "RadioField",
      "RadioGroup",
      "Text",
    ],
    code: `<form noValidate onSubmit={saveSettings}>
  <Columns gap="xl">
    <GridColumn span={4}>
      <Heading level={4}>Personal information</Heading>
      <Text size="sm" tone="muted">This is the name and email on your account.</Text>
    </GridColumn>
    <GridColumn span={8}>
      <FormField label="First name" error={errors.firstName}>
        <Input value={firstName} onChange={setFirstName} />
      </FormField>
      <FormField label="Email" error={errors.email}>
        <Input type="email" value={email} onChange={setEmail} />
      </FormField>
      <FormField label="Birth year">
        <NumberInput value={year} onValueChange={setYear} controls="none" />
      </FormField>
    </GridColumn>
  </Columns>
  <Fieldset legend="Newsletter" hint="Choose how often you want news about the workspace.">
    <RadioGroup value={newsletter} onValueChange={setNewsletter}>
      <RadioField value="week" label="Every week" />
      <RadioField value="month" label="Every month" />
      <RadioField value="never" label="Never" />
    </RadioGroup>
  </Fieldset>
  <Fieldset legend="Team">
    <CheckboxField label="Team join requests" checked={teamRequests} onCheckedChange={setTeamRequests} />
  </Fieldset>
  <Button type="submit">Save settings</Button>
</form>`,
    Demo: ProfileFormDemo,
  },
  {
    slug: "plan-application",
    name: "Plan application",
    category: "Blocks",
    description:
      "An early-access form that asks for a company and a package. The included features follow the selected plan.",
    imports: ["Button", "Fieldset", "FormField", "Input", "Radio", "RadioGroup", "Select", "Text"],
    code: `<form noValidate onSubmit={apply}>
  <FormField label="First name" error={errors.firstName}>
    <Input value={firstName} onChange={setFirstName} />
  </FormField>
  <FormField label="Work email" error={errors.email}>
    <Input type="email" value={email} onChange={setEmail} />
  </FormField>
  <FormField label="Company size">
    <Select value={size} onValueChange={setSize} options={companySizes} />
  </FormField>
  <Fieldset legend="Workspace package">
    <RadioGroup value={plan} onValueChange={setPlan} className="grid gap-4 sm:grid-cols-3">
      <label>
        <Radio value="starter" aria-label="Starter" />
        <Text weight="medium">Starter</Text>
        <Text tone="muted">Up to 10,000 requests a day.</Text>
      </label>
    </RadioGroup>
  </Fieldset>
  <Button type="submit">Apply</Button>
</form>`,
    Demo: PlanApplicationDemo,
  },
  {
    slug: "create-workspace",
    name: "Create workspace",
    category: "Blocks",
    description:
      "Name a workspace, choose a region, and pick a plan. A side card explains which plan fits.",
    imports: [
      "Badge",
      "Card",
      "CardBody",
      "CardHeader",
      "CardTitle",
      "Columns",
      "Fieldset",
      "FormField",
      "GridColumn",
      "Input",
      "Link",
      "Radio",
      "RadioGroup",
      "Select",
      "Text",
    ],
    code: `<Columns gap="xl">
  <GridColumn span={7}>
    <FormField label="Organization">
      <Select value={organization} onValueChange={setOrganization} options={organizations} />
    </FormField>
    <FormField label="Workspace name" error={errors.name}>
      <Input value={name} onChange={setName} />
    </FormField>
    <FormField label="Region" hint="Choose a region close to the people who use this workspace.">
      <Select value={region} onValueChange={setRegion} options={regions} />
    </FormField>
    <Fieldset legend="Plan type">
      <RadioGroup value={plan} onValueChange={setPlan}>
        <label>
          <Radio value="premium" aria-label="Premium" />
          <Text weight="medium">Premium</Text>
          <Badge variant="muted" color="primary">Recommended</Badge>
        </label>
      </RadioGroup>
    </Fieldset>
  </GridColumn>
  <GridColumn span={5}>
    <Card>
      <CardHeader>
        <CardTitle as="h4">Which plan fits</CardTitle>
      </CardHeader>
      <CardBody>
        <Text>Premium is the suggested plan for a shared workspace.</Text>
        <Link href="/components/plan-application">Compare plans</Link>
      </CardBody>
    </Card>
  </GridColumn>
</Columns>`,
    Demo: CreateWorkspaceDemo,
  },
] as const satisfies readonly ComponentDoc[];
