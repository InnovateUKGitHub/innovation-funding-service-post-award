// tslint:disable:no-identical-functions
import { actionTypes } from "redux-router5";
import { editorsReducer, EditorStatus, IEditorStore } from "@ui/redux/reducers";
import { ClaimDtoValidator } from "@ui/validators";
import { ClaimDto } from "@framework/types";
import createCostCategory from "../selectors/createCostCategory";
import getRootState from "../selectors/getRootState";
import createClaim from "../selectors/createClaim";

const setupInitialState = (update?: (data: IEditorStore<ClaimDto, ClaimDtoValidator>) => void) => {
  const state = getRootState();

  state.editors.claim = {
    1: {
      data: {},
      validator: null,
      error: null
    }
  } as any;

  if(update) update(state.editors.claim[1]);

  return state;
};

describe("editorsReducer", () => {
  describe("editor updated", () => {
    it("should preserve any errors", () => {
      const error = { code: 1, message: "keep this error", results: null };
      const claimDto = createClaim();
      const originalState = setupInitialState(x => x.error = error);

      const action = {
        type: "EDITOR_UPDATE",
        payload: { id: "1", store: "claim", dto: claimDto }
      } as any;

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toEqual(error);
    });

    it("should update the dto", () => {
      const claimDto = createClaim();
      const updatedDto = createClaim({partnerId: "hello world"});
      const originalState = setupInitialState(x => x.data = claimDto);

      const action = {
        type: "EDITOR_UPDATE" as any,
        payload: { id: "1", store: "claim", dto: updatedDto }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].data).toEqual(updatedDto);
    });
  });

  describe("editor submit", () => {
    it("should update status to Saving", () => {
      const originalState = setupInitialState(x => x.status = null!);
      const action = {
        type: "EDITOR_SUBMIT",
        payload: { id: "1", store: "claim" }
      } as any;

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].status).toEqual(EditorStatus.Saving);
    });
  });

  describe("submit success", () => {
    it("should delete the editor", () => {
      const originalState = setupInitialState();

      const action = {
        type: "EDITOR_SUBMIT_SUCCESS",
        payload: { id: "1", store: "claim" }
      } as any;

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1]).toBeUndefined();
    });

    it("should delete the errors from other editors in the same store", () => {
      const error = { code: 1, message: "original error 1", results: null };
      const originalState = setupInitialState(x => x.error = error);

      const action = {
        type: "EDITOR_SUBMIT_SUCCESS" as any,
        payload: { id: "2", store: "claim" }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toBeNull();
    });

    it("should delete the errors from other editors in other stores", () => {
      const error = { code: 1, message: "original error 2", results: null };
      const originalState = setupInitialState(x => x.error = error);

      const action = {
        type: "EDITOR_SUBMIT_SUCCESS" as any,
        payload: { id: "2", store: "testStore", dto: "test data", error: "this is a new error" }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toBeNull();
    });
  });

  describe("submit error", () => {
    it("should update status to Editing", () => {
      const originalState = setupInitialState(x => x.status = EditorStatus.Saving);
      const error = { code: 1, message: "this is an error 1" };
      const action = {
        type: "EDITOR_SUBMIT_ERROR",
        payload: { id: "1", store: "claim", error }
      } as any;

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].status).toEqual(EditorStatus.Editing);
    });

    it("should add the editor error to the store", () => {
      const originalState = setupInitialState();
      const error = { code: 1, message: "this is an error 1" };
      const action = {
        type: "EDITOR_SUBMIT_ERROR",
        payload: { id: "1", store: "claim", dto: "test data", error }
      } as any;

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toEqual(error);
    });

    it("should strip out the original error", () => {
      const originalState = setupInitialState();
      const error = { code: 1, message: "this is an error", original: "the original error passed in the context" };
      const action = {
        type: "EDITOR_SUBMIT_ERROR" as any,
        payload: { id: "1", store: "claim", dto: "test data", error }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      const newError = newState[1].error;
      expect(newError).toBeDefined();
      expect(newError).not.toBe(error);
    });

    it("should preserve the editor validation", () => {
      const claimDto = createClaim();
      const validator = new ClaimDtoValidator(claimDto, claimDto.status, [], [createCostCategory()], true);
      const originalState = setupInitialState(x => x.validator = validator);

      const action = {
        type: "EDITOR_SUBMIT_ERROR",
        payload: { id: "1", store: "claim", dto: "test data", error: { code: 1, message: "this is also an error" }}
      } as any;

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].validator).toEqual(validator);
    });

    it("should delete the errors from other editors in the same store", () => {
      const error = { code: 1, message: "original error", results: null };
      const originalState = setupInitialState(x => x.error = error);

      const action = {
        type: "EDITOR_SUBMIT_ERROR" as any,
        payload: { id: "2", store: "claim", dto: "test data", error: "new error" }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toBeNull();
    });

    it("should delete the errors from other editors in other stores", () => {
      const error = { code: 1, message: "This is an existing error", results: null };
      const originalState = setupInitialState(x => x.error = error);

      const action = {
        type: "EDITOR_SUBMIT_ERROR" as any,
        payload: { id: "2", store: "testStore", dto: "test data", error: "this is a new error" }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toBeNull();
    });
  });

  describe("Transition start", () => {
    it("should empty all editors when navigating", () => {
      const originalState = setupInitialState();
      const action = {
        type: actionTypes.TRANSITION_START,
        payload: { previousRoute: true }
      } as any;

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState).toEqual({});
    });
  });
});
