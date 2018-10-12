import { ClaimDto } from "../../models";
import { DataState, DataStateKeys, EditorState, EditorStateKeys, IDataStore, RootState } from "../reducers";
import { IDataSelector } from "./IDataSelector";
import { LoadingStatus, Pending } from "../../../shared/pending";
import { IEditorStore } from "../reducers/editorsReducer";
import { Results } from "../../validation/results";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { findClaimDetailsSummaryByPartnerAndPeriod } from "./claimDetailsSummary";
import { getCostCategories } from "./costCategories";
import { getKey } from "../../../util/key";
import { getDataStoreItem, dataStoreHelper } from "./data";

const claimStore = "claim";

export const getClaim = (partnerId: string, periodId: number) => dataStoreHelper(claimStore, getKey(partnerId, periodId)) as IDataSelector<ClaimDto>; 

export const getClaimEditor = (partnerId: string, periodId: number) => editorStoreHelper<ClaimDto, ClaimDtoValidator>(
  claimStore,
  x => x.claim,
  (store) => createEditorDto(partnerId, periodId, store),
  (claim, store) => createValidator(partnerId, periodId, claim, store),
  `${partnerId}_${periodId}`
);

const createEditorDto = (partnerId: string, periodId: number, store: RootState) => {
  return getClaim(partnerId, periodId).getPending(store);
};

const createValidator = (partnerId: string, periodId: number, claim: ClaimDto, store: RootState) => {
  let details = findClaimDetailsSummaryByPartnerAndPeriod(partnerId, periodId).getPending(store).data || [];
  let costCategories = getCostCategories().getPending(store).data || [];
  return new ClaimDtoValidator(claim, details, costCategories, false);
};

interface IEditorSelector<T, TVal extends Results<T>> {
  store: EditorStateKeys;
  key: string;
  get: (store: RootState, initalise?: (dto: T) => void) => Pending<IEditorStore<T, TVal>>;
}

const editorStoreHelper = <T extends {}, TVal extends Results<T>>(storeKey: EditorStateKeys, getEditorStore: (state: EditorState) => { [key: string]: IEditorStore<T, TVal> }, getData: (store: RootState) => Pending<T>, getValidator: (dto: T, store: RootState) => TVal, key: string): IEditorSelector<T, TVal> => {
  return {
    store: storeKey,
    key,
    get: (store: RootState, initalise?: (dto: T) => void) => {
      const editor = getEditorStore(store.editors)[key];

      return editor ? new Pending(LoadingStatus.Done, editor) : getNewEditor(getData, getValidator, store, initalise);
    }
  };
};

const getNewEditor = <T extends {}, TVal extends Results<T>>(getData: (store: RootState) => Pending<T>, getValidator: (dto: T, store: RootState) => TVal, store: RootState, initalise?: (dto: T) => void): Pending<IEditorStore<T, TVal>> => {
  //wrap thie inialise as might be undefined
  const innerInit = (dto: T) => {
    if (!!initalise) {
      initalise(dto);
    }
    return dto;
  };

  return getData(store)
    .then(newData => Object.assign({}, newData!) as T)
    .then(clonedData => innerInit(clonedData!))
    .then(cloned => ({
      data: cloned!,
      validator: getValidator(cloned!, store),
      error: null
    }));
}

