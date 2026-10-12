"use client";

import * as React from "react";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { Link } from "../atoms/link";
import { CheckboxField } from "../molecules/choice-field";
import { Logo } from "../molecules/logo";
import { FormField } from "../molecules/form-field";
import { InlineMessage } from "../molecules/inline-message";
import { PasswordInput } from "../molecules/password-input";
import { SproutMark } from "../atoms/sprout";

export function SignInTemplate({ mode = "sign-in" }: { mode?: "sign-in" | "sign-up" }) {
  const signUp = mode === "sign-up";
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [submitted, setSubmitted] = React.useState(false);
  const emailError = submitted && !email.includes("@") ? "Enter a valid email address." : undefined;
  const passwordError = submitted && password.length < 8 ? "Use at least 8 characters." : undefined;
  const nameError = submitted && signUp && name.trim().length < 2 ? "Enter your name." : undefined;
  const confirmError =
    submitted && signUp && confirm !== password ? "Passwords do not match." : undefined;
  const valid =
    email.includes("@") &&
    password.length >= 8 &&
    (!signUp || (name.trim().length >= 2 && confirm === password && remember));

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-brand text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #8EE7EF 0, transparent 28%), radial-gradient(circle at 80% 70%, #5ED4E2 0, transparent 32%)",
          }}
        />
        <Logo href="/" inverse />
        <div className="relative max-w-md">
          <SproutMark className="mb-4 size-10" />
          <h1 className="text-[2.1875rem] font-medium tracking-[-0.5px] text-white">
            A quiet place to grow the product.
          </h1>
          <p className="mt-4 text-sm text-white/80">
            Withy UI keeps the density and type of a classic admin dashboard, then lets you rebuild
            every screen from atoms upward.
          </p>
        </div>
        <p className="relative text-xs text-white/70">Light and dark skins included.</p>
      </section>
      <section className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h2 className="text-[1.53125rem] font-medium text-heading">
            {signUp ? "Create an account" : "Sign in"}
          </h2>
          <p className="mt-1 mb-6 text-[13px] text-text-3">
            {signUp
              ? "Start a workspace with your email."
              : "Use your workspace email to continue."}
          </p>
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
            noValidate
          >
            {signUp ? (
              <FormField label="Name" htmlFor="name" error={nameError}>
                <Input
                  autoComplete="name"
                  placeholder="Ivy Calder"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </FormField>
            ) : null}
            <FormField label="Email" htmlFor="email" error={emailError}>
              <Input
                type="email"
                autoComplete="email"
                placeholder="ivy@withy.dev"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormField>
            <FormField label="Password" htmlFor="password" error={passwordError}>
              <PasswordInput
                autoComplete={signUp ? "new-password" : "current-password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormField>
            {signUp ? (
              <FormField label="Confirm password" htmlFor="confirm" error={confirmError}>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                />
              </FormField>
            ) : null}
            <div className="flex items-center justify-between gap-3">
              <CheckboxField
                id="remember"
                label={signUp ? "I agree to the workspace terms" : "Remember me"}
                checked={remember}
                onCheckedChange={(checked) => setRemember(checked === true)}
              />
              {signUp ? null : (
                <Button variant="text" size="sm" type="button">
                  Forgot password
                </Button>
              )}
            </div>
            <Button type="submit" fullWidth>
              {signUp ? "Create account" : "Sign in"}
            </Button>
            {submitted && valid ? (
              <InlineMessage tone="success">
                {signUp
                  ? "Account preview created. This screen does not store a password."
                  : "Signed in as a preview. This screen does not create an account."}
              </InlineMessage>
            ) : null}
          </form>
          <p className="mt-6 text-[13px] text-text-3">
            {signUp ? (
              <>
                Already have an account? <Link href="/signin">Sign in</Link>
              </>
            ) : (
              <>
                New to Withy UI? <Link href="/signup">Create an account</Link>
              </>
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
