import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/components/molecules/tooltip";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { CalendarPageTemplate } from "./calendar-page";

describe("CalendarPageTemplate", () => {
  it("shows October 2026 and the selected day's events", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TooltipProvider>
          <CalendarPageTemplate />
        </TooltipProvider>
      </ThemeProvider>,
    );

    expect(screen.getByRole("heading", { name: "October 2026" })).toBeInTheDocument();
    expect(screen.getAllByText("Sprint planning").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByRole("heading", { name: "November 2026" })).toBeInTheDocument();
  });
});
