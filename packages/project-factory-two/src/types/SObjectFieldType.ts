type Thunk<T> = () => T;
type SObjectFieldType<T> = Thunk<T | undefined> | T | undefined;

export { Thunk, SObjectFieldType };
