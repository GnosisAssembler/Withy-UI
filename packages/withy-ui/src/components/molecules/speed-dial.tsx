"use client";

import * as React from "react";
import { Plus, type LucideIcon } from "lucide-react";
import { Button, buttonVariants, type ButtonTone } from "../atoms/button";
import { cn } from "../../lib/cn";

export type SpeedDialDirection = "up" | "down" | "left" | "right";

export type SpeedDialAction = {
  label: string;
  icon: LucideIcon;
  onSelect?: () => void;
  disabled?: boolean;
};

export type SpeedDialProps = {
  /** Accessible name of the button that opens the dial. */
  label: string;
  actions: readonly SpeedDialAction[];
  /** Icon on the button. Plus by default, and it turns 45 degrees while open. */
  icon?: LucideIcon;
  /** Icon shown while open, instead of turning the main icon. */
  openIcon?: LucideIcon;
  direction?: SpeedDialDirection;
  /** `always` keeps each action label in view. `hover` shows it on hover and focus. */
  labels?: "always" | "hover";
  /** Open while the pointer is over the dial. A click then keeps it open. */
  openOnHover?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  color?: ButtonTone;
  className?: string;
};

const awayKey: Record<SpeedDialDirection, string> = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
};

const towardKey: Record<SpeedDialDirection, string> = {
  up: "ArrowDown",
  down: "ArrowUp",
  left: "ArrowRight",
  right: "ArrowLeft",
};

const menuPosition: Record<SpeedDialDirection, string> = {
  up: "bottom-full left-1/2 mb-2.5 -translate-x-1/2 flex-col-reverse",
  down: "top-full left-1/2 mt-2.5 -translate-x-1/2 flex-col",
  left: "top-1/2 right-full mr-2.5 -translate-y-1/2 flex-row-reverse",
  right: "top-1/2 left-full ml-2.5 -translate-y-1/2 flex-row",
};

const labelPlacement: Record<SpeedDialDirection, string> = {
  up: "right-full top-1/2 mr-2 -translate-y-1/2",
  down: "right-full top-1/2 mr-2 -translate-y-1/2",
  left: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  right: "bottom-full left-1/2 mb-2 -translate-x-1/2",
};

