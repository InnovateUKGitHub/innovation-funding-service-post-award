import { forwardRef } from "react";
import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import cx from "classnames";

type FileInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  hasError?: boolean;
};

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, hasError, ...props }: FileInputProps, ref) => {
    return (
      <input
        ref={ref}
        type="file"
        className={cx("govuk-file-upload", { "govuk-file-upload--error": hasError }, className)}
        {...props}
      />
    );
  },
);

FileInput.displayName = "FileInput";

export { FileInput };
