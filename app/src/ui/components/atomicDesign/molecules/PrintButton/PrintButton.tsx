import { ComponentProps } from "react";
import { Button } from "../../atoms/Button/Button";
import classNames from "classnames";

const PrintButton = (props: Omit<ComponentProps<typeof Button>, "styling">) => {
  return (
    <Button {...props} className={classNames("govuk-body", props.className)} styling="White">
      Print
    </Button>
  );
};

export { PrintButton };
