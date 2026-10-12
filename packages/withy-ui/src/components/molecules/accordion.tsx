"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { Icon } from "../atoms/icon";
import { cn } from "../../lib/cn";

export function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      {...props}
      // A single accordion can close its open section. Pass collapsible={false} to keep one open.
      {...(props.type === "single" ? { collapsible: props.collapsible ?? true } : {})}
      className={cn(
        "w-full min-w-0 overflow-hidden rounded-sm border border-border bg-card",
        className,
      )}
    />
  );
}

export function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    />
  );
}

export function AccordionTrigger({
  as: Tag = "h3",
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  /** Heading around the trigger. Defaults to h3, under a card title. */
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
}) {
  return (
    <AccordionPrimitive.Header asChild>
      <Tag className="m-0">
        <AccordionPrimitive.Trigger
          className={cn(
            "group flex w-full min-w-0 items-center justify-between gap-3 px-5 py-3 text-left text-sm font-medium text-heading outline-none transition-colors duration-150 ease-out hover:bg-[color-mix(in_srgb,var(--heading)_6%,transparent)] focus-visible:ring-4 focus-visible:ring-primary/25 focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-60 data-[state=open]:text-primary motion-reduce:transition-none",
            className,
          )}
          {...props}
        >
          <span className="min-w-0 flex-1">{children}</span>
          <Icon
            icon={ChevronDown}
            className="shrink-0 text-text-3 transition duration-150 ease-out group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary motion-reduce:transition-none"
          />
        </AccordionPrimitive.Trigger>
      </Tag>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content className="withy-accordion-content overflow-hidden" {...props}>
      <div className={cn("px-5 pb-3 text-[13px] text-text-2", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
