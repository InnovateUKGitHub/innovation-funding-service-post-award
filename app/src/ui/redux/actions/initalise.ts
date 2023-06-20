import { createAction } from "./common/createAction";

export type InitaliseAction = ReturnType<typeof initaliseAction>;
export const initaliseAction = () => createAction("INITALISE");
