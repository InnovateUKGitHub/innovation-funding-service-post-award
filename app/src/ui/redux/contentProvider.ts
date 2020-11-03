import { createContext, useContext } from "react";
import { Content, ContentSelector } from "@content/content";
import { ContentResult } from "@content/contentBase";

const ContentContext = createContext<Content>(null as any);

export const ContentProvider = ContentContext.Provider;
export const ContentConsumer = ContentContext.Consumer;

type IGetContentResult = (contentResultQuery: ContentResult) => string;

export const getContentResult: IGetContentResult = ({ content }) => content;

export const useContent = (): {
  content: Content;
  getCopy: (contentQuery: ContentSelector) => string;
  getContentResult: IGetContentResult;
} => {
  const appContent = useContext(ContentContext);

  if (!appContent) {
    throw new Error("useContent must be used within a ContentProvider");
  }

  return {
    content: appContent,
    getCopy: (contentQuery: ContentSelector) => contentQuery(appContent).content,
    getContentResult,
  };
};
