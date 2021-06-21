import { useContext } from "react";

import { contentContext } from "@ui/redux/contentProvider";
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

/**
 * @description Provide a mechanism which checks for a valid ContentResult before getting content. This gives more meaningful error messages in tests too!
 */
const getContentResult = (queryFn: Function, contentPayload: Content): ContentResult => {
  const missingParentPropertyError = "MISSING_PARENT";
  try {
    const queriedContent = queryFn(contentPayload);

    if (typeof queriedContent === "undefined") {
      throw new Error(missingParentPropertyError);
    }

    return queriedContent;
  } catch (error) {
    const queryAsString = queryFn.toString();
    const queryFnParts = queryAsString.split(".");

    const propertyMissingParent = queryFnParts[queryFnParts.length - 2];
    const propertyMissingElement = queryFnParts[queryFnParts.length - 1];

    const errorMessage =
      error.message === missingParentPropertyError
        ? `It appears '${propertyMissingElement}' is not available within the '${propertyMissingParent}' property. There is a problem with your available content object. Query => ${queryAsString}`
        : `It appears the following query did not find a result -> ${queryAsString}`;

    throw new Error(errorMessage);
  }
};

export const getContentFromResult: IUseContent["getContentFromResult"] = ({ content }) => content;

export const useContent = (): IUseContent => {
  const appContent = useContext(contentContext);

  if (!appContent) {
    throw new Error("useContent() must be used within a <ContentProvider />");
  }

  const getContent = (contentRequest: string | ContentSelector): string => {
    return isContentSolution(contentRequest)
      ? getContentFromResult(getContentResult(contentRequest, appContent))
      : contentRequest;
  };

  const getResultByQuery = (contentQuery: ContentSelector) => getContentResult(contentQuery, appContent);

  return {
    content: appContent,
    getContent,
    getResultByQuery,
    getContentFromResult,
  };
};
