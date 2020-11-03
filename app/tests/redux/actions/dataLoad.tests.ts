
import { conditionalLoad, dataLoadAction } from "../../../src/ui/redux/actions";
import { LoadingStatus } from "../../../src/shared/pending";

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
      data: {}
    };
    expect(result.payload).toMatchObject(expected);
  });

  it("should have correct payload with error", () => {
    const result = dataLoadAction("a", "b", 2, "d", "e");
    const expected = {
      id: "a",
      store: "b",
      status: 2,
      data: "d",
      error: "e"
    };
    expect(result.payload).toMatchObject(expected);
  });
});

describe("conditionalLoad", () => {
  const getState = () => ({}) as any;

  it("should return a thunk", () => {
    const result = conditionalLoad({} as any, jest.fn());
    expect(typeof result).toBe("function");
  });

  test("no existing data dispatches Loading dataLoadAction", () => {
    const dispatch = jest.fn();
    const selector = { get: () => null, key: 1, store: "test" } as any;
    const load     = jest.fn(() => new Promise(jest.fn()));
    const thunk    = conditionalLoad(selector, load);
    const action   = dataLoadAction(selector.key, selector.store, LoadingStatus.Loading, null);

    thunk(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(action);
  });

  test("no existing data calls 'load'", async () => {
    const dispatch = jest.fn();
    const selector = { get: () => null } as any;
    const load     = jest.fn(() => Promise.resolve());
    const thunk    = conditionalLoad(selector, load);

    await thunk(dispatch, getState, undefined);
    expect(load).toHaveBeenCalled();
  });

  test("no existing data dispatches Done dataLoadAction for result of 'load'", async () => {
    const dispatch = jest.fn();
    const selector = { get: () => null, key: 1, store: "test" } as any;
    const data     = { test: 1 };
    const load     = jest.fn(() => Promise.resolve(data));
    const thunk    = conditionalLoad(selector, load);
    const action   = dataLoadAction(selector.key, selector.store, LoadingStatus.Done, data);

    await thunk(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenLastCalledWith(action);
  });

  test("load error dispatches Failed dataLoadAction", async () => {
    const dispatch = jest.fn();
    const selector = { get: () => null, key: 1, store: "test" } as any;
    const error    = new Error("I am an error");
    const load     = jest.fn(() => Promise.reject(error));
    const thunk    = conditionalLoad(selector, load);
    const action   = dataLoadAction(selector.key, selector.store, LoadingStatus.Failed, null, error);

    await thunk(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenLastCalledWith(action);
  });

  test("existing data in Preload state dispatches Loading dataLoadAction and calls 'load'", () => {
    const dispatch = jest.fn();
    const data     = { test: "already loaded1" };
    const selector = { get: () => ({ status: LoadingStatus.Preload, data }), key: 1, store: "test" } as any;
    const load     = jest.fn(() => new Promise(jest.fn()));
    const thunk    = conditionalLoad(selector, load);
    const action   = dataLoadAction(selector.key, selector.store, LoadingStatus.Loading, data);

    thunk(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(action);
    expect(load).toHaveBeenCalled();
  });

  test("existing data in Stale state dispatches Loading dataLoadAction and calls 'load'", () => {
    const dispatch = jest.fn();
    const data     = { test: "already loaded2" };
    const selector = { get: () => ({ status: LoadingStatus.Stale, data }), key: 1, store: "test" } as any;
    const load     = jest.fn(() => new Promise(jest.fn()));
    const thunk    = conditionalLoad(selector, load);
    const action   = dataLoadAction(selector.key, selector.store, LoadingStatus.Loading, data);

    thunk(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(action);
    expect(load).toHaveBeenCalled();
  });

  test("existing data in Done state doesn't dispatch or load", () => {
    const dispatch = jest.fn();
    const data     = { test: "already loaded3" };
    const selector = { get: () => ({ status: LoadingStatus.Done, data }), key: 1, store: "test" } as any;
    const load     = jest.fn(() => new Promise(jest.fn()));
    const thunk    = conditionalLoad(selector, load);

    thunk(dispatch, getState, undefined);
    expect(dispatch).not.toHaveBeenCalled();
    expect(load).not.toHaveBeenCalled();
  });

  test("existing data in Failed state doesn't dispatch or load", () => {
    const dispatch = jest.fn();
    const selector = { get: () => ({ status: LoadingStatus.Failed }), key: 1, store: "test" } as any;
    const load     = jest.fn(() => new Promise(jest.fn()));
    const thunk    = conditionalLoad(selector, load);

    thunk(dispatch, getState, undefined);
    expect(dispatch).not.toHaveBeenCalled();
    expect(load).not.toHaveBeenCalled();
  });
});
