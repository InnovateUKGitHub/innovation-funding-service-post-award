import * as React from "react";
import classNames from "classnames";
import { BaseInput } from "./baseInput";

interface FileUploadProps {
    name: string;
    disabled?: boolean;
    onChange: (v: File | null) => void;
    placeholder?: string;
}

export class FileUpload extends BaseInput<FileUploadProps, {value: File | null} > {

    constructor(props: FileUploadProps) {
        super(props);
        this.state = {value: null};
    }

    public render() {
        return (
            <input
                type="file"
                className={classNames("govuk-input")}
                name={this.props.name}
                disabled={this.props.disabled}
                onChange={e => this.handleChange(e)}
                onBlur={e => this.handleChange(e)}
            />
        );
    }

    private handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
        const files = (e.target as HTMLInputElement).files;
        const value = (files && files.length > 0 && files[0]) || null;
        if (this.state.value !== value) {
            this.props.onChange(value);
        }
    }
}
