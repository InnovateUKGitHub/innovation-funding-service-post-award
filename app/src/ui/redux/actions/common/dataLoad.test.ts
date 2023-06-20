import { LoadingStatus } from "@framework/constants/enums";
import { IAppError } from "@framework/types/IAppError";
import { Pending } from "@shared/pending";
import { IDataStore } from "@ui/redux/reducers/dataReducer";
import { RootState } from "@ui/redux/reducers/rootReducer";
import { IDataSelector } from "@ui/redux/selectors/common/data";
import { dataLoadAction, conditionalLoad } from "./dataLoad";

describe("dataLoadAction", () => {
  test("action type is DATA_LOAD", () => {
    const result = dataLoadAction("a", "b", 1, {});
    expect(result.type).toBe("DATA_LOAD");
  });

  it("should have correct payload", () => {
    const result = dataLoadAction("a", "b", 1, {});
    const expected = {
      id: "a",
      store: "b",
      status: 1,
      data: {},
    };
    expect(result.payload).toMatchObject(expected);
  });

  it("should have correct payload with error", () => {
    const result = dataLoadAction("a", "b", 2, "d", { code: 418, message: "I'm a teapot" });
    const expected = {
      id: "a",
      store: "b",
      status: 2,
      data: "d",
      error: { code: 418, message: "I'm a teapot" },
    };
    expect(result.payload).toMatchObject(expected);
  });
});

describe("conditionalLoad", () => {
  const getState = () => ({} as RootState);

  it("should return a thunk", () => {
    const result = conditionalLoad({} as IDataSelector<unknown>, jest.fn());
    expect(typeof result).toBe("function");
  });

  test("no existing data dispatches Loading dataLoadAction", () => {
    const dispatch = jest.fn();

    const selector = {
      get: () => null as unknown as IDataStore<unknown>,
      key: "1",
      store: "test",
    } as unknown as IDataSelector<unknown>;
    const load = jest.fn(() => new Promise(jest.fn()));
    const thunk = conditionalLoad(selector, load);
    const action = dataLoadAction(selector.key, selector.store as string, LoadingStatus.Loading, null);

    thunk(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(action);
  });

  test("no existing data calls 'load'", async () => {
    const dispatch = jest.fn();
    const selector = {
      get: () => null as unknown as IDataStore<unknown>,
    } as unknown as IDataSelector<unknown>;
    const load = jest.fn(() => Promise.resolve());
    const thunk = conditionalLoad(selector, load);

    await thunk(dispatch, getState, undefined);
    expect(load).toHaveBeenCalled();
  });

  test("no existing data dispatches Done dataLoadAction for result of 'load'", async () => {
    const dispatch = jest.fn();
    const selector = {
      get: () => null as unknown as IDataStore<unknown>,
      key: "1",
      store: "test",
    } as unknown as IDataSelector<unknown>;
    const data = { test: 1 };
    const load = jest.fn(() => Promise.resolve(data));
    const thunk = conditionalLoad(selector, load);
    const action = dataLoadAction(selector.key, selector.store as string, LoadingStatus.Done, data);

    await thunk(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenLastCalledWith(action);
  });

  test("load error dispatches Failed dataLoadAction", async () => {
    const dispatch = jest.fn();
    const selector = {
      get: () => null as unknown as IDataStore<unknown>,
      key: "1",
      store: "test",
    } as unknown as IDataSelector<unknown>;
    const error: IAppError = {
      code: 418,
      message: "I am a teapot",
    };
    const load = jest.fn(() => Promise.reject(error));
    const thunk = conditionalLoad(selector, load);
    const action = dataLoadAction(selector.key, selector.store as string, LoadingStatus.Failed, null, error);

    await thunk(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenLastCalledWith(action);
  });

  test("existing data in Preload state dispatches Loading dataLoadAction and calls 'load'", () => {
    const dispatch = jest.fn();
    const data = { test: "already loaded1" };
    const selector: IDataSelector<unknown> = {
      get: () => ({ status: LoadingStatus.Preload, data, error: null }),
      key: "1",
      store: "broadcasts",
      getPending: () => null as unknown as Pending<unknown>,
    };
    const load = jest.fn(() => new Promise(jest.fn()));
    const thunk = conditionalLoad(selector, load);
    const action = dataLoadAction(selector.key, selector.store as string, LoadingStatus.Loading, data);

    thunk(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(action);
    expect(load).toHaveBeenCalled();
  });

  test("existing data in Stale state dispatches Loading dataLoadAction and calls 'load'", () => {
    const dispatch = jest.fn();
    const data = { test: "already loaded2" };
    const selector: IDataSelector<unknown> = {
      get: () => ({ status: LoadingStatus.Stale, data, error: null }),
      key: "1",
      store: "broadcasts",
      getPending: () => null as unknown as Pending<unknown>,
    };
    const load = jest.fn(() => new Promise(jest.fn()));
    const thunk = conditionalLoad(selector, load);
    const action = dataLoadAction(selector.key, selector.store as string, LoadingStatus.Loading, data);

    thunk(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(action);
    expect(load).toHaveBeenCalled();
  });

  test("existing data in Done state doesn't dispatch or load", () => {
    const dispatch = jest.fn();
    const data = { test: "already loaded3" };
    const selector: IDataSelector<unknown> = {
      get: () => ({ status: LoadingStatus.Done, data, error: null }),
      key: "1",
      store: "broadcasts",
      getPending: () => null as unknown as Pending<unknown>,
    };
    const load = jest.fn(() => new Promise(jest.fn()));
    const thunk = conditionalLoad(selector, load);

    thunk(dispatch, getState, undefined);
    expect(dispatch).not.toHaveBeenCalled();
    expect(load).not.toHaveBeenCalled();
  });

  test("existing data in Failed state doesn't dispatch or load", () => {
    const dispatch = jest.fn();
    const selector: IDataSelector<unknown> = {
      get: () => ({ status: LoadingStatus.Failed, data: {}, error: null }),
      key: "1",
      store: "broadcasts",
      getPending: () => null as unknown as Pending<unknown>,
    };
    const load = jest.fn(() => new Promise(jest.fn()));
    const thunk = conditionalLoad(selector, load);

    thunk(dispatch, getState, undefined);
    expect(dispatch).not.toHaveBeenCalled();
    expect(load).not.toHaveBeenCalled();
  });
});
