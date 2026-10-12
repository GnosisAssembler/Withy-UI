"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { Slider } from "../atoms/slider";
import { Textarea } from "../atoms/textarea";
import { Callout } from "../molecules/callout";
import { SwitchField } from "../molecules/choice-field";
import { FileInput } from "../molecules/file-input";
import { FormField } from "../molecules/form-field";
import { InputGroup } from "../molecules/input-group";
import { PasswordInput } from "../molecules/password-input";
import { SegmentedControl } from "../molecules/segmented-control";
import { useToast } from "../molecules/toast";
import {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../organisms/card";
import { PageHeader } from "../organisms/page-header";
import { useTheme } from "../theme/theme-provider";
import { DashboardShell } from "./dashboard-shell";
import { themes, type ThemeName } from "../../lib/theme";

const skinLabel: Record<ThemeName, string> = {
  light: "Light",
  dark: "Dark",
};

function isThemeName(value: string): value is ThemeName {
  return themes.includes(value as ThemeName);
}

export function SettingsPageTemplate() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [name, setName] = React.useState("Ivy Calder");
  const [email, setEmail] = React.useState("ivy@withy.dev");
  const [handle, setHandle] = React.useState("ivy");
  const [site, setSite] = React.useState("withy.dev");
  const [bio, setBio] = React.useState("Administrator for the Withy UI workspace.");
  const [password, setPassword] = React.useState("");
  const [timeout, setTimeoutMinutes] = React.useState([30]);
  const [productMail, setProductMail] = React.useState(true);
  const [securityMail, setSecurityMail] = React.useState(true);
  const [weekly, setWeekly] = React.useState(false);

  return (
    <DashboardShell>
      <PageHeader
        crumbs={[{ label: "Account", href: "/" }, { label: "Settings" }]}
        title="Settings"
        description="Profile, security, notifications, and the workspace skin."
      />
      <div className="grid gap-2.5 xl:grid-cols-2 xl:items-start">
        <form
          className="flex flex-col gap-2.5"
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
              <FormField label="Name">
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </FormField>
              <FormField label="Email">
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </FormField>
              <FormField label="Handle">
                <InputGroup prefix="@">
                  <Input value={handle} onChange={(event) => setHandle(event.target.value)} />
                </InputGroup>
              </FormField>
              <FormField label="Site">
                <InputGroup prefix="https://">
                  <Input value={site} onChange={(event) => setSite(event.target.value)} />
                </InputGroup>
              </FormField>
              <FormField label="Bio">
                <Textarea value={bio} onChange={(event) => setBio(event.target.value)} />
              </FormField>
              <FormField label="Avatar" hint="PNG or JPG, shown on your account menu.">
                <FileInput accept="image/png,image/jpeg" />
              </FormField>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <FormField label="New password" hint="Leave blank to keep the current one.">
                <PasswordInput
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </FormField>
              <FormField label="Session timeout" hint={`${timeout[0]} minutes`}>
                <Slider
                  min={15}
                  max={120}
                  step={15}
                  value={timeout}
                  onValueChange={setTimeoutMinutes}
                />
              </FormField>
            </CardBody>
            <CardFooter>
              <Button type="submit">Save settings</Button>
            </CardFooter>
          </Card>
          <Callout color="info" title="Preview only" icon={<Info />}>
            Saving shows a toast and keeps these values in the page. Nothing is sent to a server.
          </Callout>
        </form>
        <div className="flex flex-col gap-2.5">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Each switch saves as soon as you change it.</CardDescription>
              </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <SwitchField
                label="Product updates"
                description="New features and changes to Withy UI."
                checked={productMail}
                onCheckedChange={setProductMail}
              />
              <SwitchField
                label="Security alerts"
                description="Sign-ins from a new device."
                checked={securityMail}
                onCheckedChange={setSecurityMail}
              />
              <SwitchField
                label="Weekly digest"
                description="A summary every Monday."
                checked={weekly}
                onCheckedChange={setWeekly}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Skin</CardTitle>
                <CardDescription>Saved for you on this device.</CardDescription>
              </div>
            </CardHeader>
            <CardBody>
              <SegmentedControl
                aria-label="Skin"
                value={theme}
                onValueChange={(value) => {
                  if (isThemeName(value)) setTheme(value);
                }}
                options={themes.map((item) => ({ label: skinLabel[item], value: item }))}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
