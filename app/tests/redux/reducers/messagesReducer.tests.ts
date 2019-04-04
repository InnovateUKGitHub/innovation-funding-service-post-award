import { messagesReducer } from "../../../src/ui/redux/reducers";
import { removeMessages } from "../../../src/ui/redux/actions/common";

const successMessage = (message: string): any => ({
  type: "MESSAGE_SUCCESS",
  payload: message
});

const navigate = (): any => ({
  type: "@@router5/TRANSITION_SUCCESS",
  payload: { previousRoute: "" }
});

describe("MessagesReducer", () => {
  it("should add message to store", () => {
    const message = "test message";
    const action  = successMessage(message);
    const result  = messagesReducer([], action);
    expect(result.length).toBe(1);
    expect(result.pop()).toEqual({ ttl: 1, message });
  });

  it("should retain message after single page navigation", () => {
    const message = "test message 2";
    const action  = successMessage(message);
    const before  = messagesReducer([], action);
    const after   = messagesReducer(before, navigate());
    expect(after.length).toBe(1);
    expect(after.pop()).toEqual({ ttl: 0, message });
  });

  it("should remove message after two page navigations", () => {
    const message = "test message 3";
    const action  = successMessage(message);
    const first   = messagesReducer([], action);
    const second  = messagesReducer(first, navigate());
    const third   = messagesReducer(second, navigate());
    expect(third.length).toBe(0);
  });

  it("should remove messages", () => {
    const message = "test message 3";
    const successAction  = successMessage(message);
    const first   = messagesReducer([], successAction);
    const second   = messagesReducer(first, successAction);
    const third  = messagesReducer(second, removeMessages());
    expect(third.length).toBe(0);
  });
});
