import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/components/molecules/tooltip";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Header } from "./header";

describe("Header", () => {
  it("opens the command bar from the top bar search", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TooltipProvider>
          <Header />
        </TooltipProvider>
      </ThemeProvider>,
    );

    await user.click(screen.getAllByRole("button", { name: "Search Sprig" })[0]);

    expect(screen.getByRole("dialog", { name: "Command bar" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Foundations" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Mail" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Contacts" })).not.toBeInTheDocument();
  });
});
