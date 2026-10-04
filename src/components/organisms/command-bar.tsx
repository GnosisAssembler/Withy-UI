"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Kbd } from "@/components/atoms/kbd";
import { cn } from "@/lib/cn";

export type CommandItem = {
  id: string;
  label: string;
  group: string;
  keywords?: string;
  href?: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
};

type CommandBarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  shortcut?: boolean;
};

function CommandPanel({
  items,
  onOpenChange,
}: {
  items: CommandItem[];
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);

  const filtered = items.filter((item) => {
    const haystack = `${item.label} ${item.group} ${item.keywords ?? ""}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  const rows = filtered.map((item, index) => ({
    item,
    index,
    showGroup: index === 0 || filtered[index - 1]?.group !== item.group,
  }));

  React.useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>("[data-active='true']");
    node?.scrollIntoView?.({ block: "nearest" });
  }, [active, filtered.length]);

  function run(item: CommandItem) {
    item.onSelect?.();
    if (item.href) router.push(item.href);
    onOpenChange(false);
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, Math.max(filtered.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && filtered[active]) {
      event.preventDefault();
      run(filtered[active]);
    }
  }

  return (
    <>
      <DialogPrimitive.Title className="sr-only">Command bar</DialogPrimitive.Title>
      <DialogPrimitive.Description className="sr-only">
        Search pages and actions
      </DialogPrimitive.Description>
      <div className="relative border-b border-border">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-3" />
        <input
          autoFocus
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onInputKeyDown}
          aria-label="Search commands"
          aria-controls="command-results"
          aria-activedescendant={filtered[active] ? `command-${filtered[active].id}` : undefined}
          placeholder="Search pages and actions"
          className="h-12 w-full bg-transparent pr-4 pl-10 text-sm text-heading outline-none placeholder:text-text-3"
        />
      </div>
      <div ref={listRef} id="command-results" className="max-h-80 overflow-y-auto p-2">
        {rows.length === 0 ? (
          <p className="px-3 py-8 text-center text-[13px] text-text-3">No matching commands.</p>
        ) : (
          <ul role="listbox" aria-label="Commands">
            {rows.map(({ item, index, showGroup }) => {
              const selected = index === active;
              return (
                <React.Fragment key={item.id}>
                  {showGroup ? (
                    <li className="px-2 pt-2 pb-1 font-inter text-[10px] font-semibold tracking-[0.5px] text-text-3 uppercase">
                      {item.group}
                    </li>
                  ) : null}
                  <li
                    id={`command-${item.id}`}
                    role="option"
                    aria-selected={selected}
                    data-active={selected ? "true" : undefined}
                  >
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-sm px-2 py-2 text-left text-[13px] text-text-2",
                        selected &&
                          "bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-heading",
                      )}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => run(item)}
                    >
                      {item.icon ? (
                        <span className="text-text-3 [&_svg]:size-4">{item.icon}</span>
                      ) : null}
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    </button>
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        )}
      </div>
      <footer className="flex items-center gap-3 border-t border-border px-3 py-2 text-[11px] text-text-3">
        <span className="inline-flex items-center gap-1">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          move
        </span>
        <span className="inline-flex items-center gap-1">
          <Kbd>↵</Kbd>
          open
        </span>
        <span className="ml-auto inline-flex items-center gap-1">
          <Kbd>esc</Kbd>
          close
        </span>
      </footer>
    </>
  );
}

export function CommandBar({ open, onOpenChange, items, shortcut = false }: CommandBarProps) {
  React.useEffect(() => {
    if (!shortcut) return;
    function onKey(event: KeyboardEvent) {
      if (event.repeat) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange, shortcut]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#0f1520]/70" />
        <DialogPrimitive.Content
          className="fixed top-[12%] left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-sm border border-border bg-card text-text shadow-[0_1rem_3rem_rgb(0_0_0/0.175)] focus:outline-none"
          aria-label="Command bar"
        >
          {open ? <CommandPanel items={items} onOpenChange={onOpenChange} /> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
