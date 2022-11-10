import { useCallback } from "react";

import { useMounted } from "@ui/features";

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

/**
 * ### useGovFrontend
 *
 * initializes govFrontend module
 */
export function useGovFrontend(module: keyof GDSModules) {
  const { isClient } = useMounted();

  const hasGovFrontendLoaded: boolean = isClient ? "GOVUKFrontend" in window : false;
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
