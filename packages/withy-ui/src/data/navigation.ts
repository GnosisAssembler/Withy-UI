export type NavLink = {
  label: string;
  href: string;
  children?: NavLink[];
};

export const mainNav: NavLink[] = [
  { label: "Foundations", href: "/foundations" },
  { label: "UI patterns", href: "/patterns" },
  { label: "Scenario patterns", href: "/scenarios" },
  { label: "CSS utilities", href: "/utilities" },
  { label: "Components", href: "/components" },
];

export const currentUser = {
  name: "Ivy Calder",
  email: "ivy@withy.dev",
  role: "Administrator",
  initials: "IC",
};
