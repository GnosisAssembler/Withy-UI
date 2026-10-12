import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Copy, Printer, Save } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { SpeedDial, type SpeedDialAction } from "./speed-dial";

function sample(onSelect?: {
  copy?: () => void;
  save?: () => void;
  print?: () => void;
}): SpeedDialAction[] {
  return [
    { label: "Copy", icon: Copy, onSelect: onSelect?.copy },
    { label: "Save", icon: Save, onSelect: onSelect?.save },
    { label: "Print", icon: Printer, onSelect: onSelect?.print },
  ];
}

describe("SpeedDial", () => {
  it("opens a menu of actions and runs the chosen one", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    render(<SpeedDial label="Create" actions={sample({ copy: onCopy })} />);

    const trigger = screen.getByRole("button", { name: "Create" });
    expect(trigger).toHaveAccessibleName("Create");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(trigger);

    const menu = screen.getByRole("menu", { name: "Create" });
    expect(menu).toHaveAttribute("aria-orientation", "vertical");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", menu.id);

    await user.click(screen.getByRole("menuitem", { name: "Copy" }));

    expect(onCopy).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("moves with the arrow keys, wraps, and closes on escape", async () => {
    const user = userEvent.setup();
    const onPrint = vi.fn();
    render(<SpeedDial label="Create" actions={sample({ print: onPrint })} />);
    const trigger = screen.getByRole("button", { name: "Create" });
    trigger.focus();

    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("menuitem", { name: "Copy" })).toHaveFocus();

    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("menuitem", { name: "Save" })).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Copy" })).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Print" })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();

    await user.keyboard("{ArrowUp}{ArrowUp}{ArrowUp}{Enter}");
    expect(onPrint).toHaveBeenCalledOnce();
    expect(trigger).toHaveFocus();
  });

  it("follows the open direction", async () => {
    const user = userEvent.setup();
    render(<SpeedDial label="Create" direction="right" actions={sample()} />);
    const trigger = screen.getByRole("button", { name: "Create" });
    trigger.focus();

    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("menu")).toHaveAttribute("aria-orientation", "horizontal");
    expect(screen.getByRole("menuitem", { name: "Copy" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("menuitem", { name: "Save" })).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("menuitem", { name: "Copy" })).toHaveFocus();
  });

  it("does not run a disabled action", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <SpeedDial
        label="Create"
        actions={[
          { label: "Copy", icon: Copy },
          { label: "Save", icon: Save, disabled: true, onSelect: onSave },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Create" }));
    const save = screen.getByRole("menuitem", { name: "Save" });
    expect(save).toHaveAttribute("aria-disabled", "true");
    await user.click(save);

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("closes when the pointer goes outside", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Elsewhere</button>
        <SpeedDial label="Create" actions={sample()} />
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Create" }));
    await user.click(screen.getByRole("button", { name: "Elsewhere" }));

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("reports open changes without opening when it is controlled", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <SpeedDial label="Create" open={false} onOpenChange={onOpenChange} actions={sample()} />,
    );

    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens while hovered, and a click keeps it open", async () => {
    const user = userEvent.setup();
    render(<SpeedDial label="Create" openOnHover actions={sample()} />);
    const trigger = screen.getByRole("button", { name: "Create" });

    await user.hover(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.unhover(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.hover(trigger);
    await user.click(trigger);
    await user.unhover(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });
});
