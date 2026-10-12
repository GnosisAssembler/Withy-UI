import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Box } from "./box";
import { Container } from "./container";
import { Column, Columns } from "./grid";
import { Layout, LayoutContent, LayoutPane } from "./layout";
import { Row, Stack } from "./stack";

describe("layout", () => {
  it("pads a box and stacks its contents", () => {
    render(
      <Stack>
        <Box padding="md">Padded</Box>
        <Row>
          <span>Left</span>
        </Row>
      </Stack>,
    );
    expect(screen.getByText("Padded")).toHaveClass("p-4");
    expect(screen.getByText("Left").parentElement).toHaveClass("flex");
  });

  it("caps a narrow container and spans a column", () => {
    const { container } = render(
      <Container width="narrow">
        <Columns>
          <Column span={4}>Quarter</Column>
        </Columns>
      </Container>,
    );
    expect(container.firstElementChild).toHaveClass("max-w-[768px]");
    expect(screen.getByText("Quarter")).toHaveClass("md:col-span-4");
  });

  it("keeps page content ahead of the start pane on a narrow screen", () => {
    render(
      <Layout>
        <LayoutPane side="start">Filters</LayoutPane>
        <LayoutContent>Report</LayoutContent>
      </Layout>,
    );
    expect(screen.getByText("Filters").tagName).toBe("ASIDE");
    expect(screen.getByText("Filters")).toHaveClass("order-2");
    expect(screen.getByText("Report")).toHaveClass("order-1");
  });
});
