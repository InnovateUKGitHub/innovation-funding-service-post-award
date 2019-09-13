import React, { ReactNode } from "react";

interface Props {
  items: ReactNode[];
}

export const LineBreakList: React.FunctionComponent<Props> = ({ items }) => {
  let separator: ReactNode | null = null;
  return (
    <React.Fragment>
      {
        items.reduce<ReactNode[]>((result, item, index) => {
          result.push([separator, item]);
          separator = <br key={`separator${index}`}/>;
          return result;
        }, [])
      }
    </React.Fragment>
  );
};
