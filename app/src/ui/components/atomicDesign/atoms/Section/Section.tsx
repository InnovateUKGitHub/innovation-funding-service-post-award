import cx from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  "data-qa"?: string;
};

export const Section = ({ className, children, ...rest }: Props) => (
  <section className={cx("govuk-grid-row", "acc-section", "govuk-!-margin-bottom-6", className)} {...rest}>
    <div data-qa="section-content" className="govuk-grid-column-full">
      {children}
    </div>
  </section>
);
