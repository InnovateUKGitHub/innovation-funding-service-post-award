import * as React from "react";
import classNames from "classnames";
import { BaseInput } from "./baseInput";

export class ClientFileWrapper implements IFileWrapper {
  constructor(public readonly file: File) {
    this.fileName = file.name;
    this.size = file.size;
  }

  public readonly size: number;
  public readonly fileName: string;
}

interface FileUploadProps {
  name: string;
  disabled?: boolean;
  onChange: (v: IFileWrapper | null) => void;
  value: IFileWrapper | null | undefined;
}

export class FileUpload extends BaseInput<FileUploadProps, { value: File | null }> {
  private fileInput: HTMLInputElement | null = null;

  public componentWillReceiveProps(nextProps: FileUploadProps) {
    if (nextProps.value !== this.props.value && nextProps.value === null && this.fileInput) {
      this.fileInput.value = "";
    }
  }

  public render() {
    return (
      <input
        id={this.props.name}
        type="file"
        className={classNames("govuk-file-upload")}
        name={this.props.name}
        disabled={this.props.disabled}
        onChange={e => this.handleChange(e)}
        onBlur={e => this.handleChange(e)}
        ref={ref=> this.fileInput = ref}
      />
    );
  }

  private handleChange(e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) {
    const files = (e.target as HTMLInputElement).files;
    const value = (files && files.length > 0 && files[0]) || null;
    const wrapped = value && new ClientFileWrapper(value);
    this.props.onChange(wrapped);
  }
}
