"use client";

import { Button } from "../../atoms/button";
import { Text } from "../../atoms/text";
import { Box } from "../../layout/box";
import { Container } from "../../layout/container";
import { Column as GridColumn, Columns, Grid } from "../../layout/grid";
import {
  Layout,
  LayoutBody,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutPane,
} from "../../layout/layout";
import { Row, Stack } from "../../layout/stack";
import { Splitter, SplitterPanel, SplitterResizeTrigger } from "../../layout/splitter";
import { Logo } from "../../molecules/logo";
import { Footer } from "../../organisms/footer";
import { PageHeader } from "../../organisms/page-header";
import { AppShell } from "../app-shell";
import type { ComponentDoc } from "./types";

const tile = "rounded-sm border border-border text-[13px] text-heading";

export const layoutDocs = [
  {
    slug: "app-shell",
    name: "App shell",
    category: "Layout",
    description:
      "The app shell places the header, the main area, and the footer, and pads the page by 20, 25, and 30px as it widens.",
    imports: ["AppShell", "Footer", "Logo"],
    code: `<AppShell
  nav={[{ label: "Invoices", href: "/invoices" }]}
  logo={<Logo name="acme" mark={<AcmeMark />} />}
  footer={<Footer>© 2026 Acme Inc.</Footer>}
>
  <PageHeader title="Invoices" />
  …
</AppShell>`,
    Demo: () => (
      <div className="h-64 overflow-hidden rounded-sm border border-border [transform:translateZ(0)]">
        <AppShell
          nav={[
            { label: "Invoices", href: "#invoices" },
            { label: "Customers", href: "#customers" },
          ]}
          pathname="#invoices"
          logo={<Logo name="acme" href="#home" />}
          themeSwitcher={false}
          footer={<Footer>© 2026 Acme Inc.</Footer>}
        >
          <PageHeader title="Invoices" description="12 open, 3 overdue." />
        </AppShell>
      </div>
    ),
  },
  {
    slug: "box",
    name: "Box",
    category: "Layout",
    description: "A box pads the inside of a region by 12, 16, or 20px.",
    imports: ["Box"],
    code: `<Box padding="md">…</Box>`,
    Demo: () => (
      <div className="flex flex-wrap gap-2.5">
        <Box padding="sm" className={tile}>
          sm · 12px
        </Box>
        <Box padding="md" className={tile}>
          md · 16px
        </Box>
        <Box padding="lg" className={tile}>
          lg · 20px
        </Box>
      </div>
    ),
  },
  {
    slug: "container",
    name: "Container",
    category: "Layout",
    description:
      "A container caps the width. Fluid fills the main area, wide stops at 1280px, and narrow stops at 768px for reading.",
    imports: ["Container"],
    code: `<Container width="narrow">…</Container>`,
    Demo: () => (
      <Stack gap="sm">
        {(["fluid", "wide", "narrow"] as const).map((width) => (
          <Container key={width} width={width}>
            <Box padding="sm" className="rounded-xs bg-primary/10 text-[12px] text-primary">
              {width}
            </Box>
          </Container>
        ))}
      </Stack>
    ),
  },
  {
    slug: "grid",
    name: "Grid",
    category: "Layout",
    description:
      "Grid lays out equal columns that fold down on a narrow screen. Columns and Grid column align regions to the 12-column grid.",
    imports: ["Columns", "Grid", "GridColumn"],
    code: `<Grid columns={3}>…</Grid>

<Columns>
  <GridColumn span={8}>Content</GridColumn>
  <GridColumn span={4}>Pane</GridColumn>
</Columns>`,
    Demo: () => (
      <Stack gap="lg">
        <Grid columns={3}>
          {["Revenue", "Orders", "Refunds"].map((title) => (
            <Box key={title} padding="md" className={tile}>
              {title}
            </Box>
          ))}
        </Grid>
        <Columns>
          <GridColumn span={8}>
            <Box padding="md" className={tile}>
              Content · 8 columns
            </Box>
          </GridColumn>
          <GridColumn span={4}>
            <Box padding="md" className="rounded-sm bg-primary/10 text-[13px] text-primary">
              Pane · 4 columns
            </Box>
          </GridColumn>
        </Columns>
      </Stack>
    ),
  },
  {
    slug: "layout",
    name: "Layout",
    category: "Layout",
    description:
      "Layout places a header, the content, a start pane, an end pane, and a footer. The content stays first on a narrow screen.",
    imports: [
      "Layout",
      "LayoutBody",
      "LayoutContent",
      "LayoutFooter",
      "LayoutHeader",
      "LayoutPane",
    ],
    code: `<Layout>
  <LayoutHeader>…</LayoutHeader>
  <LayoutBody>
    <LayoutPane side="start">Filters</LayoutPane>
    <LayoutContent>Invoices</LayoutContent>
    <LayoutPane side="end">Details</LayoutPane>
  </LayoutBody>
  <LayoutFooter>…</LayoutFooter>
</Layout>`,
    Demo: () => (
      <Layout className="overflow-hidden rounded-sm border border-border">
        <LayoutHeader className="border-b border-border bg-muted px-3 py-2 text-[13px] font-medium text-heading">
          Header
        </LayoutHeader>
        <LayoutBody className="p-2">
          <LayoutPane
            side="start"
            className="rounded-xs bg-primary/10 px-3 py-4 text-[13px] text-primary"
          >
            Start pane
          </LayoutPane>
          <LayoutContent className="rounded-xs border border-dashed border-border px-3 py-4 text-[13px] text-text-2">
            Content
          </LayoutContent>
          <LayoutPane side="end" className="rounded-xs bg-muted px-3 py-4 text-[13px] text-text-2">
            End pane
          </LayoutPane>
        </LayoutBody>
        <LayoutFooter className="border-t border-border px-3 py-2 text-[12px] text-text-3">
          Footer
        </LayoutFooter>
      </Layout>
    ),
  },
  {
    slug: "stack",
    name: "Stack",
    category: "Layout",
    description:
      "Stack groups items down the page. Row groups them across and wraps. Rows stacks full-width bands 10px apart.",
    imports: ["Button", "Row", "Rows", "Stack"],
    code: `<Stack gap="sm">…</Stack>
<Row>
  <Button>Save changes</Button>
  <Button color="white">Cancel</Button>
</Row>`,
    Demo: () => (
      <Stack gap="lg">
        <Stack gap="sm">
          <Text size="sm" weight="medium" tone="heading">
            Stack
          </Text>
          <Box padding="sm" className={tile}>
            First
          </Box>
          <Box padding="sm" className={tile}>
            Second
          </Box>
        </Stack>
        <Row>
          <Button size="sm">Save changes</Button>
          <Button size="sm" color="white">
            Cancel
          </Button>
        </Row>
      </Stack>
    ),
  },
  {
    slug: "splitter",
    name: "Splitter",
    category: "Layout",
    description: "A splitter lets people resize panels by dragging the handle between them.",
    imports: [
      "Splitter",
      "SplitterContext",
      "SplitterPanel",
      "SplitterResizeTrigger",
      "SplitterResizeTriggerIndicator",
      "SplitterResizeTriggerSeparator",
      "useSplitterContext",
    ],
    code: `<Splitter panels={[{ id: "invoices" }, { id: "details" }]} defaultSize={[60, 40]}>
  <SplitterPanel id="invoices">Invoices</SplitterPanel>
  <SplitterResizeTrigger id="invoices:details" />
  <SplitterPanel id="details">Details</SplitterPanel>
</Splitter>`,
    Demo: () => (
      <Stack gap="lg">
        <Stack gap="sm">
          <Text size="sm" weight="medium" tone="heading">
            Horizontal
          </Text>
          <Splitter
            className="h-64 rounded-sm border border-border"
            panels={[{ id: "invoices" }, { id: "details" }]}
            defaultSize={[60, 40]}
          >
            <SplitterPanel
              id="invoices"
              className="flex items-center justify-center bg-muted text-[13px] text-heading"
            >
              Invoices
            </SplitterPanel>
            <SplitterResizeTrigger id="invoices:details" />
            <SplitterPanel
              id="details"
              className="flex items-center justify-center text-[13px] text-text-2"
            >
              Details
            </SplitterPanel>
          </Splitter>
        </Stack>
        <Stack gap="sm">
          <Text size="sm" weight="medium" tone="heading">
            Vertical
          </Text>
          <Splitter
            orientation="vertical"
            className="h-64 rounded-sm border border-border"
            panels={[{ id: "summary" }, { id: "activity" }]}
            defaultSize={[45, 55]}
          >
            <SplitterPanel
              id="summary"
              className="flex items-center justify-center bg-muted text-[13px] text-heading"
            >
              Summary
            </SplitterPanel>
            <SplitterResizeTrigger id="summary:activity" />
            <SplitterPanel
              id="activity"
              className="flex items-center justify-center text-[13px] text-text-2"
            >
              Activity
            </SplitterPanel>
          </Splitter>
        </Stack>
      </Stack>
    ),
  },
] as const satisfies readonly ComponentDoc[];
