import { EditorState, EditorStateKeys, EditorStatus, IEditorStore, RootState } from "@ui/redux/reducers";
import { Results } from "@ui/validation/results";
import { Pending } from "@shared/pending";
import { processDto } from "@shared/processResponse";

export interface IEditorSelector<T, TVal extends Results<T>> {
  store: EditorStateKeys;
  key: string;
  get: (store: RootState, initalise?: (dto: T) => void) => Pending<IEditorStore<T, TVal>>;
}

export const editorStoreHelper = <T extends {}, TVal extends Results<T>>(
  storeKey: EditorStateKeys,
  getEditorStore: (state: EditorState) => { [key: string]: IEditorStore<T, TVal> },
  getData: (store: RootState) => Pending<T>,
  getValidator: (dto: T, store: RootState) => Pending<TVal>,
  key: string
): IEditorSelector<T, TVal> => ({
  store: storeKey,
  key,
  get: (store: RootState, initalise?: (dto: T) => void) => {
    const editor = getEditorStore(store.editors)[key];

    return editor ? Pending.done(editor) : getNewEditor(getData, getValidator, store, initalise);
  }
});

export const getNewEditor = <T, TVal extends Results<T>>(
  getData: (store: RootState) => Pending<T>,
  getValidator: (dto: T, store: RootState) => Pending<TVal>,
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

  const data = getData(store)
    .then(newData => processDto(newData) as T)
    .then(x => innerInit(x))
    ;

  const validator = data.chain(x => getValidator(x, store));

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
};
