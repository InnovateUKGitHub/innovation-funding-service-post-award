import { RootActions } from "../actions/root";

interface Message {
  message: string;
  ttl: number;
}

export const messagesReducer = (state: Message[] = [], action: RootActions) => {
  if (action.type === "ROUTE_TRANSITION") {
    // decrement value before comparison since transition success is dispatched at a different stage after migrating to react-router.
    return state.filter(x => --x.ttl > 0);
  }

  if (action.type === "REMOVE_MESSAGES") {
    return [];
  }

  if (action.type === "MESSAGE_SUCCESS") {
    const message = { message: action.payload || "", ttl: 1 };
    return state.concat(message);
  }

  return state;
};
