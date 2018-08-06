import { ThunkAction } from "redux-thunk";
import { RootActions } from "./root";
import { RootState } from "../reducers";

export interface Action<T extends string> { 
  type: T;
}

export interface ActionWithPayload<T extends string, P> extends Action<T> {
  payload: P;
}

type FunctionType = (...args: any[]) => any;
type ActionCreatorsMapObject = { [ac: string]: FunctionType };
export type ActionsUnion<T extends ActionCreatorsMapObject> = ReturnType<T[keyof T]>;

// export type ModuleThunk<T, S, A extends Action<any>> = ThunkAction<Promise<T>, S, {}, A>;

export type AsyncThunk<T, A extends RootActions = RootActions> = ThunkAction<Promise<T>, RootState, any, A>;
// conditional async thunk?

export function createAction<T extends string>(type: T): Action<T>;
export function createAction<T extends string, P>(type: T, payload: P): ActionWithPayload<T, P>;
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
