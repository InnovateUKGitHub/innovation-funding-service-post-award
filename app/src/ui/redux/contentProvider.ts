import { createContext, useContext } from "react";
import { Content } from "@content/content";

const ContentContext = createContext<Content>(null as any);

export const ContentProvider = ContentContext.Provider;
export const ContentConsumer = ContentContext.Consumer;
export const useContent = () => useContext(ContentContext);
