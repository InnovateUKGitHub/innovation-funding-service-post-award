import { useCallback } from "react";

// Note: There is no available interface for this module, this is an interim type
type GDSModule = new (node: HTMLElement) => {
  init: () => void;
};

// Note: These were taken from "window", I can't see any docs on this GDS library
export type GDSModules = {
  [key in
    | "Accordion"
    | "Button"
    | "CharacterCount"
    | "Checkboxes"
    | "Details"
    | "ErrorSummary"
    | "Header"
    | "Radios"
    | "Tabs"]: GDSModule;
};

interface WindowWithGDS extends Window {
  GOVUKFrontend: GDSModules;
}

export function useGovFrontend(module: keyof GDSModules) {
  const govFrontend: GDSModules | false = typeof window !== "undefined" && (window as WindowWithGDS).GOVUKFrontend;

  const setRef = useCallback((node: HTMLElement | null) => {
    if (govFrontend && node) {
      const gdsModule = new govFrontend[module](node);

      gdsModule.init();
    }
  }, []);

  return { setRef };
}
