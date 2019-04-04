import { createAction } from "./createAction";

export type MessageActions = messageSuccess | removeMessages;

export type messageSuccess = ReturnType<typeof messageSuccess>;
export const messageSuccess = (message: string) => createAction("MESSAGE_SUCCESS", message);

export type removeMessages = ReturnType<typeof removeMessages>;
export const removeMessages = () => createAction("REMOVE_MESSAGES");
