# Scenario patterns

A scenario is a job a person does: copy, create, customize, delegate, delete, edit, filter, search, or view. Each one lists the rules, the do and don’t examples, and the components that build it.

## Copy

Copy puts existing content on the clipboard so it can be pasted somewhere else.

### Rules

- Name the thing being copied.
- After a successful copy, change the button to Copied, then return it.
- Keep the person on the same page. Copy does not navigate.
- If the copy fails, say so on the button’s control. Leave the original in place.

### Examples

| Topic | Do | Don’t |
| --- | --- | --- |
| Label | Copy report link, then Copied. | Click here, with no sign that the link was copied. |
| Result | The report stays open, and the link is on the clipboard. | A new page opens because the person copied a link. |

### Build it with Withy UI

- Use `CopyButton`. Its label names the thing, such as Copy report link. It changes to Copied and back, says Copy failed when the clipboard is blocked, and announces both to screen readers.
- `CodeBlock` has its own copy button.

```tsx
<CopyButton value={reportUrl} size="sm" color="white">
  Copy report link
</CopyButton>
```

## Create

Create makes a new thing. The action names what will exist when it finishes.

### Rules

- The button names the thing that will be created.
- Ask only for the fields that create needs.
- When creation finishes, open the new thing.
- If creation fails, keep what was typed and say what to fix.

### Examples

| Topic | Do | Don’t |
| --- | --- | --- |
| Action | Create report. | Submit, or New. |
| After | The new report opens. | The person returns to a list with no sign of what was created. |

### Build it with Withy UI

- The trigger and the submit button name the thing: Create report. Ask only for what creation needs, in a `Dialog` for a short form, or on its own page for a long one. A long flow can show its progress with `Stepper`.
- When creation succeeds, open the new thing. When it fails, keep the values and show the error under the field, or as `InlineMessage tone="danger"`.

```tsx
<Dialog
  open={open}
  onOpenChange={setOpen}
  trigger={<Button>Create report</Button>}
  title="Create report"
  onSubmit={create}
  footer={
    <>
      <Button type="button" color="white" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button type="submit" loading={creating}>
        Create report
      </Button>
    </>
  }
>
  <FormField label="Report name" error={error}>
    <Input value={name} onChange={(event) => setName(event.target.value)} />
  </FormField>
</Dialog>
```

## Customize

Customize changes a personal preference. It does not change the shared record.

### Rules

- A preference belongs to the person, not to the shared record.
- Apply the preference when it changes.
- Show the current choice.
- Keep preferences out of a form that saves a shared record.

### Examples

| Topic | Do | Don’t |
| --- | --- | --- |
| Scope | Compact tables, saved for this person. | A density switch inside the invoice form that saves the invoice. |
| Feedback | The table tightens as soon as the switch changes. | A preference that waits for Save changes. |

### Build it with Withy UI

- A personal preference applies as soon as it changes: `SwitchField` for on or off, `SegmentedControl` for one of a few choices, and `ThemeSwitcher` for the skin.
- Say whose setting it is in the description, and keep it out of forms that save a shared record.

```tsx
<SwitchField
  label="Compact tables"
  description="Saved for you. Other people keep their own density."
  checked={compact}
  onCheckedChange={setCompact}
/>
```

## Delegate

Delegate hands a piece of work to someone else, and says what they are allowed to do.

### Rules

- Name the person who receives the work.
- Say what they can do.
- Confirm a handoff that cannot be taken back.
- Leave the record in place so both people can see it.

### Examples

| Topic | Do | Don’t |
| --- | --- | --- |
| Scope | Assign the invoice review to Ada. | Share, with no name and no task. |
| Record | The invoice stays, and Ada is listed as the reviewer. | The invoice disappears from the owner’s list. |

### Build it with Withy UI

- Name the person and the task on the button: Assign review to Ada. Pick the person with `Combobox` or `SelectPicker`, and show the assignee with `Media` and `Avatar`.
- Confirm a handoff that cannot be taken back with `Dialog`. Afterwards, keep the record in place and show who has it, for example with `InlineMessage tone="success"`.

```tsx
<FormField label="Reviewer">
  <Combobox options={people} value={reviewer} onValueChange={setReviewer} placeholder="Choose a person" />
</FormField>
<Button onClick={() => assign(reviewer)}>Assign review to {reviewerName}</Button>
```

## Delete

Delete removes a thing. The amount of friction matches how hard the mistake is to undo.

### Rules

- Match the friction to the damage. A permanent delete asks first. A reversible remove can offer undo.
- Name the thing, and say whether it can come back.
- The confirm button repeats the verb: Delete invoice.
- Say Remove when the thing still exists somewhere else.

### Examples

| Topic | Do | Don’t |
| --- | --- | --- |
| Wording | Delete invoice #1048. This cannot be undone. | Are you sure? |
| Button | Delete invoice. | OK, or Yes. |

### Build it with Withy UI

