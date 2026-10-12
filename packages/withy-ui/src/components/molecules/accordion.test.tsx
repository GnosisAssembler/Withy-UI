import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

function Sections({
  taxDisabled = false,
  as,
}: {
  taxDisabled?: boolean;
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
}) {
  return (
    <>
      <AccordionItem value="billing">
        <AccordionTrigger as={as}>Billing address</AccordionTrigger>
        <AccordionContent>
          Invoices go to Northwind Trading, 18 Harbor Street, Portland.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="payment">
        <AccordionTrigger as={as}>Payment method</AccordionTrigger>
        <AccordionContent>Invoices are charged to the card ending in 4242.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="tax" disabled={taxDisabled}>
        <AccordionTrigger as={as}>Tax details</AccordionTrigger>
        <AccordionContent>The tax id on these invoices is 12-3456789.</AccordionContent>
      </AccordionItem>
    </>
  );
}

describe("Accordion", () => {
  it("opens the chosen section and keeps the others closed", () => {
    render(
      <Accordion type="single" defaultValue="billing">
        <Sections />
      </Accordion>,
    );

    const billing = screen.getByRole("button", { name: "Billing address" });
    expect(billing).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Payment method" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("region", { name: "Billing address" })).toHaveTextContent(
      "Northwind Trading",
    );
    expect(screen.queryByText(/4242/)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Billing address" })).toContainElement(
      billing,
    );
  });

  it("closes the open section, and opens another in its place", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" defaultValue="billing">
        <Sections />
      </Accordion>,
    );

    await user.click(screen.getByRole("button", { name: "Billing address" }));
    expect(screen.queryByText(/Northwind Trading/)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Payment method" }));
    expect(screen.getByText(/4242/)).toBeInTheDocument();
    expect(screen.queryByText(/Northwind Trading/)).not.toBeInTheDocument();
  });

  it("keeps one section open when it cannot collapse", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible={false} defaultValue="billing">
        <Sections />
      </Accordion>,
    );

    await user.click(screen.getByRole("button", { name: "Billing address" }));
    expect(screen.getByText(/Northwind Trading/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Payment method" }));
    expect(screen.getByText(/4242/)).toBeInTheDocument();
    expect(screen.queryByText(/Northwind Trading/)).not.toBeInTheDocument();
  });

  it("keeps several sections open", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Accordion type="multiple" defaultValue={["billing"]} onValueChange={onValueChange}>
        <Sections />
      </Accordion>,
    );

    await user.click(screen.getByRole("button", { name: "Payment method" }));
    expect(onValueChange).toHaveBeenCalledWith(["billing", "payment"]);
    expect(screen.getByText(/Northwind Trading/)).toBeInTheDocument();
    expect(screen.getByText(/4242/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Billing address" }));
    expect(screen.queryByText(/Northwind Trading/)).not.toBeInTheDocument();
    expect(screen.getByText(/4242/)).toBeInTheDocument();
  });

  it("keeps a disabled section closed", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" defaultValue="billing">
        <Sections taxDisabled />
      </Accordion>,
    );

    const tax = screen.getByRole("button", { name: "Tax details" });
    expect(tax).toBeDisabled();
    await user.click(tax);
    expect(screen.queryByText(/12-3456789/)).not.toBeInTheDocument();
    expect(screen.getByText(/Northwind Trading/)).toBeInTheDocument();
  });

  it("reports the next section without changing a controlled value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Accordion type="single" value="billing" onValueChange={onValueChange}>
        <Sections />
      </Accordion>,
    );

    await user.click(screen.getByRole("button", { name: "Payment method" }));
    expect(onValueChange).toHaveBeenCalledWith("payment");
    expect(screen.getByText(/Northwind Trading/)).toBeInTheDocument();
    expect(screen.queryByText(/4242/)).not.toBeInTheDocument();
  });

  it("uses the heading level it is given", () => {
    const { rerender } = render(
      <Accordion type="single" defaultValue="billing">
        <Sections as="h2" />
      </Accordion>,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Billing address" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 3, name: "Billing address" }),
    ).not.toBeInTheDocument();

    rerender(
      <Accordion type="single" defaultValue="billing">
        <Sections />
      </Accordion>,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Payment method" })).toBeInTheDocument();
  });

  it("moves between sections with the keyboard and skips a disabled one", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" defaultValue="billing">
        <Sections taxDisabled />
      </Accordion>,
    );

    const billing = screen.getByRole("button", { name: "Billing address" });
    const payment = screen.getByRole("button", { name: "Payment method" });
    billing.focus();
    await user.keyboard("{ArrowDown}");
    expect(payment).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(billing).toHaveFocus();
    await user.keyboard("{End}");
    expect(payment).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByText(/4242/)).toBeInTheDocument();
    expect(screen.queryByText(/Northwind Trading/)).not.toBeInTheDocument();
  });
});
