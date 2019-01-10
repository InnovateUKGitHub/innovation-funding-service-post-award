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
  // not sure why but seems that the pending may now have too many overloads!!!!
  // ToDo: Really need to look at this data load and make it more efficient and require less data!
  const pendingData = Pending.combine(
    Selectors.getProject(props.projectId).getPending(state),
    Selectors.getPartner(props.partnerId).getPending(state),
    Selectors.getCurrentClaim(state, props.partnerId),
    Selectors.findClaimsByPartner(props.partnerId).getPending(state),
    Selectors.findClaimDetailsByPartner(props.partnerId).getPending(state),
    Selectors.findForecastDetailsByPartner(props.partnerId).getPending(state),
    Selectors.findGolCostsByPartner(props.partnerId).getPending(state),
    Selectors.getCostCategories().getPending(state),
    (project, partner, claim, claims, claimDetails, forecastDetails, golCosts, costCategories) => ({ project, partner, claim, claims, claimDetails, forecastDetails, golCosts, costCategories })
  );

  const pendingEditor = Selectors.getForecastDetailsEditor(props.partnerId).get(state).then(x => ({ editor: x! }));

  const combined = Pending.combine(pendingData, pendingEditor, (data, editor) => ({ ...data, ...editor }));

  return { combined };
};

export const renderWarning = (data: ForecastData) => {
  if (!(data.partner.roles & ProjectRole.FinancialContact)) {
    return null;
  }
  const categories: string[] = [];
  const currentPeriod = data.project.periodId;
  const forecasts = !!data.editor ? data.editor.data : data.forecastDetails;

  data.costCategories.filter(x => x.organistionType === "Industrial").forEach(category => {
    let total = 0;
    const gol = data.golCosts.find(x => x.costCategoryId === category.id);

    data.claimDetails.forEach(x => total += (x.costCategoryId === category.id && x.periodId < currentPeriod) ? x.value : 0);
    forecasts.forEach(x => total += (x.costCategoryId === category.id && x.periodId >= currentPeriod) ? x.value : 0);

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
