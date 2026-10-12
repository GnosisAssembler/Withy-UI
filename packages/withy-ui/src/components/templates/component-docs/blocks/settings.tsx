"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { Icon } from "../../../atoms/icon";
import { Input } from "../../../atoms/input";
import { Link } from "../../../atoms/link";
import { Text } from "../../../atoms/text";
import { Textarea } from "../../../atoms/textarea";
import { Stack } from "../../../layout/stack";
import { Callout } from "../../../molecules/callout";
import { CheckboxField, SwitchField } from "../../../molecules/choice-field";
import { CreditCardInput, type CreditCardValue } from "../../../molecules/credit-card-input";
import { FileInput } from "../../../molecules/file-input";
import { FormField } from "../../../molecules/form-field";
import { InlineMessage } from "../../../molecules/inline-message";
import { InputGroup } from "../../../molecules/input-group";
import { PasswordInput } from "../../../molecules/password-input";
import { useToast } from "../../../molecules/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../molecules/tabs";
import {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../organisms/card";
import type { ComponentDoc } from "../types";
import {
  BlockIntro,
  FormActions,
  confirmPasswordError,
  emailError,
  hasError,
  passwordError,
  requiredError,
} from "./shared";

const emptyAccount = { email: "ivy@withy.dev", current: "", next: "", confirm: "" };

function emailErrors(email: string) {
  return { email: emailError(email, true) };
}

function passwordErrors(value: Pick<typeof emptyAccount, "current" | "next" | "confirm">) {
  return {
    current: requiredError(value.current, true, "Enter your current password."),
    next: passwordError(value.next, true),
    confirm: confirmPasswordError(value.confirm, value.next, true),
  };
}

function AccountSettingsDemo() {
  const { toast } = useToast();
  const [email, setEmail] = React.useState(emptyAccount.email);
  const [emailSubmitted, setEmailSubmitted] = React.useState(false);
  const [emailSaved, setEmailSaved] = React.useState(false);
  const [password, setPassword] = React.useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordSubmitted, setPasswordSubmitted] = React.useState(false);
  const [passwordSaved, setPasswordSaved] = React.useState(false);
  const [beta, setBeta] = React.useState(false);
  const [testMode, setTestMode] = React.useState(false);
  const [approval, setApproval] = React.useState(false);
  const [audit, setAudit] = React.useState(true);
  const [deployMail, setDeployMail] = React.useState(false);
  const [governanceSaved, setGovernanceSaved] = React.useState(false);
  const [caching, setCaching] = React.useState(false);
  const [bots, setBots] = React.useState(false);
  const [observability, setObservability] = React.useState(false);
  const [upgradeSubmitted, setUpgradeSubmitted] = React.useState(false);
  const [upgradeSaved, setUpgradeSaved] = React.useState(false);
  const emailProblems = emailSubmitted ? emailErrors(email) : undefined;
  const passwordProblems = passwordSubmitted ? passwordErrors(password) : undefined;
  const upgradeError =
    upgradeSubmitted && !caching && !bots && !observability
      ? "Choose at least one add-on."
      : undefined;

  function saveSwitch(label: string, checked: boolean, setChecked: (value: boolean) => void) {
    setChecked(checked);
    toast({
      title: checked ? `${label} is on` : `${label} is off`,
      description: "Saved on this page.",
      color: "success",
    });
  }

  return (
    <Stack gap="lg">
      <BlockIntro
        className="mb-0"
        title="Settings"
        description="Update your sign-in, workspace features, and add-ons."
      />
      <Tabs defaultValue="account">
        <TabsList aria-label="Account sections">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="addons">Add-ons</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Stack gap="xl">
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                const next = emailErrors(email);
                setEmailSubmitted(true);
                setEmailSaved(!hasError(next));
              }}
            >
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle as="h4">Email</CardTitle>
                    <CardDescription>The address associated with this workspace.</CardDescription>
                  </div>
                </CardHeader>
                <CardBody>
                  <FormField label="Email" error={emailProblems?.email} className="max-w-lg">
                    <Input
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </FormField>
                </CardBody>
                <CardFooter className="flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                  {emailSaved ? (
                    <InlineMessage tone="success">Email updated on this page.</InlineMessage>
                  ) : null}
                  <FormActions
                    submitLabel="Update email"
                    onCancel={() => {
                      setEmail(emptyAccount.email);
                      setEmailSubmitted(false);
                      setEmailSaved(false);
                    }}
                  />
                </CardFooter>
              </Card>
            </form>
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                const next = passwordErrors(password);
                setPasswordSubmitted(true);
                setPasswordSaved(!hasError(next));
              }}
            >
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle as="h4">Password</CardTitle>
                    <CardDescription>Use at least 8 characters.</CardDescription>
                  </div>
                </CardHeader>
                <CardBody>
                  <Stack gap="lg" className="max-w-lg">
                    <FormField label="Current password" error={passwordProblems?.current}>
                      <PasswordInput
                        autoComplete="current-password"
                        value={password.current}
                        onChange={(event) =>
                          setPassword((current) => ({ ...current, current: event.target.value }))
                        }
                      />
                    </FormField>
                    <FormField label="New password" error={passwordProblems?.next}>
                      <PasswordInput
                        autoComplete="new-password"
                        value={password.next}
                        onChange={(event) =>
                          setPassword((current) => ({ ...current, next: event.target.value }))
                        }
                      />
                    </FormField>
                    <FormField label="Confirm new password" error={passwordProblems?.confirm}>
                      <PasswordInput
                        autoComplete="new-password"
                        value={password.confirm}
                        onChange={(event) =>
                          setPassword((current) => ({ ...current, confirm: event.target.value }))
                        }
                      />
                    </FormField>
                  </Stack>
                </CardBody>
                <CardFooter className="flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                  {passwordSaved ? (
                    <InlineMessage tone="success">Password updated on this page.</InlineMessage>
                  ) : null}
                  <FormActions
                    submitLabel="Update password"
                    onCancel={() => {
                      setPassword({ current: "", next: "", confirm: "" });
                      setPasswordSubmitted(false);
                      setPasswordSaved(false);
                    }}
                  />
                </CardFooter>
              </Card>
            </form>
          </Stack>
        </TabsContent>
        <TabsContent value="workspace">
          <Stack gap="xl">
            <section className="flex flex-col gap-4">
              <div>
                <CardTitle as="h4">Features</CardTitle>
                <Text size="sm" tone="muted" className="mt-1">
                  Each switch saves as soon as you change it.
                </Text>
              </div>
              <Card>
                <CardBody>
                  <SwitchField
                    label="Beta analytics"
                    description="Try charts before they are on for every workspace."
                    checked={beta}
                    onCheckedChange={(checked) => saveSwitch("Beta analytics", checked, setBeta)}
                  />
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <SwitchField
                    label="Test mode"
                    description="Run queries without changing live data."
                    checked={testMode}
                    onCheckedChange={(checked) => saveSwitch("Test mode", checked, setTestMode)}
                  />
                </CardBody>
              </Card>
            </section>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setGovernanceSaved(true);
              }}
            >
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle as="h4">Governance</CardTitle>
                    <CardDescription>These choices save when you use the button.</CardDescription>
                  </div>
                </CardHeader>
                <CardBody>
                  <Stack gap="lg">
                    <CheckboxField
                      label="Require approval before a deploy"
                      description="A teammate confirms the request before it runs."
                      checked={approval}
                      onCheckedChange={(checked) => setApproval(checked === true)}
                    />
                    <CheckboxField
                      label="Keep audit logs"
                      description="Record who changed workspace settings."
                      checked={audit}
                      onCheckedChange={(checked) => setAudit(checked === true)}
                    />
                    <CheckboxField
                      label="Email the team when a deploy finishes"
                      description="Send a message for a successful or failed deploy."
                      checked={deployMail}
                      onCheckedChange={(checked) => setDeployMail(checked === true)}
                    />
                  </Stack>
                </CardBody>
                <CardFooter className="flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                  {governanceSaved ? (
                    <InlineMessage tone="success">Governance saved on this page.</InlineMessage>
                  ) : null}
                  <FormActions
                    submitLabel="Save settings"
                    onCancel={() => {
                      setApproval(false);
                      setAudit(true);
                      setDeployMail(false);
                      setGovernanceSaved(false);
                    }}
                  />
                </CardFooter>
              </Card>
            </form>
          </Stack>
        </TabsContent>
        <TabsContent value="addons">
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              const invalid = !caching && !bots && !observability;
              setUpgradeSubmitted(true);
              setUpgradeSaved(!invalid);
            }}
          >
            <Stack gap="lg">
              <Text size="sm" tone="muted">
                Turn on paid add-ons for this workspace. The choice is saved with the button.
              </Text>
              <AddOnCard
                title="Query caching"
                price="$25 a month"
                description="Stores repeated queries for 24 hours so dashboards open faster."
                checked={caching}
                onCheckedChange={(checked) => setCaching(checked === true)}
              />
              <AddOnCard
                title="Bot protection"
                price="$100 a month"
                description="Blocks automated traffic before it reaches your queries."
                checked={bots}
                onCheckedChange={(checked) => setBots(checked === true)}
              />
              <AddOnCard
                title="Observability"
                price="$90 a month"
                description="Keeps 30 days of query time, errors, and storage."
                checked={observability}
                onCheckedChange={(checked) => setObservability(checked === true)}
              />
              {upgradeError ? <InlineMessage tone="danger">{upgradeError}</InlineMessage> : null}
              {upgradeSaved ? (
                <InlineMessage tone="success">Upgrade requested on this page.</InlineMessage>
              ) : null}
              <FormActions
                submitLabel="Upgrade plan"
                onCancel={() => {
                  setCaching(false);
                  setBots(false);
                  setObservability(false);
                  setUpgradeSubmitted(false);
                  setUpgradeSaved(false);
                }}
              />
            </Stack>
          </form>
        </TabsContent>
      </Tabs>
    </Stack>
  );
}

