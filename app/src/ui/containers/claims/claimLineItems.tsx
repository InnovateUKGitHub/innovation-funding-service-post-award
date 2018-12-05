import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import { ClaimsDetailsRoute } from "./details";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import * as ACC from "../../components";
import { DocumentList } from "../../components";
import { State } from "router5";
import { ReviewClaimRoute } from "./review";
import { ProjectDto } from "../../../types";

interface Params {
  projectId: string;
  partnerId: string;
  costCategoryId: string;
  periodId: number;
}

interface Data {
  project: Pending<ProjectDto>;
  lineItems: Pending<ClaimLineItemDto[]>;
  costCategories: Pending<CostCategoryDto[]>;
  forecastDetail: Pending<ForecastDetailsDTO>;
  documents: Pending<DocumentSummaryDto[]>;
}

interface CombinedData {
  project: ProjectDto;
  lineItems: ClaimLineItemDto[];
  costCategories: CostCategoryDto[];
  forecastDetail: ForecastDetailsDTO;
  documents: DocumentSummaryDto[];
}

export class ClaimLineItemsComponent extends ContainerBase<Params, Data, {}> {

  public render() {
    const combined = Pending.combine(
      this.props.project,
      this.props.lineItems,
      this.props.costCategories,
      this.props.forecastDetail,
      this.props.documents,
      (project, lineItems, costCategories, forecastDetail, documents) => ({ project, lineItems, costCategories, forecastDetail, documents })
    );
    const Loader = ACC.TypedLoader<CombinedData>();
    return <Loader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private renderContents({ project, lineItems, costCategories, forecastDetail, documents }: CombinedData) {
    const params: Params = {
      partnerId : this.props.partnerId,
      costCategoryId: this.props.costCategoryId,
      periodId : this.props.periodId,
      projectId: this.props.projectId
    };

    const backLink = this.props.route.name === ReviewClaimLineItemsRoute.routeName ? ReviewClaimRoute.getLink(params) : ClaimsDetailsRoute.getLink(params);
    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={backLink}>Back</ACC.BackLink>
        </ACC.Section>
        <ACC.Projects.Title pageTitle={`Claim for ${costCategories.find(x => x.id === this.props.costCategoryId)!.name}`} project={project} />
        <ACC.Section>
          <ClaimLineItemsTable lineItems={lineItems} forecastDetail={forecastDetail} />
        </ACC.Section>
        <ACC.Section title="Supporting documents" subtitle={documents.length > 0 ? "(Documents open in a new window)" : ""} qa="supporting-documents-section">
          {documents.length > 0 ? <DocumentList documents={documents} qa="supporting-documents"/>: <p className="govuk-body-m govuk-!-margin-bottom-0 govuk-!-margin-right-2">No documents attached</p> }
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const ClaimLineItemsTable: React.SFC<{ lineItems: ClaimLineItemDto[], forecastDetail: ForecastDetailsDTO }> = ({ lineItems, forecastDetail }) => {
  const LineItemTable = ACC.TypedTable<ClaimLineItemDto>();
  const renderFooterRow = (row: { key: string, title: string, value: React.ReactNode, qa: string }) => (
    <tr key={row.key} className="govuk-table__row" data-qa={row.qa}>
      <th className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">{row.title}</th>
      <td className="govuk-table__cell govuk-table__cell--numeric">{row.value}</td>
    </tr>
  );

  const total = lineItems.reduce((count, item) => count + (item.value || 0), 0);
  const forecast = forecastDetail.value;

  // TODO remove multiply by 100
  const diff = 100 * (forecast - total) / forecast;

  return (
    <LineItemTable.Table
      data={lineItems}
      qa="current-claim-summary-table"
      footers={[
        renderFooterRow({
          key: "1", title: "Total costs", qa: "footer-total-costs", value:
            <ACC.Renderers.Currency className={"govuk-!-font-weight-bold"} value={total} />
        }),
        renderFooterRow({
          key: "2", title: "Forecast costs", qa: "footer-forecast-costs", value:
            <ACC.Renderers.Currency value={forecast} />
        }),
        renderFooterRow({
          key: "3", title: "Difference", qa: "footer-difference", value:
            <ACC.Renderers.Percentage value={diff} />
        })
      ]}
    >
      <LineItemTable.String header="Description of cost" qa="cost-description" value={(x) => x.description} />
      <LineItemTable.Currency header="Cost (£)" qa="cost-value" value={(x) => x.value} />
    </LineItemTable.Table>
  );
};

const definition = ReduxContainer.for<Params, Data, {}>(ClaimLineItemsComponent);

export const ClaimLineItems = definition.connect({
  withData: (state, props) => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    lineItems: Selectors.findClaimLineItemsByPartnerCostCategoryAndPeriod(props.partnerId, props.costCategoryId, props.periodId).getPending(state),
    costCategories: Selectors.getCostCategories().getPending(state),
    forecastDetail: Selectors.getForecastDetail(props.partnerId, props.periodId, props.costCategoryId).getPending(state),
    documents: Selectors.getClaimDetailDocuments(props.partnerId, props.periodId, props.costCategoryId).getPending(state)
  }),
  withCallbacks: () => ({})
});

const getParams = (route: State): Params => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    costCategoryId: route.params.costCategoryId,
    periodId: parseInt(route.params.periodId, 10)
  });

const getLoadDataActions = (params: Params): Actions.AsyncThunk<any>[] => [
  Actions.loadProject(params.projectId),
  Actions.loadCostCategories(),
  Actions.loadForecastDetail(params.partnerId, params.periodId, params.costCategoryId),
  Actions.loadClaimLineItemsForCategory(params.partnerId, params.costCategoryId, params.periodId),
  Actions.loadClaimDetailDocuments(params.partnerId, params.periodId, params.costCategoryId),
];

export const ClaimLineItemsRoute = definition.route({
  routeName: "claimLineItemsView",
  routePath: "/projects/:projectId/claims/:partnerId/details/:periodId/costs/:costCategoryId",
  getParams: (route) => getParams(route),
  getLoadDataActions: (params) => getLoadDataActions(params),
  container: ClaimLineItems
});

export const ReviewClaimLineItemsRoute = definition.route({
  routeName: "claimLineItemsReview",
  routePath: "/projects/:projectId/claims/:partnerId/review/:periodId/costs/:costCategoryId",
  getParams: (route) => getParams(route),
  getLoadDataActions: (params) => getLoadDataActions(params),
  container: ClaimLineItems
});
