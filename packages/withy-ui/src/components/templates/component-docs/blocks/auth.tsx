"use client";

import * as React from "react";
import { Button } from "../../../atoms/button";
import { Input } from "../../../atoms/input";
import { Link } from "../../../atoms/link";
import { Text } from "../../../atoms/text";
import { Stack } from "../../../layout/stack";
import { CheckboxField } from "../../../molecules/choice-field";
import { FormField } from "../../../molecules/form-field";
import { InlineMessage } from "../../../molecules/inline-message";
import { Logo } from "../../../molecules/logo";
import { PasswordInput } from "../../../molecules/password-input";
import { useToast } from "../../../molecules/toast";
import { Dialog } from "../../../organisms/dialog";
import type { ComponentDoc } from "../types";
import {
  BlockIntro,
  confirmPasswordError,
  emailError,
  hasError,
  passwordError,
  requiredError,
} from "./shared";

function ResetPasswordDialog() {
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const error = emailError(email, submitted);

  return (
    <Dialog
      title="Reset password"
      description="We will email a link to choose a new password."
      confirmLabel="Send reset link"
      trigger={
        <Button type="button" variant="text" size="sm">
          Reset password
        </Button>
      }
      onOpenChange={(open) => {
        if (!open) {
          setEmail("");
          setSubmitted(false);
        }
      }}
      onConfirm={() => {
        setSubmitted(true);
        if (emailError(email, true)) return Promise.reject(new Error("email"));
        toast({
          title: "Reset link sent",
          description: "This preview does not send email.",
          color: "success",
        });
      }}
    >
      <FormField label="Email" error={error}>
        <Input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormField>
    </Dialog>
  );
}

function signInErrors(email: string, password: string) {
  return {
    email: emailError(email, true),
    password: passwordError(password, true),
  };
}

function SignInDemo() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [submitted, setSubmitted] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const errors = submitted ? signInErrors(email, password) : undefined;

  return (
    <Stack gap="lg" className="mx-auto w-full max-w-sm">
      <Logo href="/components/sign-in" />
      <BlockIntro
        className="mb-0"
        title="Sign in"
        description="Use your workspace email to continue."
      />
      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const next = signInErrors(email, password);
          setSubmitted(true);
          setSaved(!hasError(next));
        }}
      >
        <FormField label="Email" error={errors?.email}>
          <Input
            type="email"
            autoComplete="email"
            placeholder="ivy@withy.dev"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormField>
        <FormField label="Password" error={errors?.password}>
          <PasswordInput
            autoComplete="current-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormField>
        <div className="flex items-center justify-between gap-3">
          <CheckboxField
            label="Remember me"
            checked={remember}
            onCheckedChange={(checked) => setRemember(checked === true)}
          />
          <ResetPasswordDialog />
        </div>
        <Button type="submit" fullWidth>
          Sign in
        </Button>
        {saved ? (
          <InlineMessage tone="success">
            Signed in on this page. This preview does not create a session.
          </InlineMessage>
        ) : null}
      </form>
      <Text size="sm" tone="muted">
        New to this workspace? <Link href="/components/sign-up">Create an account</Link>
      </Text>
    </Stack>
  );
}

function signUpErrors(value: {
  name: string;
  email: string;
  password: string;
  confirm: string;
  agreed: boolean;
}) {
  return {
    name: requiredError(value.name, true, "Enter your name."),
    email: emailError(value.email, true),
    password: passwordError(value.password, true),
    confirm: confirmPasswordError(value.confirm, value.password, true),
    agreed: value.agreed ? undefined : "Agree to the workspace terms to create an account.",
  };
}

