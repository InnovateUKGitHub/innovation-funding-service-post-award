import React from "react";
import { AccessibilityText } from "../renderers";

export interface AccordionControlsProps {
  onClick: () => void;
  isOpen: boolean;
}

export function AccordionControls({ isOpen, onClick }: AccordionControlsProps) {
  const toggleText = isOpen ? "Close all" : "Open all";
  const ariaText = "sections";

  return (
    <div className="govuk-accordion__controls">
      <button
        type="button"
        data-module="govuk-button"
        data-qa="accordion-toggle"
        className="govuk-accordion__open-all"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        {toggleText} <AccessibilityText>{ariaText}</AccessibilityText>
      </button>
    </div>
  );
}