const hintPlacement: Record<SpeedDialDirection, string> = {
  up: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  down: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

const closedMotion: Record<SpeedDialDirection, string> = {
  up: "translate-y-2",
  down: "-translate-y-2",
  left: "translate-x-2",
  right: "-translate-x-2",
};

const arrowKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

function deltaFor(key: string, direction: SpeedDialDirection): 1 | -1 {
  if (key === awayKey[direction]) return 1;
  if (key === towardKey[direction]) return -1;
  return key === "ArrowDown" || key === "ArrowRight" ? 1 : -1;
}

function DialGlyph({
  icon: Glyph,
  openIcon: OpenGlyph,
  open,
}: {
  icon: LucideIcon;
  openIcon?: LucideIcon;
  open: boolean;
}) {
  if (!OpenGlyph) {
    return (
      <Glyph
        aria-hidden
        className={cn(
          "transition-transform duration-150 ease-out motion-reduce:transition-none",
          open && "rotate-45",
        )}
      />
    );
  }

  return (
    <span className="inline-grid place-items-center">
      <Glyph
        aria-hidden
        className={cn(
          "col-start-1 row-start-1 transition-opacity duration-150 motion-reduce:transition-none",
          open && "opacity-0",
        )}
      />
      <OpenGlyph
        aria-hidden
        className={cn(
          "col-start-1 row-start-1 transition-opacity duration-150 motion-reduce:transition-none",
          open ? "opacity-100" : "opacity-0",
        )}
      />
    </span>
  );
}

const actionFace = cn(
  buttonVariants({ variant: "contained", color: "white", size: "sm", shape: "pill", icon: true }),
  "shadow-lg group-focus-visible:ring-4 group-focus-visible:ring-primary/35",
);

const actionLabel =
  "absolute z-10 rounded-xs bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg";

export function SpeedDial({
  label,
  actions,
  icon = Plus,
  openIcon,
  direction = "up",
  labels = "always",
  openOnHover = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  color = "primary",
  className,
}: SpeedDialProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;
  const menuId = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const actionRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const pendingFocus = React.useRef<number | null>(null);
  const pinnedRef = React.useRef(false);
  const requested = React.useRef<boolean | null>(null);
  const horizontal = direction === "left" || direction === "right";

  const commit = React.useCallback(
    (next: boolean, pin = false) => {
      if (next === open || requested.current === next) return;
      requested.current = next;
      queueMicrotask(() => {
        requested.current = null;
      });
      pinnedRef.current = next ? pin : false;
      if (openProp === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, open, openProp],
  );

  React.useLayoutEffect(() => {
    if (!open) pendingFocus.current = null;
  }, [open]);

  React.useLayoutEffect(() => {
    const index = pendingFocus.current;
    if (!open || index == null) return;
    actionRefs.current[index]?.focus({ preventScroll: true });
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (target instanceof Node && rootRef.current?.contains(target)) return;
      const active = document.activeElement;
      if (active instanceof HTMLElement && menuRef.current?.contains(active)) active.blur();
      commit(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [commit, open]);

  function focusTrigger() {
    triggerRef.current?.focus({ preventScroll: true });
  }

  function activate(action: SpeedDialAction) {
    if (action.disabled) return;
    action.onSelect?.();
    focusTrigger();
    commit(false);
  }

  function move(delta: 1 | -1) {
    if (actions.length === 0) {
      commit(true);
      return;
    }
    if (!open) {
      pendingFocus.current = 0;
      commit(true);
      return;
    }
    const current = actionRefs.current.findIndex((node) => node === document.activeElement);
    const next =
      current === -1
        ? delta < 0
          ? actions.length - 1
          : 0
        : (current + delta + actions.length) % actions.length;
    actionRefs.current[next]?.focus({ preventScroll: true });
  }

  function onTriggerClick() {
    if (!open) {
      commit(true, true);
      return;
    }
    // A click after a hover open keeps the dial open until the next click.
    if (openOnHover && !pinnedRef.current) {
      pinnedRef.current = true;
      return;
    }
    commit(false);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      if (!open) return;
      event.preventDefault();
      event.stopPropagation();
      focusTrigger();
      commit(false);
      return;
    }
    if (!arrowKeys.has(event.key)) return;
    event.preventDefault();
    move(deltaFor(event.key, direction));
  }

  function onBlur(event: React.FocusEvent) {
    const next = event.relatedTarget;
    if (next instanceof Node && rootRef.current?.contains(next)) return;
    commit(false);
  }

  return (
    <div
      ref={rootRef}
      className={cn("relative z-30 inline-flex", className)}
      data-state={open ? "open" : "closed"}
      data-direction={direction}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onPointerEnter={(event) => {
        if (!openOnHover || event.pointerType === "touch") return;
        commit(true);
      }}
      onPointerLeave={(event) => {
        if (!openOnHover || pinnedRef.current) return;
        const next = event.relatedTarget;
        if (next instanceof Node && rootRef.current?.contains(next)) return;
        commit(false);
      }}
    >
      <Button
        ref={triggerRef}
        icon
        shape="pill"
        color={color}
        size="lg"
        className="group relative z-10 shadow-lg"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={onTriggerClick}
      >
        <span
          aria-hidden
          className={cn(
            actionLabel,
            "pointer-events-none opacity-0 transition-opacity duration-150",
            "group-hover:opacity-100 group-focus-visible:opacity-100",
            open && "hidden",
            hintPlacement[direction],
          )}
        >
          {label}
        </span>
        <DialGlyph icon={icon} openIcon={openIcon} open={open} />
      </Button>
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label={label}
        aria-orientation={horizontal ? "horizontal" : "vertical"}
        aria-hidden={open ? undefined : true}
        inert={open ? undefined : true}
        className={cn(
          "absolute z-10 flex w-max items-center gap-2.5",
          menuPosition[direction],
          !open && "pointer-events-none",
        )}
      >
        {actions.map((action, index) => {
          const Glyph = action.icon;
          const delay = open ? index * 30 : (actions.length - 1 - index) * 20;
          return (
            <button
              key={`${action.label}-${index}`}
              ref={(node) => {
                actionRefs.current[index] = node;
              }}
              type="button"
              role="menuitem"
              tabIndex={-1}
              aria-disabled={action.disabled || undefined}
              className={cn(
                "group relative shrink-0 outline-none",
                "transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none",
                open
                  ? "translate-x-0 translate-y-0 scale-100 opacity-100"
                  : cn("scale-90 opacity-0", closedMotion[direction]),
                horizontal ? "inline-grid justify-items-center" : "inline-flex",
                action.disabled && "cursor-not-allowed opacity-65",
              )}
              style={{ transitionDelay: `${delay}ms` }}
              onClick={() => activate(action)}
            >
              <span
                className={cn(
                  actionLabel,
                  labelPlacement[direction],
                  labels === "hover" &&
                    "opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100",
                )}
              >
                {action.label}
              </span>
              {horizontal ? (
                <span
                  className="invisible col-start-1 row-start-1 block h-0 min-h-0 w-max overflow-hidden px-2 whitespace-nowrap"
                  aria-hidden
                >
                  {action.label}
                </span>
              ) : null}
              <span
                aria-hidden
                className={cn(
                  actionFace,
                  horizontal && "col-start-1 row-start-1",
                  !action.disabled &&
                    "group-hover:bg-[color-mix(in_srgb,var(--white-button)_92%,var(--heading))]",
                )}
              >
                <Glyph />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
