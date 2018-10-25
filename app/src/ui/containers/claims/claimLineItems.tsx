import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import { ClaimsDetailsRoute } from "./details";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import * as Dtos from "../../models";
import * as ACC from "../../components";
import {DocumentList, LinksList} from "../../components";

interface Params {
  projectId: string;
  partnerId: string;
  costCategoryId: string;
  periodId: number;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  lineItems: Pending<Dtos.ClaimLineItemDto[]>;
  costCategories: Pending<Dtos.CostCategoryDto[]>;
  forecastDetail: Pending<Dtos.ForecastDetailsDTO>;
  documents: Pending<Dtos.DocumentSummaryDto[]>;
}

interface CombinedData {
  project: Dtos.ProjectDto;
  lineItems: Dtos.ClaimLineItemDto[];
  costCategories: Dtos.CostCategoryDto[];
  forecastDetail: Dtos.ForecastDetailsDTO;
  documents: Dtos.DocumentSummaryDto[];
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
    const mockDocs = [
      {
        text: "Sharing or collaborating with government documents.pdf ",
        url: "http://www.google.com"
      },
      {
        text: "APA Citation Style, 6th edition: Government Publication.pdf",
        url: "http://www.bbc.com"
      }
    ];
    const divTitleStyle = {
      "display": "flex",
      "align-items": "baseline",
      "margin-bottom": "60px"
    };
    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink
            route={ClaimsDetailsRoute.getLink({ projectId: project.id, partnerId: this.props.partnerId, periodId: this.props.periodId })}
          >Back
          </ACC.BackLink>
        </ACC.Section>
        <ACC.Section>
          <ACC.Projects.Title pageTitle={`Claim for ${costCategories.find(x => x.id === this.props.costCategoryId)!.name}`} project={project} />
        </ACC.Section>
        <ACC.Section>
          <ClaimLineItemsTable lineItems={lineItems} forecastDetail={forecastDetail} />
        </ACC.Section>
        <ACC.Section>
          <div style={divTitleStyle}>
            <h2 className="govuk-heading-m govuk-!-margin-bottom-0 govuk-!-margin-right-2">Supporting documents</h2>
            <span>(Documents open in a new window)</span>
          </div>
          {mockDocs.length > 0 ? <LinksList links={mockDocs}/> : <h2 className="govuk-heading-s govuk-!-margin-bottom-0 govuk-!-margin-right-2">No documents attached</h2> }
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const ClaimLineItemsTable: React.SFC<{ lineItems: Dtos.ClaimLineItemDto[], forecastDetail: Dtos.ForecastDetailsDTO }> = ({ lineItems, forecastDetail }) => {
  const LineItemTable = ACC.TypedTable<Dtos.ClaimLineItemDto>();
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

export const ClaimLineItemsRoute = definition.route({
  routeName: "claim-line-items-view",
  routePath: "/projects/:projectId/claims/:partnerId/details/:periodId/costs/:costCategoryId",
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    costCategoryId: route.params.costCategoryId,
    periodId: parseInt(route.params.periodId, 10)
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadCostCategories(),
    Actions.loadForecastDetail(params.partnerId, params.periodId, params.costCategoryId),
    Actions.loadClaimLineItemsForCategory(params.partnerId, params.costCategoryId, params.periodId),
    Actions.loadClaimDetailDocuments(params.partnerId, params.periodId, params.costCategoryId)
  ],
  container: ClaimLineItems
});
