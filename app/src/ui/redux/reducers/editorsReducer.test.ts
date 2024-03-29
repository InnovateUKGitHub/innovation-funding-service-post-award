import { ErrorCode } from "@framework/constants/enums";
import { ClaimDto } from "@framework/dtos/claimDto";
import { IAppError } from "@framework/types/IAppError";
import { createPartnerDto } from "@framework/util/stubDtos";
import { EditorStatus } from "@ui/redux/constants/enums";
import {
  EditorErrorAction,
  EditorResetAction,
  EditorSubmitAction,
  EditorSuccessAction,
  UpdateEditorAction,
} from "@ui/redux/actions/common/editorActions";
import { Results } from "@ui/validation/results";
import { ClaimDtoValidator } from "@ui/validation/validators/claimDtoValidator";
import { routeTransition } from "../actions/common/transitionActions";
import createClaim from "../stores/createClaim";
import getRootState from "../stores/getRootState";
import { editorsReducer, IEditorStore } from "./editorsReducer";

const setupInitialState = (update?: (data: IEditorStore<ClaimDto, ClaimDtoValidator>) => void) => {
  const state = getRootState();

  state.editors.claim = {
    1: {
      data: {} as ClaimDto,
      validator: {} as ClaimDtoValidator,
      error: null,
    },
  };

  if (update) update(state.editors.claim[1]);

  return state;
};

