import { createAction } from "./createAction";

export type MessageActions = messageSuccess;

export type messageSuccess = ReturnType<typeof messageSuccess>;
export const messageSuccess = (message: string) => createAction("MESSAGE_SUCCESS", message);
