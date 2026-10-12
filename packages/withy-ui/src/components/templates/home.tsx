import { Button } from "../atoms/button";
import { Container } from "../layout/container";
import { Logo } from "../molecules/logo";
import { WithyLink } from "../theme/withy-routing";
import { DashboardShell } from "./dashboard-shell";

export function HomeTemplate() {
  return (
    <DashboardShell>
      <Container width="narrow" className="py-8 lg:py-16">
        <Logo className="text-[1.75rem] [&_svg]:size-8" />
        <h1 className="mt-8 max-w-xl text-[2.1875rem] leading-tight font-medium tracking-[-0.5px] text-heading">
          Build from the smallest piece
        </h1>
        <div className="mt-4 flex max-w-xl flex-col gap-3 text-[0.875rem] leading-[1.5] text-text-2">
          <p>
            Withy UI is a design system for dashboards, apps, and pages. A screen is assembled from
            atoms, molecules, organisms, and templates. A component contains only smaller layers, so
            a change in one piece reaches every screen that uses it.
          </p>
          <p>
            Color, type, spacing, icons, content, and layout are shared. Light and dark keep the
            same roles. The values shift so text and fills stay readable in both.
          </p>
          <p>Pick the smallest piece that can do the job, and fill a template that already fits.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          <Button asChild>
            <WithyLink href="/foundations/color">Foundations</WithyLink>
          </Button>
          <Button asChild variant="outlined">
            <WithyLink href="/components">Components</WithyLink>
          </Button>
        </div>
      </Container>
    </DashboardShell>
  );
}
