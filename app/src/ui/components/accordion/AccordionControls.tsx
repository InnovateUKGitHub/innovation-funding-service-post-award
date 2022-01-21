import { AccordionToggle } from "./AccordionToggle";

export interface AccordionControlsProps {
  onClick: (openAllNodes: boolean) => void;
  isOpen: boolean;
}

export function AccordionControls({ isOpen, onClick }: AccordionControlsProps) {
  const showAllText = isOpen ? "Hide all sections" : "Show all sections";

  return (
    <div className="govuk-accordion__controls">
      <button
        type="button"
        data-qa="all-accordion-toggle"
        className="govuk-accordion__show-all"
        aria-expanded={isOpen}
        onClick={() => onClick(!isOpen)}
      >
        <AccordionToggle isOpen={isOpen} />

        <span className="govuk-accordion__show-all-text">{showAllText}</span>
      </button>
    </div>
  );
}
