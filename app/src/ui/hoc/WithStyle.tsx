import classNames, { Argument, ArgumentArray } from "classnames";
import { ComponentType, FunctionComponent } from "react";
import { getDisplayName } from "./getDisplayName";

interface StyleProps {
  className?: Argument | ArgumentArray;
}

const WithStyle = <Props,>(
  Element: ComponentType<Props> | keyof React.JSX.IntrinsicElements,
  ...styles: ArgumentArray
): FunctionComponent<StyleProps & Props> => {
  const Style = (props: StyleProps & Props) => {
    return <Element {...props} className={classNames(props.className, styles)} />;
  };

  Style.displayName = `WithStyle(${getDisplayName(Element)})`;

  return Style;
};

export { WithStyle };
