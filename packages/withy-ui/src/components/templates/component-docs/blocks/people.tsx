"use client";

import * as React from "react";
import { Users } from "lucide-react";
import { Avatar } from "../../../atoms/avatar";
import { Badge } from "../../../atoms/badge";
import { Button } from "../../../atoms/button";
import { Input } from "../../../atoms/input";
import { Link } from "../../../atoms/link";
import { Tag } from "../../../atoms/tag";
import { Text } from "../../../atoms/text";
import { Container } from "../../../layout/container";
import { Row, Stack } from "../../../layout/stack";
import { EmptyState } from "../../../molecules/empty-state";
import { FormField } from "../../../molecules/form-field";
import { InlineMessage } from "../../../molecules/inline-message";
import { SearchInput } from "../../../molecules/search-input";
import { Select } from "../../../molecules/select";
import { useToast } from "../../../molecules/toast";
import { DataTable } from "../../../organisms/data-table";
import { Dialog } from "../../../organisms/dialog";
import type { ComponentDoc } from "../types";
import {
  BlockIntro,
  type Member,
  type Role,
  duplicateEmailError,
  emailError,
  hasError,
  isRole,
  memberFromEmail,
  roleColor,
  roleOptions,
  starterMembers,
} from "./shared";

function MemberIdentity({ member }: { member: Member }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Avatar initials={member.initials} tone={member.tone} size="sm" alt="" />
      <span className="min-w-0">
        <Text as="span" size="sm" weight="medium" tone="heading" className="block truncate">
          {member.name}
        </Text>
        <Text as="span" size="xs" tone="muted" className="block truncate">
          {member.email}
        </Text>
      </span>
    </span>
  );
}

function MemberActions({
  member,
  onRole,
  onRemove,
}: {
  member: Member;
  onRole: (role: Role) => void;
  onRemove: () => void;
}) {
  const [role, setRole] = React.useState(member.role);

  return (
    <Row gap="sm" wrap={false} className="justify-end">
      <Dialog
        title={`Edit ${member.name}`}
        description="Choose the access this person has in the workspace."
        confirmLabel="Save role"
        trigger={
          <Button type="button" size="sm" color="white">
            Edit
          </Button>
        }
        onOpenChange={(open) => {
          if (open) setRole(member.role);
        }}
        onConfirm={() => onRole(role)}
      >
        <FormField label="Role">
          <Select
            value={role}
            onValueChange={(value) => {
              if (isRole(value)) setRole(value);
            }}
            options={roleOptions}
          />
        </FormField>
      </Dialog>
      <Dialog
        title={`Remove ${member.name}`}
        description={`${member.name} will lose access to this workspace. You can invite them again.`}
        tone="danger"
        confirmLabel="Remove member"
        trigger={
          <Button type="button" size="sm" variant="text" color="danger">
            Remove
          </Button>
        }
        onConfirm={onRemove}
      />
    </Row>
  );
}

function InviteMemberDialog({
  onInvite,
}: {
  onInvite: (email: string, role: Role) => string | undefined;
}) {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<Role>("Member");
  const [submitted, setSubmitted] = React.useState(false);
  const [formError, setFormError] = React.useState<string>();
  const formatError = emailError(email, submitted);
  const error = formatError ?? (submitted ? formError : undefined);

  return (
    <Dialog
      title="Invite a member"
      description="They receive an email with a link to join this workspace."
      confirmLabel="Send invite"
      trigger={<Button type="button">Invite member</Button>}
      onOpenChange={(open) => {
        if (!open) {
          setEmail("");
          setRole("Member");
          setSubmitted(false);
          setFormError(undefined);
        }
      }}
      onConfirm={() => {
        setSubmitted(true);
        const invalid = emailError(email, true);
        if (invalid) return Promise.reject(new Error(invalid));
        const duplicate = onInvite(email, role);
        if (duplicate) {
          setFormError(duplicate);
          return Promise.reject(new Error(duplicate));
        }
      }}
    >
      <Stack gap="lg">
        <FormField label="Email" error={error}>
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setFormError(undefined);
            }}
          />
        </FormField>
        <FormField label="Role">
          <Select
            value={role}
            onValueChange={(value) => {
              if (isRole(value)) setRole(value);
            }}
            options={roleOptions}
          />
        </FormField>
      </Stack>
    </Dialog>
  );
}

