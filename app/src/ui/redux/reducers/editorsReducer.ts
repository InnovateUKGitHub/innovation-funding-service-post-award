import { combineReducers } from "redux";
import { RootActions } from "../actions";
import { ClaimDto, ClaimLineItemDto, ForecastDetailsDTO } from "../../models";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { ClaimLineItemDtosValidator } from "../../validators/claimLineItemDtosValidator";
import { Results } from "../../validation/results";
import { ForecastDetailsDtosValidator } from "../../validators/forecastDetailsDtosValidator";

export interface IEditorStore<TDto, TValidator> {
    data: TDto;
    validator: TValidator;
    error: any;
}

const editorsReducer = <TDto extends {}, TValidator extends Results<TDto>> (store: string) => (state: { [key: string]: IEditorStore<TDto, TValidator> } = {}, action: RootActions) => {
    if (action.type === "VALIDATE" && action.payload.store === store) {
        const payload: IEditorStore<TDto, TValidator> = {
            data: action.payload.dto as TDto,
            validator: action.payload.validator as TValidator,
            error: action.payload.error
        };
        const result = Object.assign({}, state);
        result[action.payload.id] = payload;

        return result;
    }
    else if (action.type === "@@router5/TRANSITION_START" && action.payload.previousRoute) {
        return {};
    }
    else {
        return state;
    }
};

export const editorReducer = combineReducers({
    claim: editorsReducer<ClaimDto, ClaimDtoValidator>("claim"),
    claimLineItems: editorsReducer<ClaimLineItemDto[], ClaimLineItemDtosValidator>("claimLineItems"),
    forecastDetails: editorsReducer<ForecastDetailsDTO[], ForecastDetailsDtosValidator>("forecastDetails"),
});
