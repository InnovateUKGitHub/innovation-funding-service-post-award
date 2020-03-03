import { LoadingStatus, Pending } from "@shared/pending";
import { DataState, DataStateKeys, EditorState, EditorStateKeys, EditorStatus, IDataStore, IEditorStore, RootState } from "../reducers";
import { IClientUser, ILinkInfo } from "@framework/types";
import { DataLoadAction, dataLoadAction, EditorErrorAction, EditorSubmitAction, EditorSuccessAction, handleEditorError, handleEditorSubmit, handleEditorSuccess, navigateTo, resetEditor, RootActions, RootActionsOrThunk, UpdateEditorAction, updateEditorAction } from "../actions";
import { scrollToTheTopSmoothly } from "@framework/util";
import { processDto } from "@shared/processResponse";
import { AnyAction } from "redux";

type InferDataStore<T> = T extends IDataStore<infer U> ? U : never;
export type InferEditorStoreDto<T> = T extends IEditorStore<infer U, infer V> ? U : never;
export type InferEditorStoreValidator<T> = T extends IEditorStore<infer U, infer V> ? V : never;

const statesToReload = [
  LoadingStatus.Preload,
  LoadingStatus.Stale,
];

const conditionalLoad = <T extends DataStateKeys, K extends string, TDto extends InferDataStore<DataState[T][K]>>(store: T, key: K, load: (params: { user: IClientUser }) => Promise<TDto>) => {
  // dispatch a thunk to get latest store...
  return (dispatch: (action: DataLoadAction) => void, getState: () => RootState) => {
    const existing = getState().data[store][key];
    if (!existing || statesToReload.indexOf(existing.status) !== -1) {
      dispatch(dataLoadAction(key, store, LoadingStatus.Loading, existing && existing.data));

      load({ user: getState().user })
        .then((result) => dispatch(dataLoadAction(key, store, LoadingStatus.Done, result)))
        .catch(err => dispatch(dataLoadAction(key, store, LoadingStatus.Failed, null, err)));
    }
  };
};

const conditionalSave = <T extends EditorStateKeys, K extends string, TDto extends InferEditorStoreDto<EditorState[T][K]>, TVal extends InferEditorStoreValidator<EditorState[T][K]>, TResult>(saving: boolean, store: T, key: K, dto: TDto, getValidator: (show: boolean) => Pending<TVal> | TVal, saveCall: (params: { user: IClientUser }) => Promise<TResult>, onComplete?: (result: TResult) => void, onError?: (e: any) => void) => {
  // dispatch a thunk to get latest store...
  return (dispatch: (action: UpdateEditorAction | EditorSubmitAction | EditorSuccessAction | EditorErrorAction) => void, getState: () => RootState) => {
    const current = getState().editors[store][key];

    if (current && current.status === EditorStatus.Saving) {
      return;
    }

    const show = saving || current && current.validator.showValidationErrors || false;
    const valResult = getValidator(show);
    const validator = valResult instanceof Pending ? valResult.data : valResult;
    if (!validator) {
      throw new Error("Unable to validate request");
    }
    dispatch(updateEditorAction(key, store, dto, validator));
    if (saving && !validator.isValid) {
      scrollToTheTopSmoothly();
    }
    else if (saving) {
      dispatch(handleEditorSubmit(key, store, dto, validator));
      saveCall({ user: getState().user })
        .then((x) => {
          dispatch(handleEditorSuccess(key, store));
          if (onComplete) {
            onComplete(x);
          }
        })
        .catch(e => {
          dispatch(handleEditorError({ id: key, store, dto, validation: validator, error: e }));
          if (onError) {
            onError(e);
          }
        });
    }
  };
};

