import { useContext } from "react";

import { ContentContext } from "@ui/redux/contentProvider";
import { Content, ContentSelector } from "@content/content";
import { ContentResult } from "@content/contentBase";

// Note: A type guard for inferring ContentSelector correctly
export function isContentSolution(content: unknown): content is ContentSelector {
  const isNotString = typeof content !== "string";
  const isFn = typeof content === "function";

  return isNotString && isFn;
}

type ContentQuery<Param, Response> = (contentQuery: Param) => Response;

interface IUseContent {
  content: Content;
  getContentFromResult: ContentQuery<ContentResult, string>;
  getContent: ContentQuery<string | ContentSelector, string>;
  getResultByQuery: ContentQuery<ContentSelector, ContentResult>;
}

export const getContentFromResult: IUseContent["getContentFromResult"] = ({ content }) => content;

export const useContent = (): IUseContent => {
  const appContent = useContext(ContentContext);

  if (!appContent) {
    throw new Error("useContent() must be used within a <ContentProvider />");
  }

  // Note: This util check if the param is a content solution and gets it or returns the original value
  const getContent = (contentRequest: string | ContentSelector): string => {
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
