import * as React from "react";

export type FieldContextValue = {
  id?: string;
  labelId: string;
  describedBy?: string;
  invalid: boolean;
};

export const FieldContext = React.createContext<FieldContextValue | null>(null);

export function useFieldContext() {
  return React.useContext(FieldContext);
}

type ControlProps = {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
};

function mergeIds(...lists: (string | undefined)[]) {
  const ids = [...new Set(lists.flatMap((list) => list?.split(/\s+/) ?? []).filter(Boolean))];
  return ids.length > 0 ? ids.join(" ") : undefined;
}

export function useFieldControl(props: ControlProps) {
  const field = React.useContext(FieldContext);
  if (!field) {
    return {
      id: props.id,
      "aria-describedby": props["aria-describedby"],
      "aria-invalid": props["aria-invalid"],
    };
  }
  return {
    id: props.id ?? field.id,
    "aria-describedby": mergeIds(props["aria-describedby"], field.describedBy),
    "aria-invalid": props["aria-invalid"] ?? (field.invalid ? true : undefined),
  };
}
