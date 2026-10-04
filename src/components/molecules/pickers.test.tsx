import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/components/molecules/tooltip";
import { TimePicker } from "@/components/molecules/time-picker";
import { SelectPicker } from "@/components/molecules/select-picker";
import { ThemeProvider } from "@/components/theme/theme-provider";

describe("pickers", () => {
  it("opens the time picker and creates a select option", async () => {
    const user = userEvent.setup();
    const created: string[] = [];
    render(
      <ThemeProvider>
        <TooltipProvider>
          <TimePicker value="09:30" />
          <SelectPicker
            options={[{ label: "Design", value: "design" }]}
            value="design"
            placeholder="Tag"
            onCreate={(label) => created.push(label)}
          />
        </TooltipProvider>
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: /9:30 AM/ }));
    expect(screen.getAllByRole("button", { name: "10" }).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Design" }));
    await user.type(screen.getByRole("textbox", { name: "Search or create" }), "Launch");
    await user.click(screen.getByRole("button", { name: "Create “Launch”" }));
    expect(created).toEqual(["Launch"]);
  });
});
