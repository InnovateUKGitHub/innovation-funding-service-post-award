import { ComponentType, FunctionComponent } from "react";
import { getDisplayName } from "./getDisplayName";

interface DataQaProps {
  qa?: string | number;
}

const WithQa = <Props,>(
  Element: ComponentType<Props> | keyof React.JSX.IntrinsicElements,
): FunctionComponent<DataQaProps & Props> => {
  const DataQa = (props: DataQaProps & Props) => {
    return (
      <Element
        // Pass through existing props
        {...props}
        // Do not pass through QA
        qa={undefined}
        // Add data-qa tag
        data-qa={String(props.qa)}
      />
    );
  };

  DataQa.displayName = `WithQa(${getDisplayName(Element)})`;

  return DataQa;
};

export { WithQa };
