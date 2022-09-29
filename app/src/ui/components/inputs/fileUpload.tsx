import React, { useRef, useEffect } from "react";
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

export const MultipleFileUpload = ({ name, qa, error, onChange, value, ...props }: MultipleFileUploadProps) => {
  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (fileInput.current?.value && (!value || !value.length)) {
      fileInput.current.value = "";
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files?.length) {
      return onChange([]);
    }

    return onChange(Array.from(files).map(f => new ClientFileWrapper(f)));
  };

  return (
    <input
      {...props}
      id={name}
      name={name}
      data-qa={qa || "multiple-file-upload"}
      type="file"
      className={classNames("govuk-file-upload", { "govuk-file-upload--error": error })}
      onChange={e => handleChange(e)}
      onBlur={e => handleChange(e)}
      multiple
      ref={fileInput}
    />
  );
};
