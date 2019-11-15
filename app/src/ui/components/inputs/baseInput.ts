import React from "react";

export type FormInputWidths =
  "full"
  | "three-quarters"
  | "two-thirds"
  | "one-half"
  | "one-third"
  | "one-quarter"
  | 2
  | 3
  | 4
  | 5
  | 10
  | 20;

export abstract class BaseInput<TProps extends { debounce?: boolean }, TState> extends React.Component<TProps, TState> {
    private timeoutId: number | null = null;

    protected cancelTimeout() {
        // Cancel the debounce timout
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = 0;
        }
    }

    protected debounce(action: () => void, allowDebounce: boolean, timeout: number = 250) {
        this.cancelTimeout();
        if (allowDebounce === false || this.props.debounce === false) {
            action();
        }
        else {
            this.timeoutId = window.setTimeout(action, timeout);
        }
    }
}
