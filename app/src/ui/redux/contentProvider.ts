import { createContext, useContext } from "react";
import { Content, ContentSelector } from "@content/content";
import { ContentResult } from "@content/contentBase";

const ContentContext = createContext<Content>(null as any);

export const ContentProvider = ContentContext.Provider;
export const ContentConsumer = ContentContext.Consumer;

type GetContentFromResult = (contentResultQuery: ContentResult) => string;

export const getContentFromResult: GetContentFromResult = ({ content }) => content;

export const useContent = (): {
  content: Content;
  getContent: (contentQuery: ContentSelector) => string;
  getResultByQuery: (contentQuery: ContentSelector) => ContentResult;
  getContentFromResult: GetContentFromResult;
} => {
  const appContent = useContext(ContentContext);

  if (!appContent) {
    throw new Error("useContent must be used within a ContentProvider");
  }

  return {
    content: appContent,
    getContent: (contentQuery: ContentSelector) => contentQuery(appContent).content,
    getResultByQuery: (contentQuery: ContentSelector) => contentQuery(appContent),
    getContentFromResult,
  };
};
