// tslint:disable:no-bitwise
import * as Actions from "../../../redux/actions";
import { ClaimDto, PartnerDto, ProjectDto } from "@framework/types";
import { State } from "router5";

export interface Params {
  projectId: string;
  partnerId: string;
}

export interface ForecastData {
  project: ProjectDto;
  partner: PartnerDto;
  claim: ClaimDto | null;
  claims: ClaimDto[];
  claimDetails: ClaimDetailsSummaryDto[];
  forecastDetails: ForecastDetailsDTO[];
  golCosts: GOLCostDto[];
  costCategories: CostCategoryDto[];
}

export const forecastDataLoadActions = (p: Params) => [
  Actions.loadProject(p.projectId),
  Actions.loadPartner(p.partnerId),
  Actions.loadClaimsForPartner(p.partnerId),
  Actions.loadClaimDetailsForPartner(p.partnerId),
  Actions.loadForecastDetailsForPartner(p.partnerId),
  Actions.loadForecastGOLCostsForPartner(p.partnerId),
  Actions.loadCostCategories(),
];
