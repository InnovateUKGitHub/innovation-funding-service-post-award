import { combineReducers } from "redux";
import { RootActions } from "../actions";
import { ClaimDto } from "../../models";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";

export interface IEditorStore<TDto, TValidator> {
    data: TDto;
    validator: TValidator;
    error: any;
}

const claimEditorReducer = (state: { [key: string]: IEditorStore<ClaimDto, ClaimDtoValidator> } = {}, action: RootActions) => {
        if(action.type === "VALIDATE") {
            console.log("Validation", action);
            const payload: IEditorStore<ClaimDto, ClaimDtoValidator> = {
                data: action.payload.dto,
                validator: action.payload.validator,
                error: action.payload.error
            };
            const result = Object.assign({}, state);
            result[action.payload.id] = payload;
            console.log("Validation updated", result);

            return result;
        }
        else if(action.type === "@@router5/TRANSITION_START" && action.payload.previousRoute) {
            return {};
        }
        else {
            return state;
        }
    };

export const editorReducer = combineReducers({
    claim: claimEditorReducer
});
