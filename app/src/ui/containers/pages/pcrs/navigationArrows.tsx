import { PCRItemType, disableSummaryItems } from "@framework/constants/pcrConstants";
import { PCRDto, FullPCRItemDto } from "@framework/dtos/pcrDtos";
import { NavigationArrows } from "@ui/components/atomicDesign/molecules/NavigationArrows/navigationArrows";
import { IRoutes } from "@ui/routing/routeConfig";

export type PCRTypeForNavigationArrows = Pick<Omit<PCRDto, "items">, "projectId" | "id"> & {
  items: Pick<FullPCRItemDto, "type" | "typeName" | "id">[];
};

export interface Props {
  currentItem: Pick<FullPCRItemDto, "id"> | null;
  pcr: PCRTypeForNavigationArrows;
  isReviewing: boolean;
  editableItemTypes: PCRItemType[];
  routes: IRoutes;
}

export const NavigationArrowsForPCRs = (props: Props) => {
  const { pcr, currentItem, isReviewing, editableItemTypes, routes } = props;
  const pcrItems = pcr.items.filter(x => editableItemTypes.indexOf(x.type) >= 0);
  const disableSummary = pcr.items.some(x => disableSummaryItems.some(y => x.type === y));

  // if current item is null then you are looking at reasoning so you want a previous link to the last item ie current index is length
  const currentIndex = currentItem ? pcrItems.findIndex(x => x.id === currentItem.id) : pcrItems.length;

  const prev = isReviewing
    ? getLinkForReviewingItem(routes, pcrItems[currentIndex - 1], pcr.projectId, pcr.id, false)
    : getLinkForViewingItem(routes, pcrItems[currentIndex - 1], pcr.projectId, pcr.id, false);

  // if current item is null then you are looking at reasoning so you do not want a next link
  const next = isReviewing
    ? getLinkForReviewingItem(
        routes,
        pcrItems[currentIndex + 1],
        pcr.projectId,
        pcr.id,
        !!currentItem && !disableSummary,
      )
    : getLinkForViewingItem(
        routes,
        pcrItems[currentIndex + 1],
        pcr.projectId,
        pcr.id,
        !!currentItem && !disableSummary,
      );

  return <NavigationArrows previousLink={prev} nextLink={next} />;
};

const getLinkForReviewingItem = (
  routes: IRoutes,
  pcrItem: Pick<FullPCRItemDto, "typeName" | "id">,
  projectId: ProjectId,
  pcrId: PcrId,
  allowReasoningLink: boolean,
) => {
  if (!pcrItem && !allowReasoningLink) {
    return null;
  }

  if (!pcrItem) {
    return { label: "Reasoning", route: routes.pcrReviewReasoning.getLink({ pcrId, projectId }) };
  }

  return {
    label: pcrItem.typeName,
    route: routes.pcrReviewItem.getLink({ pcrId, projectId, itemId: pcrItem.id }),
  };
};

const getLinkForViewingItem = (
  routes: IRoutes,
  pcrItem: Pick<FullPCRItemDto, "typeName" | "id">,
  projectId: ProjectId,
  pcrId: PcrId,
  allowReasoning: boolean,
) => {
  if (!pcrItem && !allowReasoning) {
    return null;
  }

  if (!pcrItem) {
    return { label: "Reasoning", route: routes.pcrViewReasoning.getLink({ pcrId, projectId }) };
  }

  return {
    label: pcrItem.typeName,
    route: routes.pcrViewItem.getLink({ pcrId, projectId, itemId: pcrItem.id }),
  };
};
