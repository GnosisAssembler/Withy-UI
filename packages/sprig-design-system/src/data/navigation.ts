export type NavLink = {
  label: string;
  href: string;
};

export const mainNav: NavLink[] = [
  { label: "Foundations", href: "/" },
  { label: "Components", href: "/examples/components" },
  { label: "Charts", href: "/examples/charts" },
  { label: "Widgets", href: "/examples/widgets" },
  { label: "Calendar", href: "/examples/calendar" },
  { label: "Settings", href: "/examples/settings" },
];

export const currentUser = {
  name: "Ivy Calder",
  email: "ivy@sprig.dev",
  role: "Administrator",
  initials: "IC",
};
