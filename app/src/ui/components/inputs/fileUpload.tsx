import React from "react";
import classNames from "classnames";
import { IFileWrapper } from "@framework/types";
import { ClientFileWrapper } from "../../../client/clientFileWrapper";

type InputAttr = Omit<React.HTMLAttributes<HTMLInputElement>, "onChange">;

export interface MultipleFileUploadProps extends InputAttr {
  name: string;
  disabled?: boolean;
  onChange: (v: IFileWrapper[]) => void;
  value: IFileWrapper[] | null | undefined;
  error?: boolean;
  qa?: string;
  id?: never;
  className?: never;
  multiple?: never;
}

export class MultipleFileUpload extends React.Component<MultipleFileUploadProps> {
  private fileInput: HTMLInputElement | null = null;

  // TODO: refactor deprecated react methods
  public UNSAFE_componentWillReceiveProps(nextProps: MultipleFileUploadProps) {
    if (this.fileInput && this.fileInput.value && (!nextProps.value || !nextProps.value.length)) {
      this.fileInput.value = "";
    }
  }

  public render() {
    // TODO: https://devops.innovateuk.org/issue-tracking/browse/ACC-8161
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { value, error, ...props } = this.props;

    return (
      <input
        {...props}
        id={props.name}
        data-qa={props.qa || "multiple-file-upload"}
        type="file"
        className={classNames("govuk-file-upload", { "govuk-file-upload--error": error })}
        onChange={e => this.handleChange(e)}
        onBlur={e => this.handleChange(e)}
        multiple
        ref={ref => (this.fileInput = ref)}
      />
    );
  }

  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files?.length) {
      return this.props.onChange([]);
    }

    return this.props.onChange(Array.from(files).map(f => new ClientFileWrapper(f)));
  }
}
