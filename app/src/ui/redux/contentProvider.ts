import React from "react";
import { Content } from "@content/content";

const ContentContext = React.createContext<Content>(null as any);

export const ContentProvider = ContentContext.Provider;
export const ContentConsumer = ContentContext.Consumer;
