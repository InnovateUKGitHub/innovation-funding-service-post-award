import React from "react";
import { useStores } from "@ui/redux";

export interface PageTitleProps {
  title?: string;
  caption?: string;
}

export function PageTitle({ caption, title }: PageTitleProps) {
  const stores = useStores();

  const titleValue = title || stores.navigation.getPageTitle().displayTitle;

  if (!titleValue || !titleValue.length) return null;

  return (
    <div data-qa="page-title">
      {caption && (
        <span className="govuk-caption-xl" data-qa="page-title-caption">
          {caption}
        </span>
      )}

      <h1 className="govuk-heading-xl clearFix" data-qa="page-title-value">
        {titleValue}
      </h1>
    </div>
  );
}
