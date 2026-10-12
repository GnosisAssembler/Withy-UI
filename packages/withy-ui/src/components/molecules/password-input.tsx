"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../atoms/input";
import { cn } from "../../lib/cn";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type">;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <Input type={visible ? "text" : "password"} className={cn("pr-10", className)} {...props} />
      <button
        type="button"
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-xs p-1 text-text-3 outline-none hover:text-heading focus-visible:ring-4 focus-visible:ring-primary/25"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
