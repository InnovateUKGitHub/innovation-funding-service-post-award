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

interface WindowWithGDSLoaded extends Window {
  govukFrontend: GDSModules;
}

export function useGovFrontend(module: keyof GDSModules) {
  const { config } = useStores();

  const hasWindow: boolean = config.isClient() && typeof window !== "undefined";
  const gdsWindow: false | WindowWithGDSLoaded = hasWindow && ((window as unknown) as WindowWithGDSLoaded);

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      const govFrontend = gdsWindow && gdsWindow.govukFrontend;
      if (govFrontend && node) {
        const gdsModule = new govFrontend[module](node);

        gdsModule.init();
      }
    },
    [gdsWindow, module],
  );

  return { setRef };
}
