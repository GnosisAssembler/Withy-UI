"use client";

import type { AvatarTone } from "../../../atoms/avatar";
import { Button } from "../../../atoms/button";
import { Heading } from "../../../atoms/heading";
import type { TagColor } from "../../../atoms/tag";
import { Text } from "../../../atoms/text";
import { Row } from "../../../layout/stack";
import { cn } from "../../../../lib/cn";

export type Role = "Admin" | "Member" | "Guest";
export type MemberStatus = "Active" | "Pending";

export type Member = {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
  tone: AvatarTone;
  status: MemberStatus;
};

export const roleOptions: { label: string; value: Role }[] = [
  { label: "Guest", value: "Guest" },
  { label: "Member", value: "Member" },
  { label: "Admin", value: "Admin" },
];

export const roleColor: Record<Role, TagColor> = {
  Admin: "indigo",
  Member: "teal",
  Guest: "pink",
};

const avatarTones = ["primary", "indigo", "pink", "info"] as const satisfies readonly AvatarTone[];

export function starterMembers(): Member[] {
  return [
    {
      id: "ivy",
      name: "Ivy Calder",
      email: "ivy@withy.dev",
      role: "Admin",
      initials: "IC",
      tone: "primary",
      status: "Active",
    },
    {
      id: "noah",
      name: "Noah Park",
      email: "noah@withy.dev",
      role: "Member",
      initials: "NP",
      tone: "indigo",
      status: "Active",
    },
    {
      id: "mina",
      name: "Mina Ortiz",
      email: "mina@ada.studio",
      role: "Guest",
      initials: "MO",
      tone: "pink",
      status: "Active",
    },
    {
      id: "jules",
      name: "Jules Nguyen",
      email: "jules@harbor.co",
      role: "Member",
      initials: "JN",
      tone: "info",
      status: "Active",
    },
    {
      id: "priya",
      name: "Priya Shah",
      email: "priya@lumen.dev",
      role: "Admin",
      initials: "PS",
      tone: "primary",
      status: "Active",
    },
    {
      id: "owen",
      name: "Owen Blake",
      email: "owen@northwind.io",
      role: "Guest",
      initials: "OB",
      tone: "indigo",
      status: "Active",
    },
  ];
}

export function isRole(value: string): value is Role {
  return roleOptions.some((option) => option.value === value);
}

export function emailError(value: string, submitted: boolean) {
  if (!submitted) return undefined;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return "Enter an email address, such as ivy@withy.dev.";
  }
  return undefined;
}

export function requiredError(value: string, submitted: boolean, message: string) {
  if (!submitted || value.trim().length > 0) return undefined;
  return message;
}

export function passwordError(value: string, submitted: boolean) {
  if (!submitted || value.length >= 8) return undefined;
  return "Use at least 8 characters.";
}

export function confirmPasswordError(value: string, password: string, submitted: boolean) {
  if (!submitted || value === password) return undefined;
  return "Enter the same password again.";
}

export function hasError(errors: Record<string, string | undefined>) {
  return Object.values(errors).some((error) => Boolean(error));
}

export function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? email;
  const name = local
    .split(/[._-]+/)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
  return name || email;
}

export function initialsFrom(value: string) {
  const words = value
    .replace(/@.*/, "")
    .split(/[\s._-]+/)
    .filter((part) => part.length > 0);
  const letters =
    words.length >= 2
      ? `${words[0]?.charAt(0) ?? ""}${words[1]?.charAt(0) ?? ""}`
      : (words[0] ?? value).slice(0, 2);
  return letters.toUpperCase() || "NW";
}

export function memberFromEmail(email: string, role: Role, index: number): Member {
  const trimmed = email.trim();
  const tone = avatarTones[index % avatarTones.length] ?? "primary";
  return {
    id: trimmed.toLowerCase(),
    name: nameFromEmail(trimmed),
    email: trimmed,
    role,
    initials: initialsFrom(trimmed),
    tone,
    status: "Pending",
  };
}

export function duplicateEmailError(email: string, people: readonly { email: string }[]) {
  const exists = people.some((person) => person.email.toLowerCase() === email.trim().toLowerCase());
  return exists ? "This email is already on the list." : undefined;
}

export function BlockIntro({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6", className)}>
      <Heading level={3} size={4} className="font-medium">
        {title}
      </Heading>
      <Text size="sm" tone="muted" className="mt-1">
        {description}
      </Text>
    </div>
  );
}

export function SectionIntro({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <Heading level={4} size={5} className="font-medium">
        {title}
      </Heading>
      <Text size="sm" tone="muted" className="mt-1">
        {description}
      </Text>
    </div>
  );
}

export function FormActions({
  submitLabel,
  cancelLabel = "Cancel",
  onCancel,
}: {
  submitLabel: string;
  cancelLabel?: string;
  onCancel?: () => void;
}) {
  return (
    <Row gap="sm" align="center" className="w-full justify-end">
      <Button type="button" variant="text" color="secondary" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button type="submit">{submitLabel}</Button>
    </Row>
  );
}
