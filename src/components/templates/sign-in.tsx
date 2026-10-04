"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { Checkbox } from "@/components/atoms/checkbox";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Logo } from "@/components/molecules/logo";
import { FormField } from "@/components/molecules/form-field";
import { PasswordInput } from "@/components/molecules/password-input";
import { SproutMark } from "@/components/atoms/sprout";

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
              "radial-gradient(circle at 20% 20%, #69b2f8 0, transparent 28%), radial-gradient(circle at 80% 70%, #0168fa 0, transparent 32%)",
          }}
        />
        <Logo href="/" inverse />
        <div className="relative max-w-md">
          <SproutMark className="mb-4 size-10" />
          <h1 className="text-[2.1875rem] font-medium tracking-[-0.5px] text-white">
            A quiet place to grow the product.
          </h1>
          <p className="mt-4 text-sm text-white/80">
            Sprig keeps the density, type, and blue of a classic admin dashboard, then lets you
            rebuild every screen from atoms upward.
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
                  id="name"
                  autoComplete="name"
                  placeholder="Ivy Calder"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  aria-invalid={Boolean(nameError)}
                />
              </FormField>
            ) : null}
            <FormField label="Email" htmlFor="email" error={emailError}>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="ivy@sprig.dev"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? "email-error" : undefined}
              />
            </FormField>
            <FormField label="Password" htmlFor="password" error={passwordError}>
              <PasswordInput
                id="password"
                autoComplete={signUp ? "new-password" : "current-password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? "password-error" : undefined}
              />
            </FormField>
            {signUp ? (
              <FormField label="Confirm password" htmlFor="confirm" error={confirmError}>
                <PasswordInput
                  id="confirm"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  aria-invalid={Boolean(confirmError)}
                />
              </FormField>
            ) : null}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(checked === true)}
                />
                <Label htmlFor="remember">
                  {signUp ? "I agree to the workspace terms" : "Remember me"}
                </Label>
              </div>
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
              <p className="text-[13px] text-success" role="status">
                {signUp
                  ? "Account preview created. This screen does not store a password."
                  : "Signed in as a preview. This screen does not create an account."}
              </p>
            ) : null}
          </form>
          <p className="mt-6 text-[13px] text-text-3">
            {signUp ? (
              <>
                Already have an account?{" "}
                <Link href="/signin" className="font-medium text-primary">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New to Sprig?{" "}
                <Link href="/signup" className="font-medium text-primary">
                  Create an account
                </Link>
              </>
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