function SignUpDemo() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [agreed, setAgreed] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const errors = submitted ? signUpErrors({ name, email, password, confirm, agreed }) : undefined;

  return (
    <Stack gap="lg" className="mx-auto w-full max-w-sm">
      <Logo href="/components/sign-up" />
      <BlockIntro
        className="mb-0"
        title="Create an account"
        description="Start a workspace with your email."
      />
      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const next = signUpErrors({ name, email, password, confirm, agreed });
          setSubmitted(true);
          setSaved(!hasError(next));
        }}
      >
        <FormField label="Name" error={errors?.name}>
          <Input
            autoComplete="name"
            placeholder="Ivy Calder"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </FormField>
        <FormField label="Email" error={errors?.email}>
          <Input
            type="email"
            autoComplete="email"
            placeholder="ivy@withy.dev"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormField>
        <FormField label="Password" error={errors?.password}>
          <PasswordInput
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormField>
        <FormField label="Confirm password" error={errors?.confirm}>
          <PasswordInput
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
          />
        </FormField>
        <CheckboxField
          label="I agree to the workspace terms"
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(checked === true)}
        />
        {errors?.agreed ? <InlineMessage tone="danger">{errors.agreed}</InlineMessage> : null}
        <Button type="submit" fullWidth>
          Create account
        </Button>
        {saved ? (
          <InlineMessage tone="success">
            Account saved on this page. This preview does not store a password.
          </InlineMessage>
        ) : null}
      </form>
      <Text size="sm" tone="muted">
        Already have an account? <Link href="/components/sign-in">Sign in</Link>
      </Text>
    </Stack>
  );
}

export const authBlocks = [
  {
    slug: "sign-in",
    name: "Sign in",
    category: "Blocks",
    description:
      "A centered sign-in form with email, password, and a dialog to request a reset link.",
    imports: [
      "Button",
      "CheckboxField",
      "Dialog",
      "FormField",
      "Input",
      "Link",
      "Logo",
      "PasswordInput",
      "Text",
    ],
    code: `<form noValidate onSubmit={signIn}>
  <Logo />
  <FormField label="Email" error={errors.email}>
    <Input type="email" autoComplete="email" value={email} onChange={setEmail} />
  </FormField>
  <FormField label="Password" error={errors.password}>
    <PasswordInput autoComplete="current-password" value={password} onChange={setPassword} />
  </FormField>
  <CheckboxField label="Remember me" checked={remember} onCheckedChange={setRemember} />
  <Dialog title="Reset password" confirmLabel="Send reset link" trigger={<Button type="button" variant="text">Reset password</Button>}>
    <FormField label="Email" error={errors.resetEmail}>
      <Input type="email" value={resetEmail} onChange={setResetEmail} />
    </FormField>
  </Dialog>
  <Button type="submit">Sign in</Button>
  <Text>
    New to this workspace? <Link href="/components/sign-up">Create an account</Link>
  </Text>
</form>`,
    Demo: SignInDemo,
  },
  {
    slug: "sign-up",
    name: "Sign up",
    category: "Blocks",
    description:
      "A centered sign-up form with a name, email, password, and agreement to the workspace terms.",
    imports: [
      "Button",
      "CheckboxField",
      "FormField",
      "InlineMessage",
      "Input",
      "Link",
      "Logo",
      "PasswordInput",
      "Text",
    ],
    code: `<form noValidate onSubmit={createAccount}>
  <Logo />
  <FormField label="Name" error={errors.name}>
    <Input autoComplete="name" value={name} onChange={setName} />
  </FormField>
  <FormField label="Email" error={errors.email}>
    <Input type="email" autoComplete="email" value={email} onChange={setEmail} />
  </FormField>
  <FormField label="Password" error={errors.password}>
    <PasswordInput autoComplete="new-password" value={password} onChange={setPassword} />
  </FormField>
  <FormField label="Confirm password" error={errors.confirm}>
    <PasswordInput autoComplete="new-password" value={confirm} onChange={setConfirm} />
  </FormField>
  <CheckboxField label="I agree to the workspace terms" checked={agreed} onCheckedChange={setAgreed} />
  {errors.agreed ? <InlineMessage tone="danger">{errors.agreed}</InlineMessage> : null}
  <Button type="submit">Create account</Button>
  <Text>
    Already have an account? <Link href="/components/sign-in">Sign in</Link>
  </Text>
</form>`,
    Demo: SignUpDemo,
  },
] as const satisfies readonly ComponentDoc[];
