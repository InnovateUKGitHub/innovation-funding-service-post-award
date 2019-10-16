import React from "react";
import * as ACC from "@ui/components";
import { PCRDto, PCRItemDto } from "@framework/dtos";
import { IRoutes } from "@ui/routing";
import { PCRItemType } from "@framework/constants";

interface Props {
  currentItem: PCRItemDto | null;
  pcr: PCRDto;
  isReviewing: boolean;
  editableItemTypes: PCRItemType[];
  routes: IRoutes;
}

export const NavigationArrowsForPCRs = (props: Props) => {
  const { pcr, currentItem, isReviewing, editableItemTypes, routes } = props;
  const pcrItems = pcr.items.filter(x => editableItemTypes.indexOf(x.type) >= 0);

  // if current item is null then you are looking at reasoning so you want a previous link to the last item ie current index is length
  const currentIndex = currentItem ? pcrItems.findIndex(x => x.id === currentItem.id) : pcrItems.length;

  const prev = isReviewing ?
    getLinkForReviewingItem(routes, pcrItems[currentIndex - 1], pcr.projectId, pcr.id, false) :
    getLinkForViewingItem(routes, pcrItems[currentIndex - 1], pcr.projectId, pcr.id, false);

  // if current item is null then you are looking at reasoning so you do not want a next link
  const next = isReviewing ?
    getLinkForReviewingItem(routes, pcrItems[currentIndex + 1], pcr.projectId, pcr.id, !!currentItem) :
    getLinkForViewingItem(routes, pcrItems[currentIndex + 1], pcr.projectId, pcr.id, !!currentItem);

  return (
    <ACC.NavigationArrows previousLink={prev} nextLink={next} />
  );
};

const getLinkForReviewingItem = (routes: IRoutes, pcrItem: PCRItemDto, projectId: string, pcrId: string, allowReasoningLink: boolean) => {
  if (!pcrItem && !allowReasoningLink) {
    return null;
  }

  if (!pcrItem) {
    return { label: "Reasoning", route: routes.pcrReviewReasoning.getLink({ pcrId, projectId }) };
  }

  return {
    label: pcrItem.typeName,
    route: routes.pcrReviewItem.getLink({ pcrId, projectId, itemId: pcrItem.id })
  };
};

const getLinkForViewingItem = (routes: IRoutes, pcrItem: PCRItemDto, projectId: string, pcrId: string, allowReasoning: boolean) => {
  if (!pcrItem && !allowReasoning) {
    return null;
  }

  if (!pcrItem) {
    return { label: "Reasoning", route: routes.pcrViewReasoning.getLink({ pcrId, projectId }) };
  }

  return {
    label: pcrItem.typeName,
    route: routes.pcrViewItem.getLink({ pcrId, projectId, itemId: pcrItem.id })
  };
};
