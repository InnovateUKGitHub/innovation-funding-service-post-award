import React from "react";
import * as Actions from "../../../redux/actions";
import * as Selectors from "../../../redux/selectors";
import { IEditorStore, RootState } from "../../../redux";
import { Pending } from "../../../../shared/pending";
import { ClaimDto, ProjectDto } from "../../../../types";
import { ForecastDetailsDtosValidator } from "../../../validators/forecastDetailsDtosValidator";
import { ValidationMessage } from "../../../components";
import { State } from "router5";

export interface Params {
  projectId: string;
  partnerId: string;
  periodId: number;
}

export interface Data {
  combined: Pending<CombinedData>;
}

export interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  claim: ClaimDto;
  claimDetails: ClaimDetailsDto[];
  forecastDetails: ForecastDetailsDTO[];
  golCosts: GOLCostDto[];
  costCategories: CostCategoryDto[];
  editor?: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>;
}

export const forecastParams = (route: State) => ({
  projectId: route.params.projectId,
  partnerId: route.params.partnerId,
  periodId: parseInt(route.params.periodId, 10)
});

export const forecastDataLoadActions = (p: Params) => [
  Actions.loadProject(p.projectId),
  Actions.loadPartner(p.partnerId),
  Actions.loadClaim(p.partnerId, p.periodId),
  Actions.loadClaimDetailsForPartner(p.partnerId),
  Actions.loadForecastDetailsForPartner(p.partnerId, p.periodId),
  Actions.loadForecastGOLCostsForPartner(p.partnerId),
  Actions.loadCostCategories(),
];

export const withDataEditor = (state: RootState, props: Params): Data => {
  const combined = Pending.combine(
    Selectors.getProject(props.projectId).getPending(state),
    Selectors.getPartner(props.partnerId).getPending(state),
    Selectors.getClaim(props.partnerId, props.periodId).getPending(state),
    Selectors.findClaimDetailsByPartner(props.partnerId).getPending(state),
    Selectors.findForecastDetailsByPartner(props.partnerId, props.periodId).getPending(state),
    Selectors.findGolCostsByPartner(props.partnerId).getPending(state),
    Selectors.getCostCategories().getPending(state),
    Selectors.getForecastDetailsEditor(props.partnerId, props.periodId).get(state),
    (a, b, c, d, e, f, g, h) => ({ project: a, partner: b, claim: c, claimDetails: d, forecastDetails: e, golCosts: f, costCategories: g, editor: h })
  );

  return { combined };
};

export const renderWarning = (data: CombinedData) => {
  const categories: string[] = [];
  const currentPeriod = data.claim.periodId;
  const forecasts = !!data.editor ? data.editor.data : data.forecastDetails;

  data.costCategories.filter(x => x.organistionType === "Industrial").forEach(category => {
    let total = 0;
    const gol = data.golCosts.find(x => x.costCategoryId === category.id);

    data.claimDetails.forEach(x => total += (x.costCategoryId === category.id && x.periodId < currentPeriod) ? x.value : 0);
    forecasts.forEach(x => total += (x.costCategoryId === category.id && x.periodId >= currentPeriod) ? x.value : 0);

    if(!gol || gol.value < total) {
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
