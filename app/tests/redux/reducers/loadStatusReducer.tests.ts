// tslint:disable:no-identical-functions no-duplicate-string
import { DataLoadAction } from "../../../src/ui/redux/actions/common";
import { loadStatusReducer } from "../../../src/ui/redux/reducers/loadStatusReducer";
import { LoadingStatus } from "../../../src/shared/pending";

const createLoadDataAction = (status: LoadingStatus): DataLoadAction => {
    return {
        type: "DATA_LOAD",
        payload: {
            id: "Example",
            store: "Example",
            data: {},
            error: null,
            status
        }
    };
};

describe("loadStatusReducer", () => {
    it("when preload result should remain same", () => {
        const action = createLoadDataAction(LoadingStatus.Preload);
        const result = loadStatusReducer(1, action);
        expect(result).toBe(1);
    });
    it("when loading result should increment", () => {
        const action = createLoadDataAction(LoadingStatus.Loading);
        const result = loadStatusReducer(1, action);
        expect(result).toBe(2);
    });
    it("when stale result should remain", () => {
        const action = createLoadDataAction(LoadingStatus.Stale);
        const result = loadStatusReducer(1, action);
        expect(result).toBe(1);
    });
    it("when loaded result should decriment", () => {
        const action = createLoadDataAction(LoadingStatus.Done);
        const result = loadStatusReducer(1, action);
        expect(result).toBe(0);
    });
    it("when error result should decriment", () => {
        const action = createLoadDataAction(LoadingStatus.Failed);
        const result = loadStatusReducer(1, action);
        expect(result).toBe(0);
    });
    it("when loading and result is less than zero result should be 1", () => {
        const action = createLoadDataAction(LoadingStatus.Loading);
        const result = loadStatusReducer(-1, action);
        expect(result).toBe(1);
    });
    it("when loaded and already zero result should be zero", () => {
        const action = createLoadDataAction(LoadingStatus.Done);
        const result = loadStatusReducer(0, action);
        expect(result).toBe(0);
    });
    it("when error and already zero result should be zero", () => {
        const action = createLoadDataAction(LoadingStatus.Failed);
        const result = loadStatusReducer(0, action);
        expect(result).toBe(0);
    });
});
