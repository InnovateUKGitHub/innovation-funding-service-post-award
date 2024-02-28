import { useFragment } from "react-relay";
import { Warning as WarningComponent } from "./warning";
import { useFragmentContext } from "@gql/utils/fragmentContextHook";
import { isValidFragmentKey } from "@gql/utils/isValidFragmentKey";
import { ForecastWarningFragment$key } from "./__generated__/ForecastWarningFragment.graphql";
import { forecastWarningFragment } from "./ForecastWarning.fragment";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { ForecastDetailsDtosValidator } from "@ui/validation/validators/forecastDetailsDtosValidator";
import { getFirstEdge } from "@gql/selectors/edges";
import { getPartnerRoles } from "@gql/dtoMapper/getPartnerRoles";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToCurrentClaimsDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { mapToRequiredSortedCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { mapToGolCostDtoArray } from "@gql/dtoMapper/mapGolCostsDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";
import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";

const defaultRole = { isPm: false, isMo: false, isFc: false, isAssociate: false };

export const Warning = ({ editor }: { editor?: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator> }) => {
  const fragmentRef = useFragmentContext();

  if (!isValidFragmentKey<ForecastWarningFragment$key>(fragmentRef, "ForecastWarningFragment")) {
    throw new Error("Forecast Warning component is missing a ForecastWarningFragment reference");
  }
  const fragment = useFragment(forecastWarningFragment, fragmentRef);

  const { node: projectNode } = getFirstEdge(fragment?.query?.ForecastWarning_Project?.edges);
  const { node: partnerNode } = getFirstEdge(projectNode?.Acc_ProjectParticipantsProject__r?.edges);

  const claimsGql = fragment?.query?.ForecastWarning_Claims?.edges ?? [];
  const profileGql = fragment?.query?.ForecastWarning_Profile?.edges ?? [];

  // PARTNER ROLES
  const partnerRoles = getPartnerRoles(projectNode?.roles ?? null);

  // PROJECT
  const project = mapToProjectDto(projectNode, ["id"]);

  // PARTNER
  const partner = mapToPartnerDto(partnerNode, ["id", "roles"], {
    roles: partnerRoles.find(x => x.partnerId === (partnerNode?.Id ?? "unknown")) ?? defaultRole,
  });

  // CLAIMS
  const claims = mapToCurrentClaimsDtoArray(claimsGql, ["periodId"], {});

  // COST CATEGORIES
  const costCategories = mapToRequiredSortedCostCategoryDtoArray(
    fragment?.query?.ForecastWarning_CostCategory?.edges ?? [],
    ["id", "name", "displayOrder"],
    profileGql,
  );

  // GOL COSTS
  const costCategoriesOrder = costCategories.map(y => y.id);

  const golCosts = mapToGolCostDtoArray(profileGql, ["costCategoryId", "value"], costCategories).sort(
    (x, y) => costCategoriesOrder.indexOf(x.costCategoryId) - costCategoriesOrder.indexOf(y.costCategoryId),
  );

  // FORECAST DETAILS
  const forecastDetails = mapToForecastDetailsDtoArray(profileGql, ["costCategoryId", "periodId", "value"]);

  // CLAIM DETAILS
  const claimDetails = mapToClaimDetailsDtoArray(claimsGql, ["costCategoryId", "periodId", "value"], {});

  return (
    <WarningComponent
      project={project}
      partner={partner}
      forecastDetails={forecastDetails}
      claims={claims}
      costCategories={costCategories}
      claimDetails={claimDetails}
      golCosts={golCosts}
      editor={editor}
    />
  );
};
