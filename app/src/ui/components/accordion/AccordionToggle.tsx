import cx from "classnames";

export interface AccordionToggleProps {
  isOpen: boolean;
}

export function AccordionToggle({ isOpen }: AccordionToggleProps) {
  return (
    <span
      className={cx("govuk-accordion-nav__chevron", {
        "govuk-accordion-nav__chevron--down": !isOpen,
      })}
    />
  );
}
