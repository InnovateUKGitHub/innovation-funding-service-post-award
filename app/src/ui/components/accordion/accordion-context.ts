import { createContext, useContext } from "react";
import { noop } from "@ui/helpers/noop";

export type AccordionForceOptions = boolean | null;

export interface IAccordionContext {
  forceIsOpen: AccordionForceOptions;
  toggle: (open: boolean) => void;
  subscribe: () => void;
}

const accordionContext = createContext<IAccordionContext>({
  forceIsOpen: null,
  toggle: noop,
  subscribe: noop,
});

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AccordionProvider = accordionContext.Provider;
export const useAccordion = () => useContext<IAccordionContext>(accordionContext);
