import { Logger } from "@shared/developmentLogger";
import { SyntheticEvent, FocusEvent, ChangeEvent } from "react";
import { useMessages } from "./useMessages";

const logger = new Logger("RHF Message Clearer");

type Elements = HTMLFormElement | HTMLInputElement | HTMLSelectElement | HTMLOptionElement | HTMLButtonElement;

const useClearMessagesOnBlurOrChange = () => {
  const { clearMessages } = useMessages();
  const onBlurOrChange = (e: SyntheticEvent<Elements>) => {
    switch (e.type) {
      case "blur":
        const blurEvent = e as FocusEvent<Elements>;

        if (blurEvent.target.nodeName === "INPUT") {
          const inputNode = blurEvent.target as HTMLInputElement;

          if (inputNode.type === "file") {
            // If a blur event happened on a file input, clear messages.
            clearMessages();
          }
        }
        break;

      case "change":
        const changeEvent = e as ChangeEvent<Elements>;

        if (changeEvent.target.nodeName === "INPUT") {
          const inputNode = changeEvent.target as HTMLInputElement;

          if (inputNode.type !== "file") {
            // If a change event happened on a non-file input, clear messages.
            clearMessages();
          }
        } else if (changeEvent.target.nodeName !== "BUTTON") {
          // If a change event happened on a non-button, clear messages.
          clearMessages();
        }
        break;

      default:
        logger.error(
          "Event was not a `blur` or `change` event - Did you pass the onBlurOrChange function to the wrong event?",
        );
        break;
    }
  };

  return onBlurOrChange;
};

export { useClearMessagesOnBlurOrChange };