const conditionalDelete = <T extends EditorStateKeys, K extends string, TDto extends InferEditorStoreDto<EditorState[T][K]>, TVal extends InferEditorStoreValidator<EditorState[T][K]>, TResult>(store: T, key: K, dto: TDto, getValidator: () => Pending<TVal> | TVal, deleteCall: (params: { user: IClientUser }) => Promise<TResult>, onComplete: (result: TResult) => void) => {
  // dispatch a thunk to get latest store...
  return (dispatch: (action: AnyAction) => void, getState: () => RootState) => {
    const current = getState().editors[store][key];

    if (current && current.status === EditorStatus.Saving) {
      return;
    }

    const valResult = getValidator();
    const validation = valResult instanceof Pending ? valResult.data : valResult;

    if (!validation) {
      throw new Error("Validator must be loaded before deleting in order to handle errors");
    }

    dispatch(handleEditorSubmit(key, store, dto, validation));

    deleteCall({ user: getState().user })
      .then((x) => {
        onComplete(x);
        dispatch(handleEditorSuccess(key, store));
        // if(destination){
        //   dispatch(navigateTo(destination, true));
        // }
      })
      .catch((e) => {
        dispatch(handleEditorError({ id: key, store, dto, validation, error: e }));
      });
  };
};

export class StoreBase {
  constructor(protected getState: () => RootState, protected queue: (action: RootActionsOrThunk) => void) {

  }

  protected markStale<T extends DataStateKeys, K extends string, TDto extends InferDataStore<DataState[T][K]>>(store: T, key: K, dto: TDto | undefined) {
    this.queue(dataLoadAction(key, store, LoadingStatus.Stale, dto));
  }

  protected getData<T extends DataStateKeys, K extends string, TDto extends InferDataStore<DataState[T][K]>>(store: T, key: K, load: (params: { user: IClientUser }) => Promise<TDto>): Pending<TDto> {
    const existing = this.getState().data[store][key];
    if (!existing || statesToReload.indexOf(existing.status) !== -1) {
      this.queue(conditionalLoad(store, key, load));
    }
    return new Pending(existing && existing.status || LoadingStatus.Preload, existing && existing.data as TDto, existing && existing.error);
  }

  protected getEditor<T extends EditorStateKeys, K extends string, TDto extends InferEditorStoreDto<EditorState[T][K]>, TVal extends InferEditorStoreValidator<EditorState[T][K]>>(store: T, key: K, getData: () => Pending<TDto>, init: ((data: TDto) => void) | null | undefined, getValidator: (data: TDto) => Pending<TVal> | TVal): Pending<IEditorStore<TDto, TVal>> {
    const existing = this.getState().editors[store][key];

    if (existing) {
      return Pending.done<IEditorStore<TDto, TVal>>(existing as any);
    }

    const data = getData()
      // clone the dto so we dont edit whats in the store
      .then(newData => processDto(newData) as TDto)
      .then(d => {
        if (init) {
          init(d);
        }
        return d;
      })
      ;

    const validator = data.chain(x => {
      const valResult = getValidator(x);
      return valResult instanceof Pending ? valResult : Pending.done(valResult);
    });

    const combined = Pending.combine({
      data,
      validator,
    });

    return combined.then(x => ({
      data: x.data,
      validator: x.validator,
      status: EditorStatus.Editing,
      error: null
    }));
  }

  protected updateEditor<T extends EditorStateKeys, K extends string, TDto extends InferEditorStoreDto<EditorState[T][K]>, TVal extends InferEditorStoreValidator<EditorState[T][K]>, TResult>(submit: boolean, store: T, key: K, dto: TDto, getValidator: (showErrors: boolean) => Pending<TVal> | TVal, saveCall: (p: { user: IClientUser }) => Promise<TResult>, onComplete?: (result: TResult) => void, onError?: (e: any) => void) {
    this.queue(conditionalSave(submit, store, key, dto, getValidator, saveCall, onComplete, onError));
  }

  protected deleteEditor<T extends EditorStateKeys, K extends string, TDto extends InferEditorStoreDto<EditorState[T][K]>, TVal extends InferEditorStoreValidator<EditorState[T][K]>, TResult>(store: T, key: K, dto: TDto, getValidator: () => Pending<TVal> | TVal, deleteCall: (p: { user: IClientUser }) => Promise<TResult>, onComplete: (result: TResult) => void, destination?: ILinkInfo) {
    this.queue(conditionalDelete(store, key, dto, getValidator, deleteCall, (result) => {
      if (destination) {
        this.queue(navigateTo(destination));
      }
      if (onComplete) {
        onComplete(result);
      }
    }));
  }

  protected resetEditor<T extends EditorStateKeys, K extends string>(store: T, key: K) {
    this.queue(resetEditor(key, store));
  }
}
