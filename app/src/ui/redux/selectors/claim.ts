import { ClaimDto } from "../../models";
import { IDataStore, RootState, DataState, DataStateKeys, EditorState, EditorStateKeys } from "../reducers";
import { getData } from "./data";
import { IDataSelector } from "./IDataSelector";
import { Pending, LoadingStatus } from "../../../shared/pending";
import { IEditorStore } from "../reducers/editorsReducer";
import { Results } from "../../validation/results";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { findClaimDetailsSummaryByPartnerAndPeriod } from "./claimDetailsSummary"
import { getCostCategories } from "./costCategories";
// const claimStore = "claim";

// const getClaims = (state: RootState): { [key: string]: IDataStore<ClaimDto> } => (getData(state)[claimStore] || {});

// // selectors
// export const getClaim = (partnerId: string, periodId: number): IDataSelector<ClaimDto> => {
//   const key = `${partnerId}_${periodId}`;
//   const get = (state: RootState) => getClaims(state)[key];
//   return { key, get, getPending: (state: RootState) => (Pending.create(get(state))) };
// };

// potential next step for common selectors for data.... up for discussion
export const getClaim = (partnerId: string, periodId: number) => dataStoreHelper("claim", x => x.claim, `${partnerId}_${periodId}`);

export const editClaim = (partnerId: string, periodId: number) => editorStoreHelper<ClaimDto, ClaimDtoValidator>(
  "claim",
  x => x.claim,
  (store) => createEditorDto(partnerId, periodId, store),
  (claim, store) => createValidator(partnerId, periodId, claim, store),
  `${partnerId}_${periodId}`
)

const createEditorDto = (partnerId: string, periodId: number, store: RootState) => {
  return getClaim(partnerId, periodId).getPending(store);
};

const createValidator = (partnerId: string, periodId: number, claim: ClaimDto, store: RootState) => {
  const pendingDetails = findClaimDetailsSummaryByPartnerAndPeriod(partnerId, periodId).getPending(store);
  const pendingCostCategories = getCostCategories().getPending(store);
  return pendingDetails.and(pendingCostCategories, (details, costCategories) => ({ details, costCategories }))
    .then(data => new ClaimDtoValidator(claim, data!.details, data!.costCategories, false));
};

const dataStoreHelper = <T extends {}>(store: DataStateKeys, getDataStore: (state: DataState) => { [key: string]: IDataStore<T> }, key: string): IDataSelector<T> => {
  return {
    store: store,
    key: key,
    get: (store: RootState) => getDataStore(store.data)[key],
    getPending: (store: RootState) => Pending.create(getDataStore(store.data)[key]),
  };
}

interface IEditorSelector<T, TVal extends Results<T>> {
  store: EditorStateKeys,
  key: string,
  get: (store: RootState, initalise?: (dto: T) => void) => Pending<IEditorStore<T, TVal>>
}

const editorStoreHelper = <T extends {}, TVal extends Results<T>>(store: EditorStateKeys, getEditorStore: (state: EditorState) => { [key: string]: IEditorStore<T, TVal> }, getData: (store: RootState) => Pending<T>, getValidator: (dto: T, store: RootState) => Pending<TVal>, key: string): IEditorSelector<T, TVal> => {
  return {
    store,
    key,
    get: (store: RootState, initalise?: (dto: T) => void) => {
      const editor = getEditorStore(store.editors)[key];
      
      if (editor) {
        return new Pending(LoadingStatus.Done, editor);
      }

      const pendingDto = getData(store).then(newData => {
        const clonedData = Object.assign({}, newData) as T;
        initalise && initalise(clonedData);
        return clonedData;
      });

      // if the pendingdto has loaded or is stale or is loading but already has data (was stale) we can create an editor and validator
      // if not use a pending in the preload status
      const hasData = pendingDto.state === LoadingStatus.Done || pendingDto.state === LoadingStatus.Stale || (pendingDto.state === LoadingStatus.Loading && !!pendingDto.data);
      const pendingValidation = hasData ? getValidator(pendingDto.data!, store) : new Pending<TVal>();

      return Pending.combine(pendingDto, pendingValidation, (data, validator) => ({ data, validator, error: null}));
    }
  }
}
