import { createAction } from "./createAction";

export type MessageActions = MessageSuccess | RemoveMessages;

type MessageSuccess = ReturnType<typeof messageSuccess>;
export const messageSuccess = (message: string) => createAction("MESSAGE_SUCCESS", message);

type RemoveMessages = ReturnType<typeof removeMessages>;
export const removeMessages = () => createAction("REMOVE_MESSAGES");