function AddOnCard({
  title,
  price,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  price: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean | "indeterminate") => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h4">{title}</CardTitle>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <Text size="sm" weight="medium" tone="heading">
          {price}
        </Text>
        <Text size="sm" tone="secondary">
          {description}
        </Text>
        <CheckboxField
          label={`Activate ${title}`}
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
      </CardBody>
    </Card>
  );
}

const emptyProfile = {
  name: "Ivy Calder",
  email: "ivy@withy.dev",
  handle: "ivy",
  bio: "Administrator for the Withy workspace.",
};

const emptyCard: CreditCardValue = { number: "", name: "", expiry: "", cvc: "" };

function profileErrors(value: typeof emptyProfile) {
  return {
    name: requiredError(value.name, true, "Enter your name."),
    email: emailError(value.email, true),
    handle: requiredError(value.handle, true, "Enter a handle."),
  };
}

function paymentErrors(card: CreditCardValue) {
  const errors: Partial<Record<keyof CreditCardValue, string>> = {};
  if (card.number.length < 13) errors.number = "Enter the card number.";
  if (card.name.trim().length < 2) errors.name = "Enter the name on the card.";
  if (card.expiry.length < 4) errors.expiry = "Enter the expiry month and year.";
  if (card.cvc.length < 3) errors.cvc = "Enter the security code.";
  return errors;
}

