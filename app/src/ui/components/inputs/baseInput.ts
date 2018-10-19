import React from "react";

export abstract class BaseInput<TProps, TState> extends React.Component<TProps, TState> {
    private timeoutId: number | null = null;

    protected cancelTimeout() {
        // Cancel the debounce timout
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = 0;
        }
    }

    protected debounce(action: () => void, timeout: number = 250) {
        this.cancelTimeout();
        this.timeoutId = window.setTimeout(action, timeout);
    }
}
