import { ThunkAction } from "redux-thunk";
import { RootActions } from "../root";
import { RootState } from "../../reducers/rootReducer";

type FunctionType = (...args: any[]) => any;
interface IActionCreatorsMapObject {
  [ac: string]: FunctionType;
}
export type ActionsUnion<T extends IActionCreatorsMapObject> = ReturnType<T[keyof T]>;
export type AsyncThunk<T, A extends RootActions = RootActions> = ThunkAction<Promise<T>, RootState, any, A>;

export function createAction<T extends string, P>(type: T, payload?: P) {
  return payload === undefined ? { type } : { type, payload };
}