function SettingsScreenDemo() {
  const { toast } = useToast();
  const [profile, setProfile] = React.useState(emptyProfile);
  const [profileSubmitted, setProfileSubmitted] = React.useState(false);
  const [profileSaved, setProfileSaved] = React.useState(false);
  const [password, setPassword] = React.useState({ current: "", next: "", confirm: "" });
  const [passwordSubmitted, setPasswordSubmitted] = React.useState(false);
  const [passwordSaved, setPasswordSaved] = React.useState(false);
  const [product, setProduct] = React.useState(true);
  const [security, setSecurity] = React.useState(true);
  const [weekly, setWeekly] = React.useState(false);
  const [card, setCard] = React.useState(emptyCard);
  const [cardSubmitted, setCardSubmitted] = React.useState(false);
  const [cardSaved, setCardSaved] = React.useState(false);
  const profileProblems = profileSubmitted ? profileErrors(profile) : undefined;
  const passwordProblems = passwordSubmitted ? passwordErrors(password) : undefined;
  const cardProblems = cardSubmitted ? paymentErrors(card) : undefined;

  function saveSwitch(label: string, checked: boolean, setChecked: (value: boolean) => void) {
    setChecked(checked);
    toast({
      title: checked ? `${label} is on` : `${label} is off`,
      description: "Saved on this page.",
      color: "success",
    });
  }

  return (
    <Stack gap="lg">
      <BlockIntro
        className="mb-0"
        title="Workspace settings"
        description="Profile, password, notifications, and the payment method."
      />
      <Tabs
        orientation="vertical"
        defaultValue="profile"
        className="gap-6 lg:flex-row lg:items-start"
      >
        <TabsList
          aria-label="Settings sections"
          className="h-auto w-full flex-col items-stretch gap-1 border-b-0 lg:w-48 lg:shrink-0"
        >
          <TabsTrigger value="profile" className="mb-0 w-full border-b-0 border-l-2 text-left">
            Profile
          </TabsTrigger>
          <TabsTrigger value="password" className="mb-0 w-full border-b-0 border-l-2 text-left">
            Password
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="mb-0 w-full border-b-0 border-l-2 text-left"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="mb-0 w-full border-b-0 border-l-2 text-left">
            Billing
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="min-w-0 flex-1 pt-0">
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              const next = profileErrors(profile);
              setProfileSubmitted(true);
              setProfileSaved(!hasError(next));
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle as="h4">Profile</CardTitle>
              </CardHeader>
              <CardBody>
                <Stack gap="lg">
                  <FormField label="Name" error={profileProblems?.name}>
                    <Input
                      autoComplete="name"
                      value={profile.name}
                      onChange={(event) =>
                        setProfile((current) => ({ ...current, name: event.target.value }))
                      }
                    />
                  </FormField>
                  <FormField label="Email" error={profileProblems?.email}>
                    <Input
                      type="email"
                      autoComplete="email"
                      value={profile.email}
                      onChange={(event) =>
                        setProfile((current) => ({ ...current, email: event.target.value }))
                      }
                    />
                  </FormField>
                  <FormField label="Handle" error={profileProblems?.handle}>
                    <InputGroup prefix="@">
                      <Input
                        autoComplete="username"
                        value={profile.handle}
                        onChange={(event) =>
                          setProfile((current) => ({ ...current, handle: event.target.value }))
                        }
                      />
                    </InputGroup>
                  </FormField>
                  <FormField label="Bio">
                    <Textarea
                      value={profile.bio}
                      onChange={(event) =>
                        setProfile((current) => ({ ...current, bio: event.target.value }))
                      }
                    />
                  </FormField>
                  <FormField label="Avatar" hint="PNG or JPG, shown on your account menu.">
                    <FileInput accept="image/png,image/jpeg" />
                  </FormField>
                </Stack>
              </CardBody>
              <CardFooter className="flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                {profileSaved ? (
                  <InlineMessage tone="success">Profile saved on this page.</InlineMessage>
                ) : null}
                <FormActions
                  submitLabel="Save profile"
                  onCancel={() => {
                    setProfile(emptyProfile);
                    setProfileSubmitted(false);
                    setProfileSaved(false);
                  }}
                />
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        <TabsContent value="password" className="min-w-0 flex-1 pt-0">
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              const next = passwordErrors(password);
              setPasswordSubmitted(true);
              setPasswordSaved(!hasError(next));
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle as="h4">Password</CardTitle>
              </CardHeader>
              <CardBody>
                <Stack gap="lg" className="max-w-lg">
                  <FormField label="Current password" error={passwordProblems?.current}>
                    <PasswordInput
                      autoComplete="current-password"
                      value={password.current}
                      onChange={(event) =>
                        setPassword((current) => ({ ...current, current: event.target.value }))
                      }
                    />
                  </FormField>
                  <FormField label="New password" error={passwordProblems?.next}>
                    <PasswordInput
                      autoComplete="new-password"
                      value={password.next}
                      onChange={(event) =>
                        setPassword((current) => ({ ...current, next: event.target.value }))
                      }
                    />
                  </FormField>
                  <FormField label="Confirm new password" error={passwordProblems?.confirm}>
                    <PasswordInput
                      autoComplete="new-password"
                      value={password.confirm}
                      onChange={(event) =>
                        setPassword((current) => ({ ...current, confirm: event.target.value }))
                      }
                    />
                  </FormField>
                </Stack>
              </CardBody>
              <CardFooter>
                <Stack gap="lg" className="w-full">
                  {passwordSaved ? (
                    <InlineMessage tone="success">Password updated on this page.</InlineMessage>
                  ) : null}
                  <FormActions
                    submitLabel="Update password"
                    onCancel={() => {
                      setPassword({ current: "", next: "", confirm: "" });
                      setPasswordSubmitted(false);
                      setPasswordSaved(false);
                    }}
                  />
                </Stack>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        <TabsContent value="notifications" className="min-w-0 flex-1 pt-0">
          <Card>
            <CardHeader>
              <div>
                <CardTitle as="h4">Notifications</CardTitle>
                <CardDescription>Each switch saves as soon as you change it.</CardDescription>
              </div>
            </CardHeader>
            <CardBody>
              <Stack gap="lg">
                <SwitchField
                  label="Product updates"
                  description="New features and changes to the workspace."
                  checked={product}
                  onCheckedChange={(checked) => saveSwitch("Product updates", checked, setProduct)}
                />
                <SwitchField
                  label="Security alerts"
                  description="Sign-in attempts and password changes."
                  checked={security}
                  onCheckedChange={(checked) => saveSwitch("Security alerts", checked, setSecurity)}
                />
                <SwitchField
                  label="Weekly digest"
                  description="A Monday summary of workspace activity."
                  checked={weekly}
                  onCheckedChange={(checked) => saveSwitch("Weekly digest", checked, setWeekly)}
                />
              </Stack>
            </CardBody>
          </Card>
        </TabsContent>
        <TabsContent value="billing" className="min-w-0 flex-1 pt-0">
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              const next = paymentErrors(card);
              setCardSubmitted(true);
              setCardSaved(Object.keys(next).length === 0);
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle as="h4">Billing</CardTitle>
              </CardHeader>
              <CardBody>
                <Stack gap="lg">
                  <Callout color="info" title="Starter plan" icon={<Icon icon={Info} />}>
                    This workspace is on the free plan.{" "}
                    <Link href="/components/plan-application">Compare plans</Link> when you need a
                    higher request limit.
                  </Callout>
                  <CreditCardInput value={card} onValueChange={setCard} errors={cardProblems} />
                </Stack>
              </CardBody>
              <CardFooter className="flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                {cardSaved ? (
                  <InlineMessage tone="success">Payment method updated on this page.</InlineMessage>
                ) : null}
                <FormActions
                  submitLabel="Update payment method"
                  onCancel={() => {
                    setCard(emptyCard);
                    setCardSubmitted(false);
                    setCardSaved(false);
                  }}
                />
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </Stack>
  );
}

