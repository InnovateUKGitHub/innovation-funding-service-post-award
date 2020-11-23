import React, { useEffect, useState } from "react";
import cx from "classnames";

import { useContent, useIsClient } from "@ui/hooks";
import { ContentSelector } from "@content/content";
import { useAccordion } from "./accordion-context";

// TODO: Merge props.titleContent into props.title
export interface AccordionItemProps {
  children: React.ReactNode;
  qa: string;
  // TODO: Remove optional property when titleContent is removed
  title?: string | ContentSelector;
  /**
   * @deprecated The method should not be used, please use props.title instead
   */
  titleContent?: ContentSelector;
}

const gdsClasses = {
  section: "govuk-accordion__section",
  sectionExpanded: "govuk-accordion__section--expanded",
  heading: "govuk-accordion__section-heading",
  header: "govuk-accordion__section-header",
  // TODO: Investigate if this is being used during GDS Upgrade
  headerFocused: "govuk-accordion__section-header--focused",
  button: "govuk-accordion__section-button",
  icon: "govuk-accordion__icon",
  content: "govuk-accordion__section-content",
};

export function AccordionItem({ qa, titleContent, title, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const { forceIsOpen, ...context } = useAccordion();
  const { getContent } = useContent();
  const jsEnabled = useIsClient();

  useEffect(() => {
    context.subscribe();

    // Note: Open by default to support SSR
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (forceIsOpen === null) return;

    setIsOpen(forceIsOpen);
  }, [forceIsOpen]);

  const handleBlur = () => setIsFocused(false);
  const handleFocus = () => setIsFocused(true);

  const handleClick = () => {
    const newState = !isOpen;

    context.toggle(newState);
    setIsOpen(newState);
  };

  const titleMessage = titleContent ? getContent(titleContent) : title && getContent(title);
  const noTitleAvailable: boolean = !(titleMessage && titleMessage.length);

  if (noTitleAvailable) return null;

  return (
    <div
      data-qa={qa}
      className={cx(gdsClasses.section, {
        [gdsClasses.sectionExpanded]: isOpen,
      })}
    >
      <div
        role="button"
        aria-pressed={isOpen}
        onClick={handleClick}
        data-qa="accordion-item-header"
        className={cx(gdsClasses.header, {
          [gdsClasses.headerFocused]: isFocused,
        })}
      >
        <p className={gdsClasses.heading}>
          {jsEnabled ? (
            <button
              data-module="govuk-button"
              data-qa="accordion-item-js-title"
              type="button"
              className={gdsClasses.button}
              aria-expanded={isOpen}
              onBlur={handleBlur}
              onFocus={handleFocus}
            >
              {titleMessage}
              <span className={gdsClasses.icon} aria-hidden={!isOpen} />
            </button>
          ) : (
            <span data-qa="accordion-item-nojs-title" className={gdsClasses.button}>
              {titleMessage}
            </span>
          )}
        </p>
      </div>

      <div className={gdsClasses.content}>{children}</div>
    </div>
  );
}
