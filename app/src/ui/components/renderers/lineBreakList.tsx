import React, { ReactNode } from "react";

interface Props {
  items: ReactNode[];
}

export const LineBreakList: React.FunctionComponent<Props> = ({ items }) => {
  return (
    <React.Fragment>
      {
        items.reduce<ReactNode[]>((result, item, index) => {
          if(index > 0) {
            result.push(<br key={`separator${index}`}/>);
          }
          result.push(item);
          return result;
        }, [])
      }
    </React.Fragment>
  );
};