- Permanent delete: `Dialog tone="danger"`. The title names the thing (Delete invoice #1048?), the body says it cannot be undone, and `confirmLabel` repeats the verb (Delete invoice). Open it with `trigger`, or control it with `open` and `onOpenChange` when a menu item starts it. Return a promise from `onConfirm` to keep it open with a loading button until the delete finishes; a rejected promise keeps it open.
- Reversible remove, or the thing still exists elsewhere: say Remove, do it right away, and offer Undo in a toast.

```tsx
<Dialog
  tone="danger"
  open={confirming}
  onOpenChange={setConfirming}
  title="Delete invoice #1048?"
  confirmLabel="Delete invoice"
  onConfirm={() => deleteInvoice("1048")}
>
  The invoice and its payments are removed. This cannot be undone.
</Dialog>;

toast({
  title: "Invoice #1049 removed from this report",
  description: "It is still in Invoices.",
  action: { label: "Undo", onClick: () => restore("1049") },
});
```

## Edit

Edit changes a thing that already exists. The original stays until the change is saved.

### Rules

- Edit the existing thing. Make a copy only when the person asks for one.
- Save applies the change. Cancel returns the previous value.
- If saving fails, keep the draft and say what to do next.
- The button names the change: Save name.

### Examples

| Topic | Do | Don’t |
| --- | --- | --- |
| Target | Save name, on the report that is already open. | Create report, when the person is changing the name. |
| Cancel | Cancel restores Weekly revenue. | Cancel leaves the half-typed name in place. |

### Build it with Withy UI

- Edit in place with the same fields as create, filled with the saved values. The save button names the change (Save name), and Cancel restores the saved value.
- Keep the draft in state until it is saved. If saving fails, keep the draft and show `InlineMessage tone="danger"`.

```tsx
<FormField label="Report name">
  <Input value={draft} onChange={(event) => setDraft(event.target.value)} />
</FormField>
<Row>
  <Button onClick={() => save(draft)}>Save name</Button>
  <Button variant="outlined" onClick={() => setDraft(saved)}>
    Cancel
  </Button>
</Row>
```

## Filter

Filter narrows a collection that is already on the screen.

### Rules

- Filter narrows a collection that is already on the screen.
- Show which filter is on, how many items match, and how to clear it.
- An empty result names the filter. It does not say the collection is empty.
- Keep the filter with the list it changes.

### Examples

| Topic | Do | Don’t |
| --- | --- | --- |
| State | Open, 2 of 3 invoices, with Clear. | A shorter list and no sign that a filter is on. |
| Empty | No invoices are Paid. | You have no invoices. |

### Build it with Withy UI

- Put the filter beside the list it changes. Use `SegmentedControl` for one of a few values, `Select` for a longer list, and `Tag` with `onRemove` for each active filter.
- Show the count, such as 2 of 3 invoices, in an element with `role="status"`, and a Clear or Clear filters text button.
- An empty result names the filter, such as No invoices are Paid.
- For tables, `DataTable` filters by text, choice, number, or date, shows the row count, and offers Clear filters. Selected rows open a command bar for bulk actions.

```tsx
<Row>
  <SegmentedControl
    aria-label="Invoice status"
    value={status}
    onValueChange={setStatus}
    options={[
      { label: "All", value: "all" },
      { label: "Open", value: "open" },
      { label: "Paid", value: "paid" },
    ]}
  />
  {status === "all" ? null : (
    <Button variant="text" size="sm" onClick={() => setStatus("all")}>
      Clear
    </Button>
  )}
</Row>
<Text role="status" size="sm" tone="secondary">
  {visible.length} of {invoices.length} invoices
</Text>
```

## Search

Search finds things that may not be on the screen yet.

### Rules

- Search finds things that may not be on the screen yet.
- The label says what is being searched.
- Show the query and the number of matches.
- Search and filter stay separate. Filter narrows what is already listed.

### Examples

| Topic | Do | Don’t |
| --- | --- | --- |
| Job | Search reports, then open Weekly revenue. | A search box that only hides rows already on the page, with no name. |
| Empty | No reports match “tax”. | No results. |

### Build it with Withy UI

- The label says what is searched: wrap `SearchInput` in `FormField label="Search reports"`, or give it `aria-label` when a visible heading already names it. Pass `onClear` for a clear button.
- Show the number of matches, and name the query when nothing matches: No reports match “tax”.
- For search across pages and actions, use `CommandBar` with `shortcut` for ⌘K.

```tsx
<FormField label="Search reports">
  <SearchInput
    value={query}
    onChange={(event) => setQuery(event.target.value)}
    onClear={() => setQuery("")}
  />
</FormField>
<Text role="status" size="sm" tone="secondary">
  {matches.length === 0 ? `No reports match “${query}”.` : `${matches.length} reports`}
</Text>
```

## View

View changes how the same content is shown. It does not change the content.

### Rules

- A view changes the presentation. The records stay the same.
- Mark the current view.
- Keep filters and search when the view changes.
- Use a view when the person is choosing how to look, not what to keep.

### Examples

| Topic | Do | Don’t |
| --- | --- | --- |
| Current | Table is marked, and Board is the other choice. | Two views with no current one. |
| Data | The same three invoices, shown as a table or a board. | Switching to Board drops the invoices that were filtered. |

### Build it with Withy UI

- Use `SegmentedControl` with an icon for each view, such as `Table2` and `LayoutGrid`, so the current view is marked.
- Keep filters and search in state above both views, so they survive the switch. Save the choice as a personal preference.

```tsx
<SegmentedControl
  aria-label="Invoice view"
  value={view}
  onValueChange={setView}
  options={[
    { label: "Table", value: "table", icon: Table2 },
    { label: "Board", value: "board", icon: LayoutGrid },
  ]}
/>;
{
  view === "table" ? <InvoiceTable rows={visible} /> : <InvoiceBoard rows={visible} />;
}
```
