import type { FormEvent } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../atoms/button";
import { Dialog } from "./dialog";

describe("Dialog", () => {
  it("repeats the verb on a danger confirm and closes when it is done", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <Dialog
        tone="danger"
        title="Delete invoice #1048?"
        confirmLabel="Delete invoice"
        onConfirm={onConfirm}
        trigger={<Button>Delete invoice</Button>}
      >
        This cannot be undone.
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "Delete invoice" }));
    const dialog = screen.getByRole("dialog", { name: "Delete invoice #1048?" });
    await user.click(
      screen
        .getAllByRole("button", { name: "Delete invoice" })
        .find((button) => dialog.contains(button))!,
    );

    expect(onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("stays open when an async confirm fails", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog
        open
        onOpenChange={onOpenChange}
        title="Archive order?"
        confirmLabel="Archive order"
        onConfirm={() => Promise.reject(new Error("Network"))}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Archive order" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Archive order" })).toBeEnabled(),
    );
    expect(screen.getByRole("dialog", { name: "Archive order?" })).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("uses confirm actions instead of a custom footer", () => {
    render(
      <Dialog
        open
        onOpenChange={() => undefined}
        title="Delete invoice #1048?"
        confirmLabel="Delete invoice"
        footer={<button type="button">Copy link</button>}
      />,
    );

    expect(screen.getByRole("button", { name: "Delete invoice" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Copy link" })).not.toBeInTheDocument();
  });

  it("submits a form from the footer", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());
    render(
      <Dialog
        open
        onOpenChange={() => undefined}
        title="Create report"
        onSubmit={onSubmit}
        footer={<Button type="submit">Create report</Button>}
      >
        <input aria-label="Report name" />
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "Create report" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
