import React from "react";
import classNames from "classnames";
import { IFileWrapper } from "@framework/types";
import { ClientFileWrapper } from "../../../client/clientFileWrapper";

interface FileUploadProps {
  name: string;
  disabled?: boolean;
  onChange: (v: IFileWrapper | null) => void;
  value: IFileWrapper | null | undefined;
  error?: boolean;
}

export class FileUpload extends React.Component<FileUploadProps, { value: File | null }> {
  private fileInput: HTMLInputElement | null = null;

  // TODO: refactor deprecated react methods
  public UNSAFE_componentWillReceiveProps(nextProps: FileUploadProps) {
    if (nextProps.value !== this.props.value && nextProps.value === null && this.fileInput) {
      this.fileInput.value = "";
    }
  }

  public render() {
    return (
      <input
        id={this.props.name}
        type="file"
        className={classNames("govuk-file-upload", { "govuk-file-upload--error": this.props.error })}
        name={this.props.name}
        disabled={this.props.disabled}
        onChange={e => this.handleChange(e)}
        onBlur={e => this.handleChange(e)}
        ref={ref => this.fileInput = ref}
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

interface MultipleFileUploadProps {
  name: string;
  disabled?: boolean;
  onChange: (v: IFileWrapper[]) => void;
  value: IFileWrapper[] | null | undefined;
  error?: boolean;
}

export class MulipleFileUpload extends React.Component<MultipleFileUploadProps> {
  private fileInput: HTMLInputElement | null = null;

  // TODO: refactor deprecated react methods
  public UNSAFE_componentWillReceiveProps(nextProps: MultipleFileUploadProps) {
    if (this.fileInput && this.fileInput.value && (!nextProps.value || !nextProps.value.length)) {
      this.fileInput.value = "";
    }
  }

  public render() {
    return (
      <input
        id={this.props.name}
        type="file"
        className={classNames("govuk-file-upload", { "govuk-file-upload--error": this.props.error })}
        name={this.props.name}
        disabled={this.props.disabled}
        onChange={e => this.handleChange(e)}
        onBlur={e => this.handleChange(e)}
        multiple
        ref={ref => this.fileInput = ref}
      />
    );
  }

  private handleChange(e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) {
    const files = (e.target as HTMLInputElement).files;
    if (!files || !files.length) {
      this.props.onChange([]);
    }

    return this.props.onChange(Array.from(files!).map(f => new ClientFileWrapper(f)));
  }
}
