"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Slider } from "@/components/atoms/slider";
import { Switch } from "@/components/atoms/switch";
import { Textarea } from "@/components/atoms/textarea";
import { Callout } from "@/components/molecules/callout";
import { FileInput } from "@/components/molecules/file-input";
import { FormField } from "@/components/molecules/form-field";
import { InputGroup } from "@/components/molecules/input-group";
import { PasswordInput } from "@/components/molecules/password-input";
import { useToast } from "@/components/molecules/toast";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "@/components/organisms/card";
import { PageHeader } from "@/components/organisms/page-header";
import { useTheme } from "@/components/theme/theme-provider";
import { DashboardShell } from "@/components/templates/dashboard-shell";
import { themes, type ThemeName } from "@/lib/theme";
import { cn } from "@/lib/cn";

const skinLabel: Record<ThemeName, string> = {
  light: "Light",
  dark: "Dark",
};

export function SettingsPageTemplate() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [name, setName] = React.useState("Ivy Calder");
  const [email, setEmail] = React.useState("ivy@sprig.dev");
  const [handle, setHandle] = React.useState("ivy");
  const [site, setSite] = React.useState("sprig.dev");
  const [bio, setBio] = React.useState("Administrator for the Sprig workspace.");
  const [password, setPassword] = React.useState("");
  const [timeout, setTimeoutMinutes] = React.useState([30]);
  const [productMail, setProductMail] = React.useState(true);
  const [securityMail, setSecurityMail] = React.useState(true);
  const [weekly, setWeekly] = React.useState(false);

  return (
    <DashboardShell>
      <PageHeader
        crumbs={[{ label: "Account", href: "/examples/settings" }, { label: "Settings" }]}
        title="Settings"
        description="Profile, security, notifications, and the workspace skin."
      />
      <form
        className="grid gap-2.5 xl:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          toast({
            title: "Settings saved",
            description: `${name} · session timeout ${timeout[0]} minutes.`,
            color: "success",
          });
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <FormField label="Name" htmlFor="settings-name">
              <Input
                id="settings-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </FormField>
            <FormField label="Email" htmlFor="settings-email">
              <Input
                id="settings-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormField>
            <FormField label="Handle" htmlFor="settings-handle">
              <InputGroup prefix="@">
                <Input
                  id="settings-handle"
                  value={handle}
                  onChange={(event) => setHandle(event.target.value)}
                />
              </InputGroup>
            </FormField>
            <FormField label="Site" htmlFor="settings-site">
              <InputGroup prefix="https://">
                <Input
                  id="settings-site"
                  value={site}
                  onChange={(event) => setSite(event.target.value)}
                />
              </InputGroup>
            </FormField>
            <FormField label="Bio" htmlFor="settings-bio">
              <Textarea
                id="settings-bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
              />
            </FormField>
            <FormField
              label="Avatar"
              htmlFor="settings-avatar"
              hint="PNG or JPG, shown on your account menu."
            >
              <FileInput id="settings-avatar" accept="image/png,image/jpeg" />
            </FormField>
          </CardBody>
        </Card>
        <div className="flex flex-col gap-2.5">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <FormField
                label="New password"
                htmlFor="settings-password"
                hint="Leave blank to keep the current one."
              >
                <PasswordInput
                  id="settings-password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </FormField>
              <FormField
                label="Session timeout"
                htmlFor="settings-timeout"
                hint={`${timeout[0]} minutes`}
              >
                <Slider
                  id="settings-timeout"
                  min={15}
                  max={120}
                  step={15}
                  value={timeout}
                  onValueChange={setTimeoutMinutes}
                  aria-label="Session timeout"
                />
              </FormField>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              {[
                ["Product updates", productMail, setProductMail],
                ["Security alerts", securityMail, setSecurityMail],
                ["Weekly digest", weekly, setWeekly],
              ].map(([label, checked, setChecked]) => (
                <label
                  key={String(label)}
                  className="flex items-center justify-between gap-3 text-[13px] text-text-2"
                >
                  {label as string}
                  <Switch
                    checked={checked as boolean}
                    onCheckedChange={(value) =>
                      (setChecked as (next: boolean) => void)(value === true)
                    }
                    aria-label={label as string}
                  />
                </label>
              ))}
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Skin</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {themes.map((item) => (
                  <Button
                    key={item}
                    type="button"
                    size="sm"
                    color={item === theme ? "primary" : "white"}
                    aria-pressed={item === theme}
                    onClick={() => setTheme(item)}
                  >
                    {skinLabel[item]}
                  </Button>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="xl:col-span-2">
          <Callout color="info" title="Preview only" icon={<Info />}>
            Saving shows a toast and keeps these values in the page. Nothing is sent to a server.
          </Callout>
          <Card className="mt-2.5">
            <CardFooter className={cn("justify-end border-t-0")}>
              <Button type="submit">Save settings</Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </DashboardShell>
  );
}
