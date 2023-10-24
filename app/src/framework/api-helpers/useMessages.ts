import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { messageSuccess, removeMessages } from "@ui/redux/actions/common/messageActions";
import { RootState } from "@ui/redux/reducers/rootReducer";
import { useStores } from "@ui/redux/storesProvider";
import { useStore } from "react-redux";

/**
 * Hook manages messages for e.g. successful document upload
 */

export const useMessages = () => {
  const store = useStore<RootState>();
  const stores = useStores();

  const clearMessages = () => {
    stores.messages.clearMessages();
  };

  const setSuccessMessage = (successMessage: string) => {
    store.dispatch(removeMessages());
    store.dispatch(messageSuccess(successMessage));
    scrollToTheTopSmoothly();
  };

  return {
    clearMessages,
    setSuccessMessage,
  };
};
