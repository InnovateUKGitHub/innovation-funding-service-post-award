import { useFragment } from "react-relay";
import { Warning as WarningComponent } from "./warning";
import { useFragmentContext } from "@gql/fragmentContextHook";
import { isValidFragmentKey } from "@gql/isValidFragmentKey";
import { WarningFragment$key } from "./__generated__/WarningFragment.graphql";
import { warningFragment } from "./Warning.fragment";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { ForecastDetailsDtosValidator } from "@ui/validation/validators/forecastDetailsDtosValidator";
import { getFirstEdge } from "@gql/selectors/edges";
import { getPartnerRoles } from "@gql/dtoMapper/getPartnerRoles";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToClaimDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { mapToRequiredSortedCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { mapToGolCostDtoArray } from "@gql/dtoMapper/mapGolCostsDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";
import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";

const defaultRole = { isPm: false, isMo: false, isFc: false };

export const Warning = ({ editor }: { editor?: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator> }) => {
  const fragmentRef = useFragmentContext();

  if (!isValidFragmentKey<WarningFragment$key>(fragmentRef, "WarningFragment")) {
    throw new Error("Warning component is missing a WarningFragment reference");
  }
  const fragment = useFragment(warningFragment, fragmentRef);

  const { node: projectNode } = getFirstEdge(fragment?.query?.Warning_Project?.edges);
  const { node: partnerNode } = getFirstEdge(projectNode?.Acc_ProjectParticipantsProject__r?.edges);

  const claimsGql = fragment?.query?.Warning_Claims?.edges ?? [];
  const profileGql = fragment?.query?.Warning_Profile?.edges ?? [];

  // PARTNER ROLES
  const partnerRoles = getPartnerRoles(projectNode?.roles ?? null);

  // PROJECT
  const project = mapToProjectDto(projectNode, ["id"]);

  // PARTNER
  const partner = mapToPartnerDto(partnerNode, ["id", "roles"], {
    roles: partnerRoles.find(x => x.partnerId === partnerNode?.Id ?? "unknown") ?? defaultRole,
  });

  // CLAIMS
  const claims = mapToClaimDtoArray(claimsGql, ["periodId"], {});

  // COST CATEGORIES
  const costCategories = mapToRequiredSortedCostCategoryDtoArray(
    fragment?.query?.Warning_CostCategory?.edges ?? [],
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
