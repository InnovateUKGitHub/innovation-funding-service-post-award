// tslint:disable:no-bitwise

import React from "react";
import * as Actions from "../../../redux/actions";
import * as Selectors from "../../../redux/selectors";
import { IEditorStore, RootState } from "../../../redux";
import { Pending } from "../../../../shared/pending";
import { ClaimDto, PartnerDto, ProjectDto, ProjectRole } from "../../../../types";
import { ForecastDetailsDtosValidator } from "../../../validators/forecastDetailsDtosValidator";
import { ValidationMessage } from "../../../components";
import { State } from "router5";

export interface Params {
  projectId: string;
  partnerId: string;
}

export interface PendingForecastData {
  combined: Pending<ForecastData>;
}

export interface ForecastData {
  project: ProjectDto;
  partner: PartnerDto;
  claim: ClaimDto | null;
  claims: ClaimDto[];
  claimDetails: ClaimDetailsDto[];
  forecastDetails: ForecastDetailsDTO[];
  golCosts: GOLCostDto[];
  costCategories: CostCategoryDto[];
  editor?: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>;
}

export const forecastParams = (route: State) => ({
  projectId: route.params.projectId,
  partnerId: route.params.partnerId,
});

export const forecastDataLoadActions = (p: Params) => [
  Actions.loadProject(p.projectId),
  Actions.loadPartner(p.partnerId),
  Actions.loadClaimsForPartner(p.partnerId),
  Actions.loadClaimDetailsForPartner(p.partnerId),
  Actions.loadForecastDetailsForPartner(p.partnerId),
  Actions.loadForecastGOLCostsForPartner(p.partnerId),
  Actions.loadCostCategories(),
];

export const withDataEditor = (state: RootState, props: Params): PendingForecastData => {
  // TODO: Really need to look at this data load and make it more efficient and require less data!
  const combined = Pending.combine({
    project: Selectors.getProject(props.projectId).getPending(state),
    partner: Selectors.getPartner(props.partnerId).getPending(state),
    claim: Selectors.getCurrentClaim(state, props.partnerId),
    claims: Selectors.findClaimsByPartner(props.partnerId).getPending(state),
    claimDetails: Selectors.findClaimDetailsByPartner(props.partnerId).getPending(state),
    forecastDetails: Selectors.findForecastDetailsByPartner(props.partnerId).getPending(state),
    golCosts: Selectors.findGolCostsByPartner(props.partnerId).getPending(state),
    costCategories: Selectors.getCostCategories().getPending(state),
    editor: Selectors.getForecastDetailsEditor(props.partnerId).get(state).then(x => x!),
  });

  return { combined };
};

export const renderWarning = (data: ForecastData) => {
  if (!(data.partner.roles & ProjectRole.FinancialContact)) {
    return null;
  }
  const categories: string[] = [];
  const currentPeriod = data.claims.reduce((prev, item) => item.periodId > prev ? item.periodId : prev, 0);
  const forecasts = !!data.editor ? data.editor.data : data.forecastDetails;

  data.costCategories
    .filter(x => x.competitionType === data.project.competitionType && x.organisationType === data.partner.organisationType)
    .forEach(category => {
      let total = 0;
      const gol = data.golCosts.find(x => x.costCategoryId === category.id);

      data.claimDetails.forEach(x => total += (x.costCategoryId === category.id && x.periodId <= currentPeriod) ? x.value : 0);
      forecasts.forEach(x => total += (x.costCategoryId === category.id && x.periodId > currentPeriod) ? x.value : 0);

      if (!gol || gol.value < total) {
        categories.push(category.name);
      }
    });

  return categories.length === 0 ? null : (
    <ValidationMessage
      messageType="info"
      message={`The total of forecasts and costs for ${categories.join(", ")} exceeds the grant offer letter costs. The Monitoring Officer may require more information in order to approve the claim.`}
      qa="forecasts-warning"
    />
  );
};
