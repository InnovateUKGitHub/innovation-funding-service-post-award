
interface InputState {
    value: string;
}

interface InputProps<T> {
    value?: T;
    name?: string;
    disabled?: boolean;
    onChange?: (v: T) => void;
    placeholder?: string;
}
