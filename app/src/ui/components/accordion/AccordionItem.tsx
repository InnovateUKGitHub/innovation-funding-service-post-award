import React from "react";
import cx from "classnames";
import { useContent } from "@ui/hooks/content.hook";
import type { ContentSelector } from "@copy/type";
import { removeSpaces } from "@shared/string-helpers";
import { AccordionToggle } from "./AccordionToggle";
import { useMounted } from "@ui/features/has-mounted/Mounted";
import { AccessibilityText } from "../renderers/accessibilityText";

// TODO: Merge props.titleContent into props.title
export interface AccordionItemProps {
  children: React.ReactNode;
  qa: string;
  title: string | ContentSelector;
  isOpen?: boolean;
  onClick?: () => void;
}

export const AccordionItem = ({ qa, children, isOpen = false, onClick, ...props }: AccordionItemProps) => {
  const { isClient } = useMounted();
  const { getContent } = useContent();

  const uid = removeSpaces(qa.toLowerCase());
  const accordionHeadingId = `accordion-default-heading-${uid}`;
  const accordionContentId = `accordion-default-content-${uid}`;

  let title;

  if (typeof props.title === "string") {
    title = props.title;
  } else {
    title = getContent(props.title);
  }

  return (
    <div
      data-qa={qa}
      className={cx("govuk-accordion__section", {
        "govuk-accordion__section--expanded": isOpen,
      })}
    >
      <div className="govuk-accordion__section-header">
        <h2 className="govuk-accordion__section-heading">
          {isClient ? (
            <button
              type="button"
              aria-controls={accordionContentId}
              className="govuk-accordion__section-button"
              aria-expanded={isOpen}
              onClick={onClick}
              data-qa="accordion-toggle"
            >
              <span className="govuk-accordion__section-heading-text" id={accordionHeadingId}>
                <span className="govuk-accordion__section-heading-text-focus">{title}</span>
              </span>

              {/* prettier-ignore */}
              <AccessibilityText as="span" className="govuk-accordion__section-heading-divider">, </AccessibilityText>

              <span className="govuk-accordion__section-toggle">
                <span className="govuk-accordion__section-toggle-focus">
                  <AccordionToggle isOpen={isOpen} />

                  <span className="govuk-accordion__section-toggle-text">
                    {isOpen ? "Hide" : "Show"} <AccessibilityText as="span">this section</AccessibilityText>
                  </span>
                </span>
              </span>
            </button>
          ) : (
            <span className="govuk-accordion__section-button govuk-heading-m" id={accordionHeadingId}>
              {title}
            </span>
          )}
        </h2>
      </div>

      <div id={accordionContentId} className="govuk-accordion__section-content" aria-labelledby={accordionHeadingId}>
        {children}
      </div>
    </div>
  );
};
