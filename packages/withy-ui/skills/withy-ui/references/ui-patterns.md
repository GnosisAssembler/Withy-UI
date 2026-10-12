# UI patterns

Each pattern lists the rules from the Withy UI docs, the do and don’t examples, and the components that build it.

## Data visualization

A chart shows a change or a comparison. Use one when a single number hides the shape of the data.

### Rules

- One chart answers one question.
- Name the chart, and name each series.
- Accent colors separate series. Success, warning, and danger stay for status.
- Keep a table when the reader needs the exact figures.

### Examples

| Topic  | Do                                                | Don’t                                                 |
| ------ | ------------------------------------------------- | ----------------------------------------------------- |
| Series | Revenue and refunds, each with a name.            | Six lines and no names.                               |
| Status | A green line only when that series means success. | Green for the first series because it looks positive. |

### Build it with Withy UI

- Put each chart in a `Card`. The `CardTitle` names the question, and `CardDescription` gives the unit or the comparison.
- Import charts from `withy-ui/charts`. Every chart needs a `label` (its accessible name), and every series a `name`.
- Use `AreaChart`, `LineChart`, `BarChart`, and `ComboChart` to compare series over categories. Use `TimelineChart` when each bar runs from a start to an end. Use `BubbleChart` when each point has two positions and a size. Use `DonutChart` for a share of a whole, `TreemapChart` when that share splits into groups and the items inside them, `BarList` to rank values, and `CategoryBar` to split one total and mark a point on it.
- Color series with accents: `primary`, `cyan`, `teal`, `indigo`, `pink`, `orange`. Use `success`, `info`, `warning`, or `danger` only when the series means that status.
- Add a `DataTable` beside or below the chart when the reader needs exact figures. Use `Sparkline` for a trend inside a card or a row, and `Stat` or `Figure` for a single number. For a row of dashboard metrics, use the widgets in [components.md](components.md#widgets): `KpiCards`, `StatStrip`, `IconStats`, `StatusKpi`, `UsageMeters`, `SparkKpi`, `SplitKpi`, `ChannelSplit`, and `ShareCards`.
- Use `Tracker` from `withy-ui` for a sequence of statuses, such as daily uptime. Give it a `label`, and name each block with `tooltip`.
- Chart props are in [components.md](components.md#charts).

```tsx
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "withy-ui";
import { AreaChart } from "withy-ui/charts";

<Card>
  <CardHeader>
    <div>
      <CardTitle>Revenue by channel</CardTitle>
      <CardDescription>Monthly revenue, in thousands of USD</CardDescription>
    </div>
  </CardHeader>
  <CardBody>
    <AreaChart
      label="Revenue by channel"
      categories={["Jan", "Feb", "Mar"]}
      series={[
        { name: "Direct", data: [44, 52, 61], color: "primary" },
        { name: "Referral", data: [21, 25, 30], color: "cyan" },
      ]}
    />
  </CardBody>
</Card>;
```

## Degraded experiences

When one part of the product cannot load, keep the rest of the page usable and say what failed.

### Rules

- Leave the page in place. Replace only the region that failed.
- Name the thing that failed and the next step.
- Keep every action that still works.
- Use a full-page failure only when the page itself cannot be shown.

### Examples

| Topic | Do                                                                           | Don’t                                                    |
| ----- | ---------------------------------------------------------------------------- | -------------------------------------------------------- |
| Scope | The invoice list shows a warning. The rest of the account page stays usable. | The whole page becomes an error because one list failed. |
| Copy  | Invoices could not be loaded. Try again.                                     | Error 503.                                               |

### Build it with Withy UI

- Replace only the region that failed with an `Alert` (`color="warning"`, or `"danger"` when data may be lost). Name what failed in `title`, say what still works in the body, and put the retry in `actions`.
- Keep the region's `Card` and its header, so the page keeps its shape and every other action keeps working.
- Show a full-page error only when the page itself cannot render.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Invoices</CardTitle>
  </CardHeader>
  <CardBody>
    {error ? (
      <Alert
        color="warning"
        title="Invoices are unavailable"
        actions={
          <Button variant="outlined" size="sm" onClick={retry}>
            Try again
          </Button>
        }
      >
        The list could not be loaded. The rest of this page still works.
      </Alert>
    ) : (
      <InvoiceTable rows={invoices} />
    )}
  </CardBody>
</Card>
```

## Empty states

An empty state fills a region that has no items yet, or is empty because nothing matches.

### Rules

- Say what the space is for.
- Offer one action when the person can add the first item.
- A filter with no matches is different from a list that was never used. Say which one it is.
- Keep the tone plain. An error is not a welcome.

### Examples

| Topic     | Do                               | Don’t                                                 |
| --------- | -------------------------------- | ----------------------------------------------------- |
| First use | No reports yet. Create a report. | Nothing to see here.                                  |
| Filters   | No invoices match these filters. | You have no invoices, when the list is only filtered. |

### Build it with Withy UI

- Use `EmptyState`: `title` says what the space is for, `description` adds one sentence, `icon` is a Lucide icon, and `action` is the one way to add the first item.
- First use and no matches are different. For no matches, name the filter and offer Clear filters.
- `DataTable` already splits the two: pass `empty` for a table with no rows, and it shows "No rows match these filters." with a Clear filters button on its own.

```tsx
import { FileText, SearchX } from "lucide-react";

<EmptyState
  icon={FileText}
  title="No reports yet"
  description="Create a report to see revenue by week."
  action={<Button size="sm" onClick={createReport}>Create report</Button>}
/>

<EmptyState
  icon={SearchX}
  title="No invoices match these filters"
  description="Paid, from March. Change the filters to see more invoices."
  action={<Button variant="outlined" size="sm" onClick={clearFilters}>Clear filters</Button>}
/>
```

## Forms

A form asks for the least information that completes one job.

### Rules

- Every field has a visible label. A placeholder is not a label.
- Stack fields in one column, in the order of the job.
- Explain an invalid value, and say how to fix it.
- Keep the submit button available. Check the form when it is submitted.

### Examples

| Topic  | Do                                        | Don’t                                                |
| ------ | ----------------------------------------- | ---------------------------------------------------- |
| Labels | Report name, with a hint under the field. | A placeholder that disappears once the person types. |
| Errors | Enter a name between 2 and 20 characters. | Invalid input.                                       |

### Build it with Withy UI

- Wrap every control in `FormField` with a visible `label`. It creates the id and connects `hint` and `error` to the control (`aria-describedby`, `aria-invalid`). This works for `Input`, `InputOtp`, `NumberInput`, `Textarea`, `Select`, `PasswordInput`, `SearchInput`, `Combobox`, `SelectPicker`, `ChipPicker`, `DatePicker`, `DateRangePicker`, `ColorPicker`, `ColorSlider`, `TimePicker`, `Slider`, `FileInput`, and `FileUploader`. Don't add those attributes by hand.
- Group checkboxes and radios in a `Fieldset` with a `legend`. Use `CheckboxField`, `RadioField`, and `SwitchField` for each labeled choice.
- Stack fields in one column with `Stack gap="lg"`. Use `InputGroup` for a fixed prefix or suffix, such as `@` or `USD`.
- Check the form on submit, keep the submit button enabled, and put each error under its field with the fix in it. Pass `loading` to the submit button while the request runs.

```tsx
<form onSubmit={handleSubmit} noValidate>
  <Card>
    <CardHeader>
      <CardTitle>New report</CardTitle>
    </CardHeader>
    <CardBody>
      <Stack gap="lg">
        <FormField label="Report name" hint="Shown on the report cover." error={errors.name}>
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </FormField>
        <FormField label="Owner">
          <Select value={owner} onValueChange={setOwner} options={people} />
        </FormField>
        <FormField label="Due date">
          <DatePicker value={due} onValueChange={setDue} />
        </FormField>
        <Fieldset legend="Send to">
          <CheckboxField label="Finance team" defaultChecked />
          <CheckboxField label="Board members" />
        </Fieldset>
      </Stack>
    </CardBody>
    <CardFooter>
      <Button type="submit" loading={saving}>
        Create report
      </Button>
    </CardFooter>
  </Card>
</form>
```

## Loading

Show a loading state when a wait is long enough to notice, and replace it as soon as the content or the error arrives.

### Rules

- Under about a second, show the content. A flash of a spinner makes the page feel slower.
- Use a spinner for a small region, and a skeleton for the shape of a larger region.
- Name what is loading for assistive tech.
- When the wait fails, replace the indicator with the error and a way to try again.

### Examples

| Topic     | Do                                            | Don’t                                     |
| --------- | --------------------------------------------- | ----------------------------------------- |
| Placement | A skeleton in the card that is still loading. | A spinner for every row in the same list. |
| Arrival   | Each row appears as soon as it arrives.       | A blank page until every row has loaded.  |

### Build it with Withy UI

- `Spinner` for a small region. Its `label` names what is loading. `SpinnerOverlay` covers a region that keeps its old content while it refreshes; its parent needs `relative`.
- `Skeleton`, `SkeletonText`, `SkeletonAvatar`, and `SkeletonRows` hold the shape of a larger region.
- `Progress` for a task with a known end. Name it with `aria-label` and show the percent as text. `animation="stripes"` or `animation="shimmer"` keeps a known task moving. `animation="indeterminate"` is for a task whose end is not known yet.
- `Button loading` for a pending action. It disables the button and sets `aria-busy`.
- Show nothing for a wait under about a second. When the wait fails, replace the indicator with an `Alert` and a way to try again.

```tsx
{
  status === "loading" ? (
    <SkeletonRows rows={4} />
  ) : status === "error" ? (
    <Alert
      color="warning"
      title="Invoices are unavailable"
      actions={
        <Button variant="outlined" size="sm" onClick={retry}>
          Try again
        </Button>
      }
    >
      The list could not be loaded.
    </Alert>
  ) : (
    <InvoiceList invoices={invoices} />
  );
}
```

## Navigation

Navigation tells a person where they are and which places they can open next.

### Rules

- Mark the current page.
- Keep the same destinations in the same order on every screen.
- On a narrow screen, put the page content before a long list of links.
- A link says where it goes.

### Examples

| Topic   | Do                                                            | Don’t                        |
| ------- | ------------------------------------------------------------- | ---------------------------- |
| Current | Foundations stays marked while you move through its sections. | A menu with no current item. |
| Labels  | Billing guide.                                                | Click here.                  |

### Build it with Withy UI

- `AppShell` (or `Header`) holds the main navigation. Pass the same `nav` items, in the same order, on every page. It marks the current page from `pathname` or from `WithyProvider`. An item with `children` becomes a menu.
- `SectionNav` moves between the sections of one area, such as account settings. It runs across on a narrow screen and down the side from 1024px.
- `Sidebar` lists many places grouped by section. Put it in `LayoutPane side="start"` so the page content comes first on a narrow screen.
- `PageHeader crumbs` shows where the page sits. `Tabs` switch panels inside one page. `Accordion` opens and closes sections in place. `Pagination` moves through a long list. `Stepper` shows progress through an ordered task, such as creating an invoice.
- Use `Link` for inline links, with text that says where it goes. Pass your router's link once to `WithyProvider`, so every Withy UI link stays client-side.

```tsx
<div className="flex flex-col gap-2.5 lg:flex-row lg:items-start">
  <SectionNav
    label="Account"
    current={pathname}
    items={[
      { label: "Profile", href: "/account/profile" },
      { label: "Security", href: "/account/security" },
      { label: "Billing", href: "/account/billing" },
    ]}
  />
  <div className="min-w-0 flex-1">{children}</div>
</div>
```

## Notifications

A notice reports a result, a warning, or a change that happened away from the control the person just used.

### Rules

- Put a notice next to the thing it describes when the person is still looking there.
- Use a toast when the change happens and the person may already be looking elsewhere on the page.
- Success, warning, and danger stay distinct.
- Let the person dismiss a toast. Leave an inline alert until the condition changes.

### Examples

| Topic   | Do                                    | Don’t                                         |
| ------- | ------------------------------------- | --------------------------------------------- |
| Place   | Saved, on the form, after the fields. | A toast for an error that belongs on a field. |
| Meaning | Payment failed, in the danger color.  | A success color for a warning.                |

### Build it with Withy UI

- Next to the thing, while the person is still looking there: `InlineMessage` for a short result such as Changes saved., `Alert` for a condition on a region, and `Callout` for guidance.
- Away from the control: `const { toast } = useToast()`, then `toast({ title, description, color, action, duration })`. A toast can be dismissed. Add `action: { label: "Undo", onClick }` for a change that can be reversed.
- Field errors go under the field with `FormField error`, never in a toast.
- Keep the meanings apart: `success`, `info`, `warning`, and `danger`.

```tsx
const { toast } = useToast();

toast({
  title: "Report ready",
  description: "Weekly revenue is ready to open.",
  color: "success",
});
```

## Saving actions

Saving should make it obvious what was stored, and when.

### Rules

- A form saves when the person presses the button. A switch saves when it changes.
- Keep those two patterns apart. Do not mix them in one form.
- The save button stays available, even when the form is unchanged.
- If saving fails, keep what was typed and say what to do next.
- Start the button with a verb, such as Save changes or Create report.

### Examples

| Topic   | Do                                                                                         | Don’t                                                               |
| ------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| Pattern | Save changes at the end of the form. The email switch saves on its own, outside that form. | A switch inside the form that saves before Save changes is pressed. |
| Button  | Save changes.                                                                              | Submit, or a save button that is disabled until the form changes.   |

### Build it with Withy UI

- A form saves with its submit button, `<Button type="submit">Save changes</Button>`, which stays enabled. Pass `loading` while it saves, then show `InlineMessage tone="success"` after the button, or a toast if the person may have moved on.
- A setting that saves on change is a `SwitchField`, or a `SegmentedControl` for a choice. Keep it outside any form with a save button, and say so in its description.
- If saving fails, keep every value the person typed and show `InlineMessage tone="danger"` with what to do next.

```tsx
<form onSubmit={save}>
  <Stack gap="lg">
    <FormField label="Report name">
      <Input value={name} onChange={(event) => setName(event.target.value)} />
    </FormField>
    <Row>
      <Button type="submit" loading={status === "saving"}>
        Save changes
      </Button>
      {status === "saved" ? <InlineMessage tone="success">Changes saved.</InlineMessage> : null}
      {status === "failed" ? (
        <InlineMessage tone="danger">
          Changes could not be saved. Check your connection and try again.
        </InlineMessage>
      ) : null}
    </Row>
  </Stack>
</form>

<SwitchField
  label="Email alerts"
  description="Saves as soon as you change it."
  checked={alerts}
  onCheckedChange={updateAlerts}
/>
```
