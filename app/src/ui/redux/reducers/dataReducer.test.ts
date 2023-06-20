import { LoadingStatus } from "@framework/constants/enums";
import { DataLoadAction } from "../actions/common/dataLoad";
import { routeTransition } from "../actions/common/transitionActions";
import { dataReducer } from "./dataReducer";

const claimDataAction = (id: number, data: unknown, status = 1, error: unknown = {}) =>
  ({
    type: "DATA_LOAD",
    payload: {
      store: "claim",
      id,
      data,
      status,
      error,
    },
  } as unknown as DataLoadAction);

const state = {} as ReturnType<typeof dataReducer>;

describe("DataReducer", () => {
  test("given data is added to the store", () => {
    const id = 1;
    const data = { test: 123 };
    const action = claimDataAction(id, data);
    const result = dataReducer(state, action);
    expect(result.claim[id].data).toBe(data);
  });

  test("given status is added to the store", () => {
    const id = 2;
    const status = 13;
    const action = claimDataAction(id, {}, status);
    const result = dataReducer(state, action);
    expect(result.claim[id].status).toBe(status);
  });

  test("given error is added to the store", () => {
    const id = 3;
    const error = { code: 6, message: "test error", results: {} };
    const action = claimDataAction(id, {}, 0, error);
    const result = dataReducer(state, action);
    const errorResult = result.claim[id]?.error;
    expect(errorResult?.code).toBe(error.code);
    expect(errorResult?.message).toBe(error.message);
    expect(errorResult?.results).toBe(error.results);
  });

  test("reuses existing data if action data is falsy", () => {
    const id = 4;
    const data = { test: 456 };
    const action1 = claimDataAction(id, data);
    const state2 = dataReducer(state, action1);
    const action2 = claimDataAction(id, null);
    const result = dataReducer(state2, action2);
    expect(result.claim[id].data).toBe(data);
  });

  test("marks loaded data as Stale on navigation", () => {
    const id = 5;
    const data = { test: 456 };
    const action = claimDataAction(id, data, LoadingStatus.Done);
    const state2 = dataReducer(state, action);
    expect(state2.claim[id].status).toBe(LoadingStatus.Done);

    const result = dataReducer(state2, routeTransition());
    expect(result.claim[id].status).toBe(LoadingStatus.Stale);
  });

  test("marks Failed data as Stale on navigation", () => {
    const id = 6;
    const data = { test: 666 };
    const action = claimDataAction(id, data, LoadingStatus.Failed);
    const state2 = dataReducer(state, action);
    expect(state2.claim[id].status).toBe(LoadingStatus.Failed);

    const result = dataReducer(state2, routeTransition());
    expect(result.claim[id].status).toBe(LoadingStatus.Stale);
  });

  test("preserves loaded data on replace navigation", () => {
    const id = 5;
    const data = { test: 456 };
    const action = claimDataAction(id, data, LoadingStatus.Done);
    const state2 = dataReducer(state, action);
    expect(state2.claim[id].status).toBe(LoadingStatus.Done);

    const result = dataReducer(state2, routeTransition("REPLACE"));
    expect(result.claim[id].status).toBe(LoadingStatus.Done);
  });

  test("status not changed on navigation if not Done / Failed", () => {
    const id = 6;
    const data = { test: 666 };
    const action = claimDataAction(id, data, LoadingStatus.Loading);
    const state2 = dataReducer(state, action);
    expect(state2.claim[id].status).toBe(LoadingStatus.Loading);

    const result = dataReducer(state2, routeTransition());
    expect(result.claim[id].status).toBe(LoadingStatus.Loading);
  });
});
