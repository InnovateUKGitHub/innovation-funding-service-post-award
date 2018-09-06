import { DataLoadAction } from "../../src/redux/actions/dataLoad";
import { loadStatusReducer } from "../../src/redux/reducers/loadStatusReducer";
import { LoadingStatus } from "../../src/shared/pending";

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
    it("when preload result should remain same", () =>{
        let action = createLoadDataAction(LoadingStatus.Preload);
        let result = loadStatusReducer(1, action);
        expect(result).toBe(1);
    });
    it("when loading result should increment", () =>{
        let action = createLoadDataAction(LoadingStatus.Loading);
        let result = loadStatusReducer(1, action);
        expect(result).toBe(2);
    });
    it("when stale result should remain", () =>{
        let action = createLoadDataAction(LoadingStatus.Stale);
        let result = loadStatusReducer(1, action);
        expect(result).toBe(1);
    });
    it("when loaded result should decriment", () =>{
        let action = createLoadDataAction(LoadingStatus.Done);
        let result = loadStatusReducer(1, action);
        expect(result).toBe(0);
    });
    it("when error result should decriment", () =>{
        let action = createLoadDataAction(LoadingStatus.Failed);
        let result = loadStatusReducer(1, action);
        expect(result).toBe(0);
    });
    it("when loading and result is less than zero result should be 1", () =>{
        let action = createLoadDataAction(LoadingStatus.Loading);
        let result = loadStatusReducer(-1, action);
        expect(result).toBe(1);
    });
    it("when loaded and already zero result should be zero", () =>{
        let action = createLoadDataAction(LoadingStatus.Done);
        let result = loadStatusReducer(0, action);
        expect(result).toBe(0);
    });
    it("when error and already zero result should be zero", () =>{
        let action = createLoadDataAction(LoadingStatus.Failed);
        let result = loadStatusReducer(0, action);
        expect(result).toBe(0);
    });
});