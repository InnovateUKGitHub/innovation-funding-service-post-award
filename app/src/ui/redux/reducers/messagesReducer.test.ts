import { removeMessages } from "../actions/common/messageActions";
import { routeTransition } from "../actions/common/transitionActions";
import { RootActions } from "../actions/root";
import { messagesReducer } from "./messagesReducer";

const successMessage = (message: string) =>
  ({
    type: "MESSAGE_SUCCESS",
    payload: message,
  } as RootActions);

const navigate = () => routeTransition();

describe("MessagesReducer", () => {
  it("should add message to store", () => {
    const message = "test message";
    const action = successMessage(message);
    const result = messagesReducer([], action);
    expect(result.length).toBe(1);
    expect(result.pop()).toEqual({ ttl: 1, message });
  });

  it("should remove message after two page navigations", () => {
    const message = "test message 3";
    const action = successMessage(message);
    const first = messagesReducer([], action);
    const second = messagesReducer(first, navigate());
    const third = messagesReducer(second, navigate());
    expect(third.length).toBe(0);
  });

  it("should remove messages", () => {
    const message = "test message 3";
    const successAction = successMessage(message);
    const first = messagesReducer([], successAction);
    const second = messagesReducer(first, successAction);
    const third = messagesReducer(second, removeMessages());
    expect(third.length).toBe(0);
  });
});
