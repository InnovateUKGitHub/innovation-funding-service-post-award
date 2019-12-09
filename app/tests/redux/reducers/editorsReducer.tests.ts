// tslint:disable
import { actionTypes } from "redux-router5";
import { editorsReducer, EditorStatus, IEditorStore } from "@ui/redux/reducers";
import { ClaimDtoValidator } from "@ui/validators";
import { ClaimDto, IAppError, ErrorCode } from "@framework/types";
import createCostCategory from "../stores/createCostCategory";
import getRootState from "../stores/getRootState";
import createClaim from "../stores/createClaim";
import { EditorResetAction, UpdateEditorAction, EditorSubmitAction, EditorSuccessAction, EditorErrorAction } from "@ui/redux/actions/common/editorActions";
import { Results } from "@ui/validation";

const setupInitialState = (update?: (data: IEditorStore<ClaimDto, ClaimDtoValidator>) => void) => {
  const state = getRootState();

  state.editors.claim = {
    1: {
      data: {},
      validator: null,
      error: null,
    }
  } as any;

  if (update) update(state.editors.claim[1]);

  return state;
};

describe("editorsReducer", () => {
  describe("editor updated", () => {
    it("should preserve any errors", () => {
      const error = { code: 1, message: "keep this error", results: null };
      const claimDto = createClaim();
      const originalState = setupInitialState(x => x.error = error);
      const validator = new Results(claimDto, true);

      const action: UpdateEditorAction = {
        type: "EDITOR_UPDATE",
        payload: { id: "1", store: "claim", dto: claimDto, validator }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toEqual(error);
    });

    it("should update the dto", () => {
      const claimDto = createClaim();
      const updatedDto = createClaim({ partnerId: "hello world" });
      const originalState = setupInitialState(x => x.data = claimDto);
      const validator = new Results(updatedDto, true);

      const action: UpdateEditorAction = {
        type: "EDITOR_UPDATE",
        payload: { id: "1", store: "claim", dto: updatedDto, validator }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].data).toEqual(updatedDto);
    });
  });

  describe("editor submit", () => {
    it("should update status to Saving", () => {
      const originalState = setupInitialState(x => x.status = EditorStatus.Editing);
      const dto = createClaim();
      const validator = new Results(dto, true);

      const action: EditorSubmitAction = {
        type: "EDITOR_SUBMIT",
        payload: { id: "1", store: "claim", dto, validator }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].status).toEqual(EditorStatus.Saving);
    });
  });

  describe("submit success", () => {
    it("should update the editor", () => {
      const originalState = setupInitialState(x => x.status = EditorStatus.Saving);

      const action: EditorSuccessAction = {
        type: "EDITOR_SUBMIT_SUCCESS",
        payload: { id: "1", store: "claim" }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].status).toBe(EditorStatus.Editing);
    });

    it("should delete the errors from other editors in the same store", () => {
      const error = { code: 1, message: "original error 1", results: null };
      const originalState = setupInitialState(x => x.error = error);

      const action: EditorSuccessAction = {
        type: "EDITOR_SUBMIT_SUCCESS",
        payload: { id: "2", store: "claim" }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toBeNull();
    });

    it("should delete the errors from other editors in other stores", () => {
      const error = { code: 1, message: "original error 2", results: null };
      const originalState = setupInitialState(x => x.error = error);

      const action: EditorSuccessAction = {
        type: "EDITOR_SUBMIT_SUCCESS",
        payload: { id: "2", store: "testStore" }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toBeNull();
    });
  });

  describe("submit error", () => {
    it("should update status to Editing", () => {
      const originalState = setupInitialState(x => x.status = EditorStatus.Saving);
      const error: IAppError = { code: 1, message: "this is an error 1" };
      const action: EditorErrorAction = {
        type: "EDITOR_SUBMIT_ERROR",
        payload: { id: "1", store: "claim", dto: {}, error }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].status).toEqual(EditorStatus.Editing);
    });

    it("should add the editor error to the store", () => {
      const originalState = setupInitialState();
      const error = { code: 1, message: "this is an error 1" };
      const action: EditorErrorAction = {
        type: "EDITOR_SUBMIT_ERROR",
        payload: { id: "1", store: "claim", dto: "test data", error }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toEqual(error);
    });

    it("should strip out the original error", () => {
      const originalState = setupInitialState();
      const error = { code: 1, message: "this is an error", original: "the original error passed in the context" };
      const action: EditorErrorAction = {
        type: "EDITOR_SUBMIT_ERROR",
        payload: { id: "1", store: "claim", dto: "test data", error }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      const newError = newState[1].error;
      expect(newError).toBeDefined();
      expect(newError).not.toBe(error);
    });

    it("should preserve the editor validation", () => {
      const claimDto = createClaim();
      const validator = new ClaimDtoValidator(claimDto, claimDto.status, [], [createCostCategory()], [], true);
      const originalState = setupInitialState(x => x.validator = validator);

      const action: EditorErrorAction = {
        type: "EDITOR_SUBMIT_ERROR",
        payload: { id: "1", store: "claim", dto: "test data", error: { code: 1, message: "this is also an error" } }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].validator).toEqual(validator);
    });

    it("should delete the errors from other editors in the same store", () => {
      const error = { code: 1, message: "original error", results: null };
      const originalState = setupInitialState(x => x.error = error);

      const action: EditorErrorAction = {
        type: "EDITOR_SUBMIT_ERROR",
        payload: { id: "2", store: "claim", dto: "test data", error: { code: ErrorCode.REQUEST_ERROR, message: "this is a new error" } }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toBeNull();
    });

    it("should delete the errors from other editors in other stores", () => {
      const error = { code: 1, message: "This is an existing error", results: null };
      const originalState = setupInitialState(x => x.error = error);

      const action: EditorErrorAction = {
        type: "EDITOR_SUBMIT_ERROR",
        payload: { id: "2", store: "testStore", dto: "test data", error: { code: ErrorCode.REQUEST_ERROR, message: "this is a new error" } }
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toBeNull();
    });
  });

  describe("editor reset", () => {
    it("should delete editor if reset", () => {
      const originalState = setupInitialState();

      const action: EditorResetAction = {
        type: "EDITOR_RESET",
        payload: { id: "1", store: "claim" }
      };

      expect(originalState.editors.claim["1"]).not.toBeUndefined();
      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState["1"]).toBeUndefined();

    })

    it("should not delete other editors if reset", () => {
      const originalState = setupInitialState();

      const action: EditorResetAction = {
        type: "EDITOR_RESET",
        payload: { id: "2", store: "claim" }
      };

      expect(originalState.editors.claim["1"]).not.toBeUndefined();
      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState["1"]).not.toBeUndefined();

    });
  });

  describe("Transition sucess", () => {
    it("should empty all editors when navigating", () => {
      const originalState = setupInitialState();
      const action = {
        type: actionTypes.TRANSITION_SUCCESS,
        payload: { previousRoute: true }
      } as any;

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState).toEqual({});
    });

    test("preserves editor on replace navigation", () => {
      const originalState = setupInitialState();
      const action = {
        type: actionTypes.TRANSITION_SUCCESS,
        payload: {
          previousRoute: true,
          route: {
            meta: {
              options: {
                replace: true
              }
            }
          }
        }
      } as any;

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState).toEqual(originalState.editors.claim);
    });
  });
});
