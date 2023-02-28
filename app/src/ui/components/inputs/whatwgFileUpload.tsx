import classNames from "classnames";
import React, { useEffect, useRef } from "react";

type InputAttr = Omit<React.HTMLAttributes<HTMLInputElement>, "onChange">;

export interface WhatwgMultipleFileUploadProps extends InputAttr {
  name: string;
  disabled?: boolean;
  onChange: (v: File[]) => void;
  value: File[] | null | undefined;
  error?: boolean;
  qa?: string;
  id?: never;
  className?: never;
  multiple?: never;
}

export const WhatwgMultipleFileUpload = ({ name, qa, error, onChange, value, ...props }: WhatwgMultipleFileUploadProps) => {
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

    return onChange(Array.from(files));
  };

  return (
    <input
      {...props}
      id={name}
      name={name}
      data-qa={qa || "whatwg-multiple-file-upload"}
      type="file"
      className={classNames("govuk-file-upload", { "govuk-file-upload--error": error })}
      onChange={e => handleChange(e)}
      onBlur={e => handleChange(e)}
      multiple
      ref={fileInput}
    />
  );
};
