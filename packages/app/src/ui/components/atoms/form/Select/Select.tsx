import { DetailedHTMLProps, SelectHTMLAttributes, forwardRef } from "react";
import cx from "classnames";

type SelectProps = DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, ...props }: SelectProps, ref) => {
  return <select ref={ref} className={cx("govuk-select", className)} {...props} />;
});

Select.displayName = "Select";

export { Select };