describe("editorsReducer", () => {
  describe("editor updated", () => {
    it("should preserve any errors", () => {
      const error = { code: 1, message: "keep this error", results: null, details: [] };
      const claimDto = createClaim();
      const originalState = setupInitialState(x => (x.error = error));
      const validator = new Results({ model: claimDto, showValidationErrors: true });

      const action: UpdateEditorAction = {
        type: "EDITOR_UPDATE",
        payload: { id: "1", store: "claim", dto: claimDto, validator },
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toEqual(error);
    });

    it("should update the dto", () => {
      const claimDto = createClaim();
      const updatedDto = createClaim({ partnerId: "hello world" as PartnerId });
      const originalState = setupInitialState(x => (x.data = claimDto));
      const validator = new Results({ model: updatedDto, showValidationErrors: true });

      const action: UpdateEditorAction = {
        type: "EDITOR_UPDATE",
        payload: { id: "1", store: "claim", dto: updatedDto, validator },
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].data).toEqual(updatedDto);
    });
  });

  describe("editor submit", () => {
    it("should update status to Saving", () => {
      const originalState = setupInitialState(x => (x.status = EditorStatus.Editing));
      const dto = createClaim();
      const validator = new Results({ model: dto, showValidationErrors: true });

      const action: EditorSubmitAction = {
        type: "EDITOR_SUBMIT",
        payload: { id: "1", store: "claim", dto, validator },
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].status).toEqual(EditorStatus.Saving);
    });
  });

  describe("submit success", () => {
    it("should update the editor", () => {
      const originalState = setupInitialState(x => (x.status = EditorStatus.Saving));

      const action: EditorSuccessAction = {
        type: "EDITOR_SUBMIT_SUCCESS",
        payload: { id: "1", store: "claim" },
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].status).toBe(EditorStatus.Editing);
    });

    it("should delete the errors from other editors in the same store", () => {
      const error = { code: 1, message: "original error 1", results: null, details: [] };
      const originalState = setupInitialState(x => (x.error = error));

      const action: EditorSuccessAction = {
        type: "EDITOR_SUBMIT_SUCCESS",
        payload: { id: "2", store: "claim" },
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toBeNull();
    });

    it("should delete the errors from other editors in other stores", () => {
      const error = { code: 1, message: "original error 2", results: null, details: [] };
      const originalState = setupInitialState(x => (x.error = error));

      const action: EditorSuccessAction = {
        type: "EDITOR_SUBMIT_SUCCESS",
        payload: { id: "2", store: "testStore" },
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toBeNull();
    });

    it("should reset showValidationErrors to false so that multi-form views can start pristine", () => {
      const originalState = setupInitialState(x => {
        x.status = EditorStatus.Saving;
        x.validator = { showValidationErrors: true } as ClaimDtoValidator;
      });

      const action: EditorSuccessAction = {
        type: "EDITOR_SUBMIT_SUCCESS",
        payload: { id: "1", store: "claim" },
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].validator.showValidationErrors).toBe(false);
    });
  });

  describe("submit error", () => {
    it("should update status to Editing", () => {
      const originalState = setupInitialState(x => (x.status = EditorStatus.Saving));
      const error: IAppError = { code: 1, message: "this is an error 1", details: [] };
      const action: EditorErrorAction = {
        type: "EDITOR_SUBMIT_ERROR",
        payload: { id: "1", store: "claim", dto: {}, error },
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].status).toEqual(EditorStatus.Editing);
    });

    it("should add the editor error to the store", () => {
      const originalState = setupInitialState();
      const error = { code: 1, message: "this is an error 1", details: [] };
      const action: EditorErrorAction = {
        type: "EDITOR_SUBMIT_ERROR",
        payload: { id: "1", store: "claim", dto: "test data", error },
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toEqual(error);
    });

    it("should strip out the original error", () => {
      const originalState = setupInitialState();
      const error = {
        code: 1,
        message: "this is an error",
        original: "the original error passed in the context",
        details: [],
      };
      const action: EditorErrorAction = {
        type: "EDITOR_SUBMIT_ERROR",
        payload: { id: "1", store: "claim", dto: "test data", error },
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      const newError = newState[1].error;
      expect(newError).toBeDefined();
      expect(newError).not.toBe(error);
    });

    it("should preserve the editor validation", () => {
      const claimDto = createClaim();
      const partner = createPartnerDto();
      const validator = new ClaimDtoValidator(claimDto, claimDto.status, [], [], true, partner.competitionType);
      const originalState = setupInitialState(x => (x.validator = validator));

      const action: EditorErrorAction = {
        type: "EDITOR_SUBMIT_ERROR",
        payload: {
          id: "1",
          store: "claim",
          dto: "test data",
          error: { code: 1, message: "this is also an error", details: [] },
        },
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].validator).toEqual(validator);
    });

    it("should delete the errors from other editors in the same store", () => {
      const error = { code: 1, message: "original error", results: null, details: [] };
      const originalState = setupInitialState(x => (x.error = error));

      const action: EditorErrorAction = {
        type: "EDITOR_SUBMIT_ERROR",
        payload: {
          id: "2",
          store: "claim",
          dto: "test data",
          error: { code: ErrorCode.REQUEST_ERROR, message: "this is a new error", details: [] },
        },
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toBeNull();
    });

    it("should delete the errors from other editors in other stores", () => {
      const error = { code: 1, message: "This is an existing error", results: null, details: [] };
      const originalState = setupInitialState(x => (x.error = error));

      const action: EditorErrorAction = {
        type: "EDITOR_SUBMIT_ERROR",
        payload: {
          id: "2",
          store: "testStore",
          dto: "test data",
          error: { code: ErrorCode.REQUEST_ERROR, message: "this is a new error", details: [] },
        },
      };

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toBeNull();
    });
  });

  describe("editor reset", () => {
    it("should reset editor to initial state if reset", () => {
      // Start off with an editor with an id and validator that should be destroyed.
      const originalState = setupInitialState(x => {
        x.data.id = "initial";
        x.validator.isValid = true;
      });

      // Just make sure our original state has been created
      expect(originalState.editors.claim[1]).not.toBeUndefined();

      // Send off an editor reset call - It should go back to "after".
      const action: EditorResetAction = {
        type: "EDITOR_RESET",
        payload: { id: "1", store: "claim", dto: { id: "after" }, validator: {} as Results<ResultBase> },
      };

      // Send off the call
      const newState = editorsReducer("claim")(originalState.editors.claim, action);

      // Make sure our state now has the reset Dto
      expect(newState[1]).toEqual({
        data: {
          id: "after",
        },
        error: null,
        status: 1,
        validator: {},
      });
    });

    it("should not delete other editors if reset", () => {
      const originalState = setupInitialState(x => {
        x.data.id = "before";
      });

      const action: EditorResetAction = {
        type: "EDITOR_RESET",
        payload: { id: "2", store: "claim", dto: { id: "after" }, validator: {} as Results<ResultBase> },
      };

      expect(originalState.editors.claim["1"]).not.toBeUndefined();
      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState["1"]).not.toBeUndefined();
    });
  });

  describe("Transition success", () => {
    it("should empty all editors when navigating", () => {
      const originalState = setupInitialState();
      const action = routeTransition();

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState).toEqual({});
    });

    test("preserves editor on replace navigation", () => {
      const originalState = setupInitialState();
      const action = routeTransition("REPLACE");

      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState).toEqual(originalState.editors.claim);
    });
  });
});
