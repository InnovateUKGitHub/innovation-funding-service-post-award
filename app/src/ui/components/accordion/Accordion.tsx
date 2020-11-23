import React, { useState } from "react";

import { useIsClient } from "@ui/hooks";
import { AccordionForceOptions, AccordionProvider, IAccordionContext } from "./accordion-context";
import { AccordionControls } from "./AccordionControls";
import { AccordionItem } from "./AccordionItem";

export interface AccordionProps {
  children: React.ReactNode;
  qa?: string;
}

export function Accordion({ qa, children }: AccordionProps) {
  const jsEnabled = useIsClient();
  const [forceIsOpen, setForceState] = useState<AccordionForceOptions>(null);
  const [openCount, setOpenCount] = useState<number>(0);
  const [subscribedCount, setSubscribedCount] = useState<number>(0);

  const isAllOpen = subscribedCount === openCount;

  const subscribe = () => setSubscribedCount((state) => state + 1);

  const handleClick = () => {
    setForceState(!isAllOpen);
    setOpenCount(isAllOpen ? 0 : subscribedCount);
  };

  const toggle = (isOpen: boolean) => {
    setForceState(null);
    setOpenCount((state) => (isOpen ? state + 1 : state - 1));
  };

  const context: IAccordionContext = {
    forceIsOpen,
    subscribe,
    toggle,
  };

  const qaValue = qa ? qa + "-accordion-container" : "accordion-container";

  return (
    <div className="govuk-accordion" data-qa={qaValue}>
      {jsEnabled && <AccordionControls isOpen={isAllOpen} onClick={handleClick} />}

      <AccordionProvider value={context}>{children}</AccordionProvider>
    </div>
  );
}

Accordion.Item = AccordionItem;
