import { EditorState, EditorStateKeys, EditorStatus, IEditorStore, RootState } from "@ui/redux/reducers";
import { Results } from "@ui/validation/results";
import { LoadingStatus, Pending } from "@shared/pending";

export interface IEditorSelector<T, TVal extends Results<T>> {
  store: EditorStateKeys;
  key: string;
  get: (store: RootState, initalise?: (dto: T) => void) => Pending<IEditorStore<T, TVal>>;
}

export const editorStoreHelper = <T extends {}, TVal extends Results<T>>(
  storeKey: EditorStateKeys,
  getEditorStore: (state: EditorState) => { [key: string]: IEditorStore<T, TVal> },
  getData: (store: RootState) => Pending<T>,
  getValidator: (dto: T, store: RootState) => TVal,
  key: string
): IEditorSelector<T, TVal> => ({
  store: storeKey,
  key,
  get: (store: RootState, initalise?: (dto: T) => void) => {
    const editor = getEditorStore(store.editors)[key];

    return editor ? new Pending(LoadingStatus.Done, editor) : getNewEditor(getData, getValidator, store, initalise);
  }
});

export const getNewEditor = <T, TVal extends Results<T>>(
  getData: (store: RootState) => Pending<T>,
  getValidator: (dto: T, store: RootState) => TVal,
  store: RootState,
  initalise?: (dto: T) => void
): Pending<IEditorStore<T, TVal>> => {
  // wrap thie inialise as might be undefined
  const innerInit = (dto: T) => {
    if (!!initalise) {
      initalise(dto);
    }
    return dto;
  };

  return getData(store).then(newData => {
    if(Array.isArray(newData)) {
      return newData.map(x => x) as any as T;
    }
    return Object.assign({}, newData!) as T;
  })
  .then(clonedData => innerInit(clonedData!))
  .then(cloned => ({
      data: cloned!,
      state: EditorStatus.Editing,
      validator: getValidator(cloned!, store),
      error: null
    })
  );
};
