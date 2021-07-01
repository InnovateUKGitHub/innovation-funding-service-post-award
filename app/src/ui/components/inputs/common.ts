
export interface InputState {
    value: string;
}

export interface InputProps<T> {
    value?: T|null;
    name: string;
    disabled?: boolean;
    onChange?: (v: T|null) => void;
    placeholder?: string;
    ariaLabel?: string;
    ariaDescribedBy?: string;
    hasError?: boolean;
    debounce?: boolean;
}
