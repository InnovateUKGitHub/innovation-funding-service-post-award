import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { noop } from "@ui/helpers/noop";
import { createContext, useContext, ReactNode, useState } from "react";

type TMessageContext = {
  messages: string[];
  clearMessages: () => void;
  pushMessage: (message: string) => void;
};

const MessageContext = createContext<TMessageContext>({
  messages: [],
  clearMessages: noop,
  pushMessage: noop,
} as TMessageContext);

export const MessageContextProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const messageContext: TMessageContext = {
    messages,
    clearMessages() {
      setMessages([]);
    },
    pushMessage(message) {
      setMessages([...messages, message]);
      scrollToTheTopSmoothly();
    },
  };
  return <MessageContext.Provider value={messageContext}>{children}</MessageContext.Provider>;
};

export const useMessageContext = () => useContext(MessageContext);
