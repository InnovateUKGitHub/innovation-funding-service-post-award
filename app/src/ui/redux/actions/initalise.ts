import { createAction } from "./common";

export type InitaliseAction = ReturnType<typeof initaliseAction>;
export const initaliseAction = () => createAction("INITALISE");