function MembersDemo() {
  const [people, setPeople] = React.useState(starterMembers);
  const [query, setQuery] = React.useState("");
  const [role, setRole] = React.useState("all");
  const filtering = query.trim().length > 0 || role !== "all";
  const visible = people.filter((member) => {
    const haystack = `${member.name} ${member.email}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const matchesRole = role === "all" || member.role === role;
    return matchesQuery && matchesRole;
  });

  function invite(email: string, nextRole: Role) {
    const duplicate = duplicateEmailError(email, people);
    if (duplicate) return duplicate;
    setPeople((current) => [...current, memberFromEmail(email, nextRole, current.length)]);
    return undefined;
  }

  return (
    <Stack gap="lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <BlockIntro
          className="mb-0 min-w-0 flex-1"
          title="Members"
          description="Workspace admins can add people, change roles, and remove access."
        />
        <InviteMemberDialog onInvite={invite} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Search">
          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            placeholder="Name or email"
            aria-label="Search members"
          />
        </FormField>
        <FormField label="Role">
          <Select
            value={role}
            onValueChange={setRole}
            options={[{ label: "All roles", value: "all" }, ...roleOptions]}
          />
        </FormField>
      </div>
      {visible.length === 0 ? (
        <EmptyState
          icon={Users}
          title={filtering ? "No members match" : "No members yet"}
          description={
            filtering
              ? "Try another name, or clear the filters."
              : "Invite someone to give them access to this workspace."
          }
          action={
            filtering ? (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setRole("all");
                }}
              >
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <DataTable
          caption="Workspace members"
          rows={visible}
          getRowKey={(member) => member.id}
          columns={[
            {
              key: "member",
              header: "Member",
              sortValue: (member) => member.name,
              cell: (member) => <MemberIdentity member={member} />,
            },
            {
              key: "role",
              header: "Role",
              sortValue: (member) => member.role,
              cell: (member) => <Tag color={roleColor[member.role]}>{member.role}</Tag>,
            },
            {
              key: "status",
              header: "Status",
              sortValue: (member) => member.status,
              cell: (member) => (
                <Badge variant="muted" color={member.status === "Active" ? "success" : "warning"}>
                  {member.status}
                </Badge>
              ),
            },
            {
              key: "actions",
              header: "Actions",
              align: "right",
              cell: (member) => (
                <MemberActions
                  member={member}
                  onRole={(nextRole) =>
                    setPeople((current) =>
                      current.map((item) =>
                        item.id === member.id ? { ...item, role: nextRole } : item,
                      ),
                    )
                  }
                  onRemove={() =>
                    setPeople((current) => current.filter((item) => item.id !== member.id))
                  }
                />
              ),
            },
          ]}
        />
      )}
    </Stack>
  );
}

const pendingSeed: Member[] = [
  {
    id: "sam",
    name: "Sam Rivera",
    email: "sam@withy.dev",
    role: "Member",
    initials: "SR",
    tone: "info",
    status: "Pending",
  },
  {
    id: "avery",
    name: "Avery Cole",
    email: "avery@acme.test",
    role: "Guest",
    initials: "AC",
    tone: "pink",
    status: "Pending",
  },
];

function inviteErrors(email: string, role: Role, people: readonly Member[]) {
  return {
    email: emailError(email, true) ?? duplicateEmailError(email, people),
    role: isRole(role) ? undefined : "Choose a role.",
  };
}

function PendingRow({ person, onRemove }: { person: Member; onRemove: (id: string) => void }) {
  const { toast } = useToast();

  return (
    <li className="flex flex-col gap-3 border-b border-border py-3 sm:flex-row sm:items-center sm:justify-between">
      <MemberIdentity member={person} />
      <Row gap="sm" wrap={false}>
        <Badge variant="muted" color="warning">
          Pending
        </Badge>
        <Button
          type="button"
          size="sm"
          color="white"
          onClick={() =>
            toast({
              title: "Invite sent again",
              description: person.email,
              color: "success",
            })
          }
        >
          Resend invite
        </Button>
        <Dialog
          title="Remove this invite"
          description={`${person.name} (${person.email}) will not be able to join from this invite.`}
          tone="danger"
          confirmLabel="Remove invite"
          onConfirm={() => onRemove(person.id)}
          trigger={
            <Button type="button" size="sm" variant="text" color="danger">
              Remove
            </Button>
          }
        />
      </Row>
    </li>
  );
}

function InviteMembersDemo() {
  const [existing] = React.useState(starterMembers);
  const [pending, setPending] = React.useState(pendingSeed);
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<Role>("Member");
  const [submitted, setSubmitted] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const people = [...existing, ...pending];
  const errors = submitted ? inviteErrors(email, role, people) : undefined;

  return (
    <Container width="narrow">
      <BlockIntro
        title="Invite members"
        description="Add someone by email. To change a role later, open the members list."
      />
      <Text size="sm" className="mb-4">
        <Link href="/components/members">Open the members list</Link>
      </Text>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const next = inviteErrors(email, role, people);
          setSubmitted(true);
          if (hasError(next)) {
            setSaved(false);
            return;
          }
          setPending((current) => [...current, memberFromEmail(email, role, current.length)]);
          setEmail("");
          setRole("Member");
          setSubmitted(false);
          setSaved(true);
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="w-full sm:w-40">
            <FormField label="Role">
              <Select
                value={role}
                onValueChange={(value) => {
                  if (isRole(value)) setRole(value);
                }}
                options={roleOptions}
              />
            </FormField>
          </div>
          <div className="min-w-0 flex-1">
            <FormField label="Email" error={errors?.email}>
              <Input
                type="email"
                autoComplete="email"
                placeholder="ada@withy.dev"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormField>
          </div>
          <div className="sm:pt-6">
            <Button type="submit">Invite</Button>
          </div>
        </div>
        {saved ? (
          <InlineMessage tone="success" className="mt-4">
            Invite added on this page.
          </InlineMessage>
        ) : null}
      </form>
      <Stack gap="xl" className="mt-8">
        <section>
          <Text size="sm" weight="medium" tone="heading">
            People with access
          </Text>
          <ul className="mt-2">
            {existing.map((person) => (
              <li
                key={person.id}
                className="flex items-center justify-between gap-3 border-b border-border py-3"
              >
                <MemberIdentity member={person} />
                <Tag color={roleColor[person.role]}>{person.role}</Tag>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <Text size="sm" weight="medium" tone="heading">
            Pending invites
          </Text>
          {pending.length === 0 ? (
            <Text size="sm" tone="muted" className="mt-2">
              No invites are waiting. Add an email above to send one.
            </Text>
          ) : (
            <ul className="mt-2">
              {pending.map((person) => (
                <PendingRow
                  key={person.id}
                  person={person}
                  onRemove={(id) =>
                    setPending((current) => current.filter((item) => item.id !== id))
                  }
                />
              ))}
            </ul>
          )}
        </section>
      </Stack>
    </Container>
  );
}

export const peopleBlocks = [
  {
    slug: "members",
    name: "Members",
    category: "Blocks",
    description:
      "A member table with search, role filter, invite, role editing, and removal. An empty search says how to clear it.",
    imports: [
      "Avatar",
      "Badge",
      "Button",
      "DataTable",
      "Dialog",
      "EmptyState",
      "FormField",
      "Input",
      "SearchInput",
      "Select",
      "Tag",
    ],
    code: `<FormField label="Search">
  <SearchInput value={query} onChange={setQuery} onClear={clearQuery} aria-label="Search members" />
</FormField>
<FormField label="Role">
  <Select value={role} onValueChange={setRole} options={roles} />
</FormField>
<Dialog title="Invite a member" confirmLabel="Send invite" trigger={<Button type="button">Invite member</Button>}>
  <FormField label="Email" error={errors.email}>
    <Input type="email" value={email} onChange={setEmail} />
  </FormField>
</Dialog>
{visible.length === 0 ? (
  <EmptyState
    icon={Users}
    title={filtering ? "No members match" : "No members yet"}
    description={filtering ? "Try another name, or clear the filters." : "Invite someone to give them access."}
    action={filtering ? <Button type="button" onClick={clearFilters}>Clear filters</Button> : undefined}
  />
) : (
  <DataTable caption="Workspace members" rows={visible} getRowKey={(member) => member.id} columns={columns} />
)}`,
    Demo: MembersDemo,
  },
  {
    slug: "invite-members",
    name: "Invite members",
    category: "Blocks",
    description:
      "Invite someone by email and role, then review people who already have access and invites that are still waiting.",
    imports: ["Avatar", "Badge", "Button", "Dialog", "FormField", "Input", "Select", "Tag", "Text"],
    code: `<form noValidate onSubmit={invite}>
  <FormField label="Role">
    <Select value={role} onValueChange={setRole} options={roles} />
  </FormField>
  <FormField label="Email" error={errors.email}>
    <Input type="email" value={email} onChange={setEmail} />
  </FormField>
  <Button type="submit">Invite</Button>
</form>
<ul>
  {people.map((person) => (
    <li key={person.email}>
      <Avatar initials={person.initials} alt="" />
      <Text weight="medium">{person.name}</Text>
      <Tag color="indigo">{person.role}</Tag>
    </li>
  ))}
</ul>
<Dialog title="Remove this invite" tone="danger" confirmLabel="Remove invite" trigger={<Button type="button">Remove</Button>}>
  <Text>This person will not be able to join from this invite.</Text>
</Dialog>
<Badge variant="muted" color="warning">Pending</Badge>`,
    Demo: InviteMembersDemo,
  },
] as const satisfies readonly ComponentDoc[];
