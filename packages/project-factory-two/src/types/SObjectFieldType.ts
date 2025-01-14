type Thunk<T> = () => T;
type SObjectFieldType<T> = T | undefined;
type SObjectFieldThunkType<T> = Thunk<T | undefined> | T | undefined;

type SObjectFieldIdType = SObjectFieldThunkType<string>;

export { Thunk, SObjectFieldType, SObjectFieldThunkType, SObjectFieldIdType };
