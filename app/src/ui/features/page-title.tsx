import { createContext, useContext } from "react";

export interface PageTitleContext {
  pageTitle: string;
}

const pageTitleContext = createContext<PageTitleContext | undefined>(undefined);

interface PageTitleProviderProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Provider for pageTitleContext
 */
export function PageTitleProvider({ title, ...props }: PageTitleProviderProps) {
  const payload = {
    pageTitle: title,
  };

  return <pageTitleContext.Provider {...props} value={payload} />;
}

/**
 * useContext hook for pageTitle context
 */
function usePageTitle(): PageTitleContext {
  const context = useContext(pageTitleContext);

  if (!context) {
    throw Error("You are missing '<PageTitleProvider />' from a parent node.");
  }

  return context;
}

export interface PageTitleProps {
  title?: string;
  caption?: string;
}

/**
 * ReactComponent for page title
 */
export function PageTitle({ caption, title }: PageTitleProps) {
  const { pageTitle } = usePageTitle();

  const titleValue = title || pageTitle;

  if (!titleValue.length) return null;

  return (
    <div data-qa="page-title">
      {caption && (
        <span className="govuk-caption-xl" data-qa="page-title-caption">
          {caption}
        </span>
      )}

      <h1 className="govuk-heading-xl clearFix">{titleValue}</h1>
    </div>
  );
}
