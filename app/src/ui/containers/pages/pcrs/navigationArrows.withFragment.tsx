import { useFragment } from "react-relay";
import { NavigationArrowsForPCRs as NavigationArrowsForPcrsComponent, Props } from "./navigationArrows";
import { useFragmentContext } from "@gql/fragmentContextHook";
import { isValidFragmentKey } from "@gql/isValidFragmentKey";
import {
  NavigationArrowsFragment$data,
  NavigationArrowsFragment$key,
} from "./__generated__/NavigationArrowsFragment.graphql";
import { navigationArrowsFragment } from "./NavigationArrows.fragment";
import { mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";
import { getEditableItemTypes } from "@gql/dtoMapper/getEditableItemTypes";
import { head } from "lodash";

export const NavigationArrowsForPCRs = (props: Omit<Props, "pcr" | "editableItemTypes">) => {
  const fragmentRef = useFragmentContext();
  if (!isValidFragmentKey<NavigationArrowsFragment$key>(fragmentRef, "NavigationArrowsFragment")) {
    throw new Error("NavigationArrows is missing a NavigationArrowsFragment reference");
  }
  const fragment: NavigationArrowsFragment$data = useFragment(navigationArrowsFragment, fragmentRef);

  const pcr = head(
    mapToPcrDtoArray(
      fragment?.query?.NavigationArrows_ProjectChangeRequest?.edges ?? [],
      ["id", "projectId"],
      ["type", "id", "typeName"],
      {},
    ),
  );

  if (!pcr) throw new Error("no pcr was found for Navigation Arrows");

  const editableItemTypes = getEditableItemTypes(pcr);

  return <NavigationArrowsForPcrsComponent pcr={pcr} editableItemTypes={editableItemTypes} {...props} />;
};
