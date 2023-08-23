import { ComponentType } from "react";

const getDisplayName = (Element: ComponentType<AnyObject> | keyof React.JSX.IntrinsicElements): string => {
  if (typeof Element === "string") return Element;
  return Element.displayName ?? Element.name ?? "Component";
};

export { getDisplayName };
