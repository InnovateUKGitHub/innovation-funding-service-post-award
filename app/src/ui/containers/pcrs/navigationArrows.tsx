import React from "react";
import * as ACC from "@ui/components";
import {
  PCRDto,
  PCRItemDto,
  PCRItemForScopeChangeDto,
  PCRItemForTimeExtensionDto,
  PCRStandardItemDto, TypedPcrItemDto
} from "@framework/dtos";
import * as Routes from "@ui/containers";
import { ProjectChangeRequestItemTypeEntity } from "@framework/entities/projectChangeRequest";

interface Props {
  currentItem: PCRItemDto | null;
  pcr: PCRDto;
  isReviewing: boolean;
}

export const NavigationArrowsForPCRs = (props: Props) => {
  const { pcr, currentItem, isReviewing } = props;

  // if current item is null then you are looking at reasoning so you want a previous link to the last item ie current index is length
  const currentIndex = currentItem ? pcr.items.findIndex(x => x.id === currentItem.id) : pcr.items.length;

  const prev = isReviewing ?
    getLinkForReviewingItem(pcr.items[currentIndex - 1], pcr.projectId, pcr.id, false) :
    getLinkForViewingItem(pcr.items[currentIndex - 1], pcr.projectId, pcr.id, false);

  // if current item is null then you are looking at reasoning so you do not want a next link
  const next = isReviewing ?
    getLinkForReviewingItem(pcr.items[currentIndex + 1], pcr.projectId, pcr.id, !!currentItem) :
    getLinkForViewingItem(pcr.items[currentIndex + 1], pcr.projectId, pcr.id, !!currentItem);

  return (
    <ACC.NavigationArrows previousLink={prev} nextLink={next} />
  );
};

const getLinkForReviewingItem = (pcrItem: TypedPcrItemDto, projectId: string, pcrId: string, allowReasoningLink: boolean) => {
  if (!pcrItem && !allowReasoningLink) {
    return null;
  }

  if (!pcrItem) {
    return { label: "Reasoning", route: Routes.PCRReviewReasoningRoute.getLink({ pcrId, projectId }) };
  }

  return {
    label: pcrItem.typeName,
    route: Routes.PCRReviewItemRoute.getLink({ pcrId, projectId, itemId: pcrItem.id })
  };
};

const getLinkForViewingItem = (pcrItem: TypedPcrItemDto, projectId: string, pcrId: string, allowReasoning: boolean) => {
  if (!pcrItem && !allowReasoning) {
    return null;
  }

  if (!pcrItem) {
    return { label: "Reasoning", route: Routes.PCRViewReasoningRoute.getLink({ pcrId, projectId }) };
  }

  return {
    label: pcrItem.typeName,
    route: Routes.PCRViewItemRoute.getLink({ pcrId, projectId, itemId: pcrItem.id })
  };
};
