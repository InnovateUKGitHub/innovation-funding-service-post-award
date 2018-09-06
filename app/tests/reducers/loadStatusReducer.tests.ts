import { DataLoadAction } from "../../src/redux/actions/dataLoad";
import { DataStoreStatus } from "../../src/redux/reducers";
import { loadStatusReducer } from "../../src/redux/reducers/loadStatusReducer";

const createLoadDataAction = (status: DataStoreStatus): DataLoadAction => {
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
        let action = createLoadDataAction("PRELOAD");
        let result = loadStatusReducer(1, action);
        expect(result).toBe(1);
    });
    it("when loading result should increment", () =>{
        let action = createLoadDataAction("LOADING");
        let result = loadStatusReducer(1, action);
        expect(result).toBe(2);
    });
    it("when stale result should remain", () =>{
        let action = createLoadDataAction("STALE");
        let result = loadStatusReducer(1, action);
        expect(result).toBe(1);
    });
    it("when loaded result should decriment", () =>{
        let action = createLoadDataAction("LOADED");
        let result = loadStatusReducer(1, action);
        expect(result).toBe(0);
    });
    it("when error result should decriment", () =>{
        let action = createLoadDataAction("ERROR");
        let result = loadStatusReducer(1, action);
        expect(result).toBe(0);
    });
    it("when loading and result is less than zero result should be 1", () =>{
        let action = createLoadDataAction("LOADING");
        let result = loadStatusReducer(0, action);
        expect(result).toBe(1);
    });
    it("when loaded and already zero result should be zero", () =>{
        let action = createLoadDataAction("LOADED");
        let result = loadStatusReducer(0, action);
        expect(result).toBe(0);
    });
    it("when error and already zero result should be zero", () =>{
        let action = createLoadDataAction("ERROR");
        let result = loadStatusReducer(0, action);
        expect(result).toBe(0);
    });
});