import { createContext, useContext } from "react";
import { Content, ContentSelector } from "@content/content";
import { ContentResult } from "@content/contentBase";

const ContentContext = createContext<Content>(null as any);

export const ContentProvider = ContentContext.Provider;
export const ContentConsumer = ContentContext.Consumer;

type ContentQuery<Param, Response> = (contentQuery: Param) => Response;

interface IUseContent {
  content: Content;
  getContentFromResult: ContentQuery<ContentResult, string>;
  getContent: ContentQuery<React.ReactChild | ContentSelector, React.ReactChild>;
  getResultByQuery: ContentQuery<ContentSelector, ContentResult>;
}

export const getContentFromResult: IUseContent["getContentFromResult"] = ({ content }) => content;

export const useContent = (): IUseContent => {
  const appContent = useContext(ContentContext);

  if (!appContent) {
    throw new Error("useContent() must be used within a <ContentProvider />");
  }

  // Note: This util check if the param is a content solution and gets it or returns the original value
  const getContent = (contentRequest: React.ReactChild | ContentSelector): React.ReactChild => {
    return isContentSolution(contentRequest) ? contentRequest(appContent).content : contentRequest;
  };

  const getResultByQuery = (contentQuery: ContentSelector) => contentQuery(appContent);

  return {
    content: appContent,
    getContent,
    getResultByQuery,
    getContentFromResult,
  };
};

// Note: A type guard for inferring ContentSelector correctly
export function isContentSolution(content: any): content is ContentSelector {
  const isNotString = typeof content !== "string";
  const isFn = typeof content === "function";

  return isNotString && isFn;
}
