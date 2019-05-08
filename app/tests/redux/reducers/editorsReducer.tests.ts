import { editorsReducer } from "../../../src/ui/redux/reducers";
import getRootState from "../selectors/getRootState";
import createClaim from "../selectors/createClaim";
import { ClaimDtoValidator } from "../../../src/ui/validators";
import createCostCategory from "../selectors/createCostCategory";
import { AppError } from "../../../src/server/features/common/appError";

const testSubmitError = () => {
  it("should add the editor error to the store", () => {
    const originalState = getRootState();
    const action = {
      type: "EDITOR_SUBMIT_ERROR" as any,
      payload: {
        id: "1",
        store: "claim",
        dto: "test data",
        error: { code: 1, message: "this is an error 1" }
      }
    };
    const newState = editorsReducer("claim")(originalState.editors.claim, action);
    expect(newState).toEqual({
      1: {
        data: "test data",
        error: { code: 1, message: "this is an error 1" },
        validator: undefined
      }
    });
  });
  it("should strip out the original error", () => {
    const originalState = getRootState();
    const action = {
      type: "EDITOR_SUBMIT_ERROR" as any,
      payload: {
        id: "1",
        store: "claim",
        dto: "test data",
        error: { code: 1, message: "this is an error", original: "the original error passed in the context" }
      }
    };
    const newState = editorsReducer("claim")(originalState.editors.claim, action);
    expect(newState[1].error).toBeDefined();
    const err = newState[1].error as AppError;
    expect(err.original).toBeUndefined();
  });
  it("should preserve the editor validation", () => {
    const originalState = getRootState();
    const claimDto = createClaim();
    const validator = new ClaimDtoValidator(claimDto, claimDto.status, [], [createCostCategory()], true);
    originalState.editors.claim = {
      1: {
        data: claimDto,
        error: null,
        validator
      }
    };
    const action = {
      type: "EDITOR_SUBMIT_ERROR" as any,
      payload: {
        id: "1",
        store: "claim",
        dto: "test data",
        error: { code: 1, message: "this is also an error" }
      }
    };
    const newState = editorsReducer("claim")(originalState.editors.claim, action);
    expect(newState).toEqual({
      1: {
        data: "test data",
        error: { code: 1, message: "this is also an error" },
        validator
      }
    });
  });
  it("should delete the errors from other editors in the same store", () => {
    const originalState = getRootState();
    const claimDto = createClaim();
    const validator = new ClaimDtoValidator(claimDto, claimDto.status, [], [createCostCategory()], true);
    originalState.editors.claim = {
      1: {
        data: claimDto,
        error: { code: 1, message: "original error", results: null },
        validator
      }
    };
    const action = {
      type: "EDITOR_SUBMIT_ERROR" as any,
      payload: {
        id: "2",
        store: "claim",
        dto: "test data",
        error: "new error"
      }
    };
    const newState = editorsReducer("claim")(originalState.editors.claim, action);
    expect(newState[1].error).toBeNull();
  });
  it("should delete the errors from other editors in other stores", () => {
    const originalState = getRootState();
    const claimDto = createClaim();
    originalState.editors.claim = {
      1: {
        data: claimDto,
        error: { code: 1, message: "This is an existing error", results: null },
        validator: new ClaimDtoValidator(claimDto, claimDto.status, [], [createCostCategory()], true)
      }
    };
    const action = {
      type: "EDITOR_SUBMIT_ERROR" as any,
      payload: {
        id: "2",
        store: "testStore",
        dto: "test data",
        error: "this is a new error"
      }
    };
    const newState = editorsReducer("claim")(originalState.editors.claim, action);
    expect(newState[1].error).toBeNull();
  });
};
const testSubmitSuccess = () => {
  it("should delete the editor", () => {
    const originalState = getRootState();
    const claimDto = createClaim();
    const validator = new ClaimDtoValidator(claimDto, claimDto.status, [], [createCostCategory()], true);
    originalState.editors.claim = {
      1: {
        data: claimDto,
        error: null,
        validator
      }
    };
    const action = {
      type: "EDITOR_SUBMIT_SUCCESS" as any,
      payload: {
        id: "1",
        store: "claim"
      }
    };
    const newState = editorsReducer("claim")(originalState.editors.claim, action);
    expect(newState[1]).toBeUndefined();
  });
  it("should delete the errors from other editors in the same store", () => {
    const originalState = getRootState();
    const claimDto = createClaim();
    const validator = new ClaimDtoValidator(claimDto, claimDto.status, [], [createCostCategory()], true);
    originalState.editors.claim = {
      1: {
        data: claimDto,
        error: { code: 1, message: "original error", results: null },
        validator
      }
    };
    const action = {
      type: "EDITOR_SUBMIT_SUCCESS" as any,
      payload: {
        id: "2",
        store: "claim"
      }
    };
    const newState = editorsReducer("claim")(originalState.editors.claim, action);
    expect(newState[1].error).toBeNull();
  });
  it("should delete the errors from other editors in other stores", () => {
    const originalState = getRootState();
    const claimDto = createClaim();
    originalState.editors.claim = {
      1: {
        data: claimDto,
        validator: new ClaimDtoValidator(claimDto, claimDto.status, [], [createCostCategory({name: "Materials"})], true),
        error: { code: 1, message: "This is an existing error", results: null }
      }
    };
    const action = {
      type: "EDITOR_SUBMIT_SUCCESS" as any,
      payload: {
        id: "2",
        store: "testStore",
        dto: "test data",
        error: "this is a new error"
      }
    };
    const newState = editorsReducer("claim")(originalState.editors.claim, action);
    expect(newState[1].error).toBeNull();
  });
};
const testEditorUpdate = () => {
  it("should preserve any errors", () => {
    const originalState = getRootState();
    const claimDto = createClaim();
    originalState.editors.claim = {
      1: {
        data: claimDto,
        validator: new ClaimDtoValidator(claimDto, claimDto.status, [], [createCostCategory({name: "Materials"})], true),
        error: { code: 1, message: "keep this error", results: null }
      }
    };
    const action = {
      type: "UPDATE_EDITOR" as any,
      payload: {
        id: "1",
        store: "claim",
        dto: claimDto,
        validator: new ClaimDtoValidator(claimDto, claimDto.status, [], [createCostCategory({name: "Materials"})], true)
      }
    };
    const newState = editorsReducer("claim")(originalState.editors.claim, action);
    expect(newState[1].error).toEqual({ code: 1, message: "keep this error", results: null });
  });
  it("should update the dto", () => {
    const originalState = getRootState();
    const claimDto = createClaim();
    const updatedDto = createClaim({partnerId: "hello world"});
    originalState.editors.claim = {
      1: {
        data: claimDto,
        validator: new ClaimDtoValidator(claimDto, claimDto.status, [], [createCostCategory({name: "Materials"})], true),
        error: null
      }
    };
    const action = {
      type: "UPDATE_EDITOR" as any,
      payload: {
        id: "1",
        store: "claim",
        dto: updatedDto,
        validator: new ClaimDtoValidator(claimDto, claimDto.status, [], [createCostCategory({name: "Materials"})], true)
      }
    };
    const newState = editorsReducer("claim")(originalState.editors.claim, action);
    expect(newState[1].data).toEqual(updatedDto);
  });
};

describe("editorsReducer", () => {
  describe(("submit error"), testSubmitError);
  describe(("submit success"), testSubmitSuccess);
  describe(("editor updated"), testEditorUpdate);
});
