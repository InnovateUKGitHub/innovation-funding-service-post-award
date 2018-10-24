
interface InputState {
    value: string;
}

interface InputProps<T> {
    value?: T|null;
    name: string;
    disabled?: boolean;
    onChange?: (v: T|null) => void;
    placeholder?: string;
}
