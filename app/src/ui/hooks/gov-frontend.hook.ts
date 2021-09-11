import { useStores } from "@ui/redux";
import { useCallback } from "react";

// Note: There is no available interface for this module, this is an interim type
type GDSModule = new (node: HTMLElement) => {
  init: () => void;
};

type GDSModuleList =
  | "Accordion"
  | "Button"
  | "CharacterCount"
  | "Checkboxes"
  | "Details"
  | "ErrorSummary"
  | "Header"
  | "Radios";

// Note: These were taken from "window", I can't see any docs on this GDS library
export type GDSModules = Record<GDSModuleList, GDSModule>;

type WindowWithGDSLoaded = typeof window & {
  GOVUKFrontend: GDSModules;
};

export function useGovFrontend(module: keyof GDSModules) {
  const { config } = useStores();

  const hasGovFrontendLoaded: boolean = config.isClient() ? "GOVUKFrontend" in window : false;
  const govFrontend = hasGovFrontendLoaded ? (window as WindowWithGDSLoaded).GOVUKFrontend : null;

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      if (!govFrontend || !node) return;

      new govFrontend[module](node).init();
    },
    [govFrontend, module],
  );

  return { setRef };
}
