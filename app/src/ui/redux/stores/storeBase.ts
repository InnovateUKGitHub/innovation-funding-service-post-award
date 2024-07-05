/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoadingStatus } from "@framework/constants/enums";
import { IClientRequest } from "@framework/types/IClientRequest";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { Pending } from "@shared/pending";
import { processDto } from "@shared/processResponse";
import { EditorStatus } from "@ui/redux/constants/enums";
import { AnyAction } from "redux";
import { DataLoadAction, dataLoadAction } from "../actions/common/dataLoad";
import {
  EditorErrorAction,
  EditorSubmitAction,
  EditorSuccessAction,
  UpdateEditorAction,
  handleEditorError,
  handleEditorSubmit,
  handleEditorSuccess,
  resetEditor,
  updateEditorAction,
} from "../actions/common/editorActions";
import { RootActionsOrThunk } from "../actions/root";
import { DataStateKeys, IDataStore } from "../reducers/dataReducer";
import { EditorStateKeys, IEditorStore } from "../reducers/editorsReducer";
import { DataState, EditorState, RootState } from "../reducers/rootReducer";

type InferDataStore<T> = T extends IDataStore<infer U> ? U : never;
export type InferEditorStoreDto<T> = T extends IEditorStore<infer U, infer V> ? U : never;
export type InferEditorStoreValidator<T> = T extends IEditorStore<infer U, infer V> ? V : never;

const statesToReload = [LoadingStatus.Preload, LoadingStatus.Stale];

const conditionalLoad = <
  T extends DataStateKeys,
  K extends keyof DataState[T],
  TDto extends InferDataStore<DataState[T][K]>,
>(
  store: T,
  key: K,
  load: (params: IClientRequest) => Promise<TDto>,
) => {
  // dispatch a thunk to get latest store...
  return (dispatch: (action: DataLoadAction) => void, getState: () => RootState) => {
    const existing = getState().data[store]?.[key as string];
    if (!existing || statesToReload.indexOf(existing.status) !== -1) {
      dispatch(dataLoadAction(key as string, store as string, LoadingStatus.Loading, existing && existing.data));

      load({ user: getState().user })
        .then(result => dispatch(dataLoadAction(key as string, store as string, LoadingStatus.Done, result)))
        .catch(err => dispatch(dataLoadAction(key as string, store as string, LoadingStatus.Failed, null, err)));
    }
  };
};

const conditionalSave = <
  T extends EditorStateKeys,
  K extends keyof EditorState[T],
  TDto extends InferEditorStoreDto<EditorState[T][K]>,
  TVal extends InferEditorStoreValidator<EditorState[T][K]>,
  TResult,
>(
  saving: boolean,
  store: T,
  key: K,
  dto: TDto,
  getValidator: (show: boolean) => Pending<TVal> | TVal,
  saveCall: (params: IClientRequest) => Promise<TResult>,
  onComplete?: (result: TResult) => void,
  onError?: (e: unknown) => void,
) => {
  // dispatch a thunk to get latest store...
  return (
    dispatch: (action: UpdateEditorAction | EditorSubmitAction | EditorSuccessAction | EditorErrorAction) => void,
    getState: () => RootState,
  ) => {
    const current = getState().editors[store]?.[key as string];

    if (current && current.status === EditorStatus.Saving) {
      return;
    }

    const show = saving || (current && current.validator.showValidationErrors) || false;
    const valResult = getValidator(show);
    const validator = valResult instanceof Pending ? valResult.data : valResult;
    if (!validator) {
      throw new Error("Unable to validate request");
    }

    dispatch(updateEditorAction(key as string, store as string, dto, validator));
    if (saving && !validator.isValid) {
      scrollToTheTopSmoothly();
    } else if (saving) {
      dispatch(handleEditorSubmit(key as string, store as string, dto, validator));
      saveCall({ user: getState().user })
        .then(x => {
          dispatch(handleEditorSuccess(key as string, store as string));
          if (onComplete) {
            onComplete(x);
          }
        })
        .catch(e => {
          dispatch(handleEditorError({ id: key as string, store: store as string, dto, error: e }));
          if (onError) {
            onError(e);
          }
        });
    }
  };
};

const conditionalDelete = <
  T extends EditorStateKeys,
  K extends keyof EditorState[T],
  TDto extends InferEditorStoreDto<EditorState[T][K]>,
  TVal extends InferEditorStoreValidator<EditorState[T][K]>,
  TResult,
