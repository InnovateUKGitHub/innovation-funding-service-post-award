import * as React from "react";
import classNames from "classnames";
import { BaseInput } from "./baseInput";

interface FileUploadProps {
  name: string;
  disabled?: boolean;
  onChange: (v: File | null) => void;
  value: File | null | undefined;
  placeholder?: string;
}

export class FileUpload extends BaseInput<FileUploadProps, { value: File | null }> {

  private fileInput: any;

  public componentWillReceiveProps(nextProps: InputProps<File | null>) {
    if (nextProps.value !== this.props.value && nextProps.value === null) {
      this.fileInput.value = "";
    }
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
        ref={ref=> this.fileInput = ref}
      />
    );
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    const value = (files && files.length > 0 && files[0]) || null;
    this.props.onChange(value);
  }
}
