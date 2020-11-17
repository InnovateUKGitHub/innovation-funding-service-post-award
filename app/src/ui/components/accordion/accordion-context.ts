import { createContext, useContext } from "react";
import { noop } from "@ui/helpers/noop";

export type AccordionForceOptions = boolean | null;

export interface IAccordionContext {
  forceIsOpen: AccordionForceOptions;
  toggle: (open: boolean) => void;
  subscribe: () => void;
}

const AccordionContext = createContext<IAccordionContext>({
  forceIsOpen: null,
  toggle: noop,
  subscribe: noop,
});

export const AccordionProvider = AccordionContext.Provider;
export const useAccordion = () => useContext<IAccordionContext>(AccordionContext);
