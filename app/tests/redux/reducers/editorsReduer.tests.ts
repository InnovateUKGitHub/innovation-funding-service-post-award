import { editorsReducer } from "../../../src/ui/redux/reducers";
import getRootState from "../selectors/getRootState";
import createClaim from "../selectors/createClaim";
import { ClaimDtoValidator } from "../../../src/ui/validators";

describe("editors reducer", () => {
  describe(("EDITOR_SUBMIT_ERROR"), () => {
    it("should add the editor error to the store", () => {
      const originalState = getRootState();
      const action = {
        type: "EDITOR_SUBMIT_ERROR" as "EDITOR_SUBMIT_ERROR",
        payload: {
          id: "1",
          store: "claim",
          dto: "test data",
          error: "this is an error"
        }
      };
      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState).toEqual({
        1: {
          data: "test data",
          error: "this is an error",
          validator: undefined
        }
      });
    });
    it("should preserve the editor validation", () => {
      const originalState = getRootState();
      const claimDto = createClaim();
      const validator = new ClaimDtoValidator(claimDto, [], ["Labour"], true);
      originalState.editors.claim = {
       1: {
         data: claimDto,
         error: null,
         validator
       }
      };
      const action = {
        type: "EDITOR_SUBMIT_ERROR" as "EDITOR_SUBMIT_ERROR",
        payload: {
          id: "1",
          store: "claim",
          dto: "test data",
          error: "this is also an error"
        }
      };
      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState).toEqual({
        1: {
          data: "test data",
          error: "this is also an error",
          validator
        }
      });
    });
    it("should delete the errors from other editors in the same store", () => {
      const originalState = getRootState();
      const claimDto = createClaim();
      const validator = new ClaimDtoValidator(claimDto, [], ["Labour"], true);
      originalState.editors.claim = {
       1: {
         data: claimDto,
         error: "original error",
         validator
       }
      };
      const action = {
        type: "EDITOR_SUBMIT_ERROR" as "EDITOR_SUBMIT_ERROR",
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
          error: "This is an existing error",
          validator: new ClaimDtoValidator(claimDto, [], ["Labour"], true)
        }
      };
      const action = {
        type: "EDITOR_SUBMIT_ERROR" as "EDITOR_SUBMIT_ERROR",
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
  });
  describe(("EDITOR_SUBMIT_SUCCESS"), () => {
    it("should delete the editor", () => {
      const originalState = getRootState();
      const claimDto = createClaim();
      const validator = new ClaimDtoValidator(claimDto, [], ["Labour"], true);
      originalState.editors.claim = {
        1: {
          data: claimDto,
          error: null,
          validator
        }
      };
      const action = {
        type: "EDITOR_SUBMIT_SUCCESS" as "EDITOR_SUBMIT_SUCCESS",
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
      const validator = new ClaimDtoValidator(claimDto, [], ["Labour"], true);
      originalState.editors.claim = {
        1: {
          data: claimDto,
          error: "original error",
          validator
        }
      };
      const action = {
        type: "EDITOR_SUBMIT_SUCCESS" as "EDITOR_SUBMIT_SUCCESS",
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
          validator: new ClaimDtoValidator(claimDto, [], ["Materials"], true),
          error: "This is an existing error"
        }
      };
      const action = {
        type: "EDITOR_SUBMIT_SUCCESS" as "EDITOR_SUBMIT_SUCCESS",
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
  });
  describe(("UPDATE_EDITOR"), () => {
    it("should preserve any errors", () => {
      const originalState = getRootState();
      const claimDto = createClaim();
      originalState.editors.claim = {
        1: {
          data: claimDto,
          validator: new ClaimDtoValidator(claimDto, [], ["Materials"], true),
          error: "keep this error"
        }
      };
      const action = {
        type: "UPDATE_EDITOR" as "UPDATE_EDITOR",
        payload: {
          id: "1",
          store: "claim",
          dto: claimDto,
          validator: new ClaimDtoValidator(claimDto, [], ["Materials"], true)
        }
      };
      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].error).toBe("keep this error");
    });
    it("should update the dto", () => {
      const originalState = getRootState();
      const claimDto = createClaim();
      const updatedDto = createClaim({partnerId: "hello world"});
      originalState.editors.claim = {
        1: {
          data: claimDto,
          validator: new ClaimDtoValidator(claimDto, [], ["Materials"], true),
          error: null
        }
      };
      const action = {
        type: "UPDATE_EDITOR" as "UPDATE_EDITOR",
        payload: {
          id: "1",
          store: "claim",
          dto: updatedDto,
          validator: new ClaimDtoValidator(claimDto, [], ["Materials"], true)
        }
      };
      const newState = editorsReducer("claim")(originalState.editors.claim, action);
      expect(newState[1].data).toEqual(updatedDto);
    });
  });
});
