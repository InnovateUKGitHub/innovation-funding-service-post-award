import { ThunkAction } from "redux-thunk";
import { RootActions } from "./root";
import { RootState } from "../reducers/rootReducer";

export interface IAction<T extends string> {
  type: T;
}

export interface IActionWithPayload<T extends string, P> extends IAction<T> {
  payload: P;
}

type FunctionType = (...args: any[]) => any;
interface IActionCreatorsMapObject {
  [ac: string]: FunctionType;
}
export type ActionsUnion<T extends IActionCreatorsMapObject> = ReturnType<T[keyof T]>;

// export type ModuleThunk<T, S, A extends Action<any>> = ThunkAction<Promise<T>, S, {}, A>;

export type AsyncThunk<T, A extends RootActions = RootActions> = ThunkAction<Promise<T>, RootState, any, A>;
// conditional async thunk?

export function createAction<T extends string>(type: T): IAction<T>;
export function createAction<T extends string, P>(type: T, payload: P): IActionWithPayload<T, P>;
export function createAction<T extends string, P>(type: T, payload?: P) {
  return payload === undefined ? { type } : { type, payload };
}

// function createThunkAction<T extends string>(type: T): ThunkAction<T, RootState, {}, Actions> {
//   return (dispatch) => {
//     const action = createAction(type);
//     return dispatch(action);
//   }
// }

// function _base(type: any, store: any, status: any, identifier: any, payload: any, error: any) {
//   return { type, store, status, identifier, payload, error };
// }
