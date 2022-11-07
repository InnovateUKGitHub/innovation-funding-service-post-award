import React, { ReactNode } from "react";

interface Props {
  items: ReactNode[];
}

/**
 * List component with items separated by a line break
 */
export const LineBreakList: React.FunctionComponent<Props> = ({ items }) => {
  return (
    <>
      {items.reduce<ReactNode[]>((result, item, index) => {
        if (index > 0) {
          result.push(<br key={`separator${index}`} />);
        }
        result.push(item);
        return result;
      }, [])}
    </>
  );
};