>(
  store: T,
  key: K,
  dto: TDto,
  getValidator: () => Pending<TVal> | TVal,
  deleteCall: (params: IClientRequest) => Promise<TResult>,
  onComplete: (result: TResult) => void,
) => {
  // dispatch a thunk to get latest store...
  return (dispatch: (action: AnyAction) => void, getState: () => RootState) => {
    const current = getState().editors[store]?.[key as string];

    if (current && current.status === EditorStatus.Saving) {
      return;
    }

    const valResult = getValidator();
    const validation = valResult instanceof Pending ? valResult.data : valResult;

    if (!validation) {
      throw new Error("Validator must be loaded before deleting in order to handle errors");
    }

    dispatch(handleEditorSubmit(key as string, store as string, dto, validation));

    deleteCall({ user: getState().user })
      .then(x => {
        onComplete(x);
        dispatch(handleEditorSuccess(key as string, store as string));
      })
      .catch(e => {
        dispatch(handleEditorError({ id: key as string, store: store as string, dto, error: e }));
      });
  };
};

export class StoreBase {
  constructor(
    protected getState: () => RootState,
    protected queue: (action: RootActionsOrThunk) => void,
  ) {}

  protected markStale<
    T extends DataStateKeys,
    K extends keyof DataState[T],
    TDto extends InferDataStore<DataState[T][K]>,
  >(store: T, key: K, dto: TDto | undefined) {
    this.queue(dataLoadAction(key as string, store as string, LoadingStatus.Stale, dto));
  }

  protected getData<
    T extends DataStateKeys,
    K extends keyof DataState[T],
    TDto extends InferDataStore<DataState[T][K]>,
  >(store: T, key: K, load: (params: IClientRequest) => Promise<TDto>): Pending<TDto> {
    const existing = this.getState().data[store]?.[key as string];
    if (!existing || statesToReload.indexOf(existing.status) !== -1) {
      this.queue(conditionalLoad(store, key, load));
    }
    return new Pending(
      (existing && existing.status) || LoadingStatus.Preload,
      existing && (existing.data as TDto),
      existing && existing.error,
    );
  }

  protected getEditor<
    T extends EditorStateKeys,
    K extends keyof EditorState[T],
    TDto extends InferEditorStoreDto<EditorState[T][K]>,
    TVal extends InferEditorStoreValidator<EditorState[T][K]>,
  >(
    store: T,
    key: K,
    getData: () => Pending<TDto>,
    init: ((data: TDto) => void) | null | undefined,
    getValidator: (data: TDto) => Pending<TVal> | TVal,
    forceRefreshEditor?: boolean,
  ): Pending<IEditorStore<TDto, TVal>> {
    const existing = this.getState().editors[store]?.[key as string];

    if (existing && !forceRefreshEditor) {
      return Pending.done<IEditorStore<TDto, TVal>>(existing as IEditorStore<TDto, TVal>);
    }

    const data = getData()
      // clone the dto so we don't edit what's in the store
      .then(newData => processDto(newData) as TDto)
      .then(d => {
        if (init) {
          init(d);
        }
        return d;
      });
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
      error: null,
    }));
  }

  protected updateEditor<
    T extends EditorStateKeys,
    K extends keyof EditorState[T],
    TDto extends InferEditorStoreDto<EditorState[T][K]>,
    TVal extends InferEditorStoreValidator<EditorState[T][K]>,
    TResult,
  >(
    submit: boolean,
    store: T,
    key: K,
    dto: TDto,
    getValidator: (showErrors: boolean) => Pending<TVal> | TVal,
    saveCall: (p: IClientRequest) => Promise<TResult>,
    onComplete?: (result: TResult) => void,
    onError?: (e: unknown) => void,
  ) {
    this.queue(conditionalSave(submit, store, key, dto, getValidator, saveCall, onComplete, onError));
  }

  protected deleteEditor<
    T extends EditorStateKeys,
    K extends keyof EditorState[T],
    TDto extends InferEditorStoreDto<EditorState[T][K]>,
    TVal extends InferEditorStoreValidator<EditorState[T][K]>,
    TResult,
  >(
    store: T,
    key: K,
    dto: TDto,
    getValidator: () => Pending<TVal> | TVal,
    deleteCall: (p: IClientRequest) => Promise<TResult>,
    onComplete: (result: TResult) => void,
  ) {
    this.queue(
      conditionalDelete(store, key, dto, getValidator, deleteCall, result => {
        if (onComplete) {
          onComplete(result);
        }
      }),
    );
  }

  protected resetEditor<
    T extends EditorStateKeys,
    K extends string,
    TDto extends InferEditorStoreDto<EditorState[T][K]>,
    TVal extends InferEditorStoreValidator<EditorState[T][K]>,
  >(store: T, key: K, newDto: TDto, getValidator: () => Pending<TVal> | TVal) {
    const valResult = getValidator();
    const validation = valResult instanceof Pending ? valResult.data : valResult;

    if (!validation) throw new Error("Could not create new validator to reset editor.");

    this.queue(resetEditor<TDto>(key, store as string, newDto, validation));
  }
}
