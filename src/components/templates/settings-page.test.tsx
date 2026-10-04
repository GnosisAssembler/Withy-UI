import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ToastProvider } from "@/components/molecules/toast";
import { TooltipProvider } from "@/components/molecules/tooltip";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SettingsPageTemplate } from "./settings-page";
import { SignInTemplate } from "./sign-in";

describe("SettingsPageTemplate", () => {
  it("saves and shows a toast", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TooltipProvider>
          <ToastProvider>
            <SettingsPageTemplate />
          </ToastProvider>
        </TooltipProvider>
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Save settings" }));
    expect(await screen.findByText("Settings saved")).toBeInTheDocument();
  });
});

describe("SignInTemplate", () => {
  it("offers account creation", () => {
    render(<SignInTemplate mode="sign-up" />);
    expect(screen.getByRole("heading", { name: "Create an account" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument();
  });
});
