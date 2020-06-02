export interface Option<T> {
  active: boolean;
  defaultValue?: boolean;
  label: string;
  value: T;
}
