import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Kbd } from "@/components/atoms/kbd";
import { Progress } from "@/components/atoms/progress";
import { Radio, RadioGroup } from "@/components/atoms/radio-group";
import { Sparkline } from "@/components/atoms/sparkline";
import { Switch } from "@/components/atoms/switch";
import { Alert } from "@/components/molecules/alert";
import { Select } from "@/components/molecules/select";
import { Stat } from "@/components/molecules/stat";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/organisms/card";
import { PageHeader } from "@/components/organisms/page-header";
import { DashboardShell } from "@/components/templates/dashboard-shell";
import {
  accentSwatches,
  brandSwatches,
  graySwatches,
  inkSwatches,
  typeScale,
  type Swatch,
} from "@/lib/palette";

function SwatchGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {swatches.map((swatch) => (
        <div key={swatch.name} className="flex items-center gap-3">
          <span
            className="size-10 shrink-0 rounded-sm border border-border"
            style={{ background: swatch.hex }}
          />
          <span>
            <span className="block text-[13px] font-medium text-heading">{swatch.name}</span>
            <span className="block font-inter text-[11px] text-text-3 uppercase">{swatch.hex}</span>
            <span className="block text-[12px] text-text-3">{swatch.role}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

const layers = [
  {
    name: "Atoms",
    href: "/examples/components",
    text: "Button, badge, input, avatar, sparkline, progress. These never contain other components.",
  },
  {
    name: "Molecules",
    href: "/examples/components",
    text: "Stat, breadcrumb, search, tabs, menu, meter list. Small groups of atoms with one job.",
  },
  {
    name: "Organisms",
    href: "/examples/components",
    text: "Card, header, sidebar, table, dialog, page header, activity feed, timeline. Sections of a screen.",
  },
  {
    name: "Templates",
    href: "/examples/widgets",
    text: "Dashboard, charts, widgets, calendar, settings, and sign-in. Assemble organisms into a full page.",
  },
];

export function FoundationsTemplate() {
  return (
    <DashboardShell>
      <PageHeader
        crumbs={[{ label: "Sprig", href: "/" }, { label: "Foundations" }]}
        title="Build the screen from the smallest piece"
        description="Colors, type, and density are shared across every screen. Every example on this site is assembled from atoms, molecules, organisms, and templates."
      />
      <div className="grid gap-2.5 xl:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Color</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-6">
            <SwatchGrid swatches={brandSwatches} />
            <SwatchGrid swatches={inkSwatches} />
            <SwatchGrid swatches={graySwatches} />
            <SwatchGrid swatches={accentSwatches} />
          </CardBody>
        </Card>
        <div className="flex flex-col gap-2.5">
          <Card>
            <CardHeader>
              <CardTitle>Type</CardTitle>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              {typeScale.map((item) => (
                <div key={item.name}>
                  <p className={item.className}>{item.sample}</p>
                  <p className="text-[11px] text-text-3">
                    {item.name} · {item.detail}
                  </p>
                </div>
              ))}
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Atoms, composed</CardTitle>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Generate report</Button>
                <Button size="sm" color="white">
                  Print
                </Button>
                <Button size="sm" variant="outlined">
                  Outline
                </Button>
                <Badge>New</Badge>
                <Badge color="success">Paid</Badge>
                <Kbd>⌘K</Kbd>
              </div>
              <Input aria-label="Sample field" placeholder="Email address" />
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-text-2">Email alerts</span>
                <Switch defaultChecked aria-label="Email alerts" />
              </div>
              <RadioGroup defaultValue="comfortable" aria-label="Density" className="flex gap-4">
                <label className="flex items-center gap-2 text-[13px] text-text-2">
                  <Radio value="comfortable" /> Comfortable
                </label>
                <label className="flex items-center gap-2 text-[13px] text-text-2">
                  <Radio value="compact" /> Compact
                </label>
              </RadioGroup>
              <Select
                id="sample-role"
                placeholder="Choose a role"
                options={[
                  { label: "Administrator", value: "admin" },
                  { label: "Editor", value: "editor" },
                  { label: "Viewer", value: "viewer" },
                ]}
              />
              <Progress value={62} aria-label="Sample progress" />
              <Stat
                title="Conversion Rate"
                value="0.81%"
                change={{ value: "1.2%", direction: "up", hint: "than last week" }}
              />
              <Sparkline data={[8, 12, 10, 14, 13, 18, 16, 21, 19, 24]} label="Sample trend" />
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="mt-2.5 grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
        {layers.map((layer) => (
          <Card key={layer.name}>
            <CardBody>
              <p className="mb-2 font-inter text-[10px] font-semibold tracking-[0.5px] text-primary uppercase">
                {layer.name}
              </p>
              <p className="text-[13px] text-text-2">{layer.text}</p>
              <Button asChild variant="text" size="sm" className="mt-3 h-auto">
                <a href={layer.href}>Open an example</a>
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
      <Alert className="mt-2.5" title="Recipe" color="info">
        A metric card is a Card organism, a Stat molecule, and a Sparkline atom. Open Charts,
        Widgets, Calendar, or Settings and reuse the same pieces.
      </Alert>
    </DashboardShell>
  );
}
