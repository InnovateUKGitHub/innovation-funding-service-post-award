import React, { useState } from "react";

import { useMounted } from "@ui/features";
import { AccordionControls } from "./AccordionControls";
import { AccordionItem, AccordionItemProps } from "./AccordionItem";

type AccordionNodes = React.ReactElement<AccordionItemProps>;

// Note: Consumers using ternaries or shortcuts will hit type errors 'React.Children.toArray' removes falsy values
type ConsumerAccordionNodes = AccordionNodes | false | null;

export interface AccordionProps {
  children: ConsumerAccordionNodes | ConsumerAccordionNodes[];
  qa?: string;
}

type AccordionState = Map<number, boolean>;
export const Accordion = ({ qa, children }: AccordionProps) => {
  const { isClient } = useMounted();

  const accordionItems = React.Children.toArray(children) as AccordionNodes[];

  const [state, setState] = useState<AccordionState>(() => {
    const initialState = new Map();

    accordionItems.forEach((_, nodeIndex) => initialState.set(nodeIndex, false));

    return initialState;
  });

  const toggleAllNodes = React.useCallback((openAllNodes: boolean) => {
    const newState = new Map();

    setState(currentState => {
      const currentStateKeys = [...currentState.keys()];

      currentStateKeys.forEach((_, nodeIndex) => newState.set(nodeIndex, openAllNodes));

      return newState;
    });
  }, []);

  const handleNode = React.useCallback((uid: number, newState: boolean) => {
    setState(x => new Map(x.set(uid, newState)));
  }, []);

  const isAllNodesOpen: boolean = [...state.values()].every(Boolean);

  const qaValue = qa ? qa + "-accordion-container" : "accordion-container";

  return (
    <div className="govuk-accordion" data-qa={qaValue}>
      {isClient ? (
        <>
          <AccordionControls isOpen={isAllNodesOpen} onClick={toggleAllNodes} />

          {React.Children.map(accordionItems, (node, nodeIndex) => {
            const isOpen = state.get(nodeIndex);

            return React.cloneElement(node, {
              ...node.props,
              isOpen,
              onClick: () => handleNode(nodeIndex, !isOpen),
            });
          })}
        </>
      ) : (
        accordionItems
      )}
    </div>
  );
};

Accordion.Item = AccordionItem;
