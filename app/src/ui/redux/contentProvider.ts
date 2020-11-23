import { createContext } from "react";
import { Content } from "@content/content";

export const ContentContext = createContext<Content>(null as any);

export const ContentProvider = ContentContext.Provider;
export const ContentConsumer = ContentContext.Consumer;