export const settingsBlocks = [
  {
    slug: "account-settings",
    name: "Account settings",
    category: "Blocks",
    description:
      "Account, workspace, and add-on tabs. Switches save immediately. Email, password, governance, and add-ons save with their buttons.",
    imports: [
      "Button",
      "Card",
      "CardBody",
      "CardFooter",
      "CardHeader",
      "CardTitle",
      "CheckboxField",
      "FormField",
      "Input",
      "PasswordInput",
      "SwitchField",
      "Tabs",
      "TabsContent",
      "TabsList",
      "TabsTrigger",
    ],
    code: `<Tabs defaultValue="account">
  <TabsList aria-label="Account sections">
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="workspace">Workspace</TabsTrigger>
    <TabsTrigger value="addons">Add-ons</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <Card>
      <CardHeader>
        <CardTitle as="h4">Email</CardTitle>
      </CardHeader>
      <CardBody>
        <FormField label="Email" error={errors.email}>
          <Input type="email" value={email} onChange={setEmail} />
        </FormField>
        <FormField label="New password" error={errors.password}>
          <PasswordInput autoComplete="new-password" value={password} onChange={setPassword} />
        </FormField>
      </CardBody>
      <CardFooter>
        <Button type="submit">Update email</Button>
      </CardFooter>
    </Card>
  </TabsContent>
  <TabsContent value="workspace">
    <SwitchField
      label="Beta analytics"
      description="Try charts before they are on for every workspace."
      checked={beta}
      onCheckedChange={setBeta}
    />
    <CheckboxField label="Keep audit logs" checked={audit} onCheckedChange={setAudit} />
  </TabsContent>
</Tabs>`,
    Demo: AccountSettingsDemo,
  },
  {
    slug: "settings-screen",
    name: "Settings screen",
    category: "Blocks",
    description:
      "A settings screen with a section list for profile, password, notifications, and billing. Notification switches save on their own.",
    imports: [
      "Callout",
      "Card",
      "CardBody",
      "CardHeader",
      "CardTitle",
      "CreditCardInput",
      "FileInput",
      "FormField",
      "Input",
      "InputGroup",
      "Link",
      "SwitchField",
      "Tabs",
      "TabsContent",
      "TabsList",
      "TabsTrigger",
      "Textarea",
    ],
    code: `<Tabs orientation="vertical" defaultValue="profile">
  <TabsList aria-label="Settings sections">
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  <TabsContent value="profile">
    <Card>
      <CardHeader>
        <CardTitle as="h4">Profile</CardTitle>
      </CardHeader>
      <CardBody>
        <FormField label="Name" error={errors.name}>
          <Input value={name} onChange={setName} />
        </FormField>
        <FormField label="Handle" error={errors.handle}>
          <InputGroup prefix="@">
            <Input value={handle} onChange={setHandle} />
          </InputGroup>
        </FormField>
        <FormField label="Bio">
          <Textarea value={bio} onChange={setBio} />
        </FormField>
        <FormField label="Avatar" hint="PNG or JPG, shown on your account menu.">
          <FileInput accept="image/png,image/jpeg" />
        </FormField>
      </CardBody>
    </Card>
  </TabsContent>
  <TabsContent value="notifications">
    <SwitchField label="Security alerts" checked={security} onCheckedChange={setSecurity} />
  </TabsContent>
  <TabsContent value="billing">
    <Callout color="info" title="Starter plan">
      This workspace is on the free plan. <Link href="/components/plan-application">Compare plans</Link>
    </Callout>
    <CreditCardInput value={card} onValueChange={setCard} errors={errors.card} />
  </TabsContent>
</Tabs>`,
    Demo: SettingsScreenDemo,
  },
] as const satisfies readonly ComponentDoc[];
