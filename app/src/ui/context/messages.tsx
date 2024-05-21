import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { noop } from "@ui/helpers/noop";
import { createContext, useContext, ReactNode, useState } from "react";

type TMessageContext = {
  messages: string[];
  clearMessages: () => void;
  setSuccessMessage: (message: string) => void;
};

const MessageContext = createContext<TMessageContext>({
  messages: [],
  clearMessages: noop,
  setSuccessMessage: noop,
} as TMessageContext);

export const MessageContextProvider = ({
  children,
  preloadedMessages,
}: {
  children: ReactNode;
  preloadedMessages: Nullable<string[]>;
}) => {
  const [messages, setMessages] = useState<string[]>(preloadedMessages ?? []);

  const messageContext: TMessageContext = {
    messages,
    clearMessages() {
      setMessages(() => []);
    },
    setSuccessMessage(message) {
      setMessages(state => [...state, message]);
      scrollToTheTopSmoothly();
    },
  };
  return <MessageContext.Provider value={messageContext}>{children}</MessageContext.Provider>;
};

export const useMessageContext = () => useContext(MessageContext);
