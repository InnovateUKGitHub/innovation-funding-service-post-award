import { actionTypes } from "redux-router5";
import { RootActions } from "../actions/root";

interface Message {
  message: string;
  ttl: number;
}

export const messagesReducer = (state: Message[] = [], action: RootActions) => {
  if (action.type === actionTypes.TRANSITION_SUCCESS && action.payload.previousRoute !== null) {
    // decrement value after comparison so it doesn't immediately get removed
    return state.filter(x => x.ttl-- > 0);
  }

  if (action.type === "REMOVE_MESSAGES") {
    return [];
  }

  if(action.type === "MESSAGE_SUCCESS") {
    const message = { message: action.payload, ttl: 1 };
    return state.concat(message);
  }

  return state;
};
