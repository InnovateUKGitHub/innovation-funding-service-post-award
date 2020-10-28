import { createContext, useContext } from "react";
import { Content } from "@content/content";
import { ContentResult } from "@content/contentBase";

const ContentContext = createContext<Content>(null as any);

export const ContentProvider = ContentContext.Provider;
export const ContentConsumer = ContentContext.Consumer;

export const useContentResult = (result: ContentResult): string =>
  result.content;

type ContentHookResponse = [Content, (result: ContentResult) => string];

export const useContent = (): ContentHookResponse => {
  const content = useContext(ContentContext);

  return [content, useContentResult];
};
