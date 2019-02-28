import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import { ClaimsDetailsRoute } from "./details";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import * as ACC from "../../components";
import { DocumentList, NavigationArrows } from "../../components";
import { State } from "router5";
import { ReviewClaimRoute } from "./review";
import { ILinkInfo, PartnerDto, ProjectDto } from "../../../types";

interface Params {
  projectId: string;
  partnerId: string;
  costCategoryId: string;
  periodId: number;
}

interface Data {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  lineItems: Pending<ClaimLineItemDto[]>;
  costCategories: Pending<CostCategoryDto[]>;
  forecastDetail: Pending<ForecastDetailsDTO>;
  documents: Pending<DocumentSummaryDto[]>;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  lineItems: ClaimLineItemDto[];
  costCategories: CostCategoryDto[];
  forecastDetail: ForecastDetailsDTO;
  documents: DocumentSummaryDto[];
}

export class ClaimLineItemsComponent extends ContainerBase<Params, Data, {}> {
  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      lineItems: this.props.lineItems,
      costCategories: this.props.costCategories,
      forecastDetail: this.props.forecastDetail,
      documents: this.props.documents,
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private renderContents({ project, partner, lineItems, costCategories, forecastDetail, documents }: CombinedData) {
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
          <ACC.BackLink route={backLink}>Back to claim</ACC.BackLink>
        </ACC.Section>
        <ACC.Projects.Title pageTitle={`${costCategories.find(x => x.id === this.props.costCategoryId)!.name}`} project={project} />
        <ACC.Section>
          <ClaimLineItemsTable lineItems={lineItems} forecastDetail={forecastDetail} />
        </ACC.Section>
        <ACC.Section title="Supporting documents" subtitle={documents.length > 0 ? "(Documents open in a new window)" : ""} qa="supporting-documents-section">
          {this.renderDocumentList(documents)}
        </ACC.Section>
        {this.renderNavigationArrows(this.props.route.name, costCategories, project, partner)}
      </ACC.Page>
    );
  }

  private renderDocumentList(documents: DocumentSummaryDto[]) {
    return documents.length > 0
      ? <DocumentList documents={documents} qa="supporting-documents"/>
      : <p className="govuk-body-m govuk-!-margin-bottom-0 govuk-!-margin-right-2">No documents uploaded.</p>;
  }

  private getLinks = (costCategories: CostCategoryDto[], project: ProjectDto, partner: PartnerDto) => {
    const costCategoriesToUse = costCategories.filter(x => x.competitionType === project.competitionType && x.organisationType === partner.organisationType && !x.isCalculated);
    const currentCostCategory = costCategoriesToUse.find(x => x.id === this.props.costCategoryId);

    if (currentCostCategory === undefined) return null;
    const currentPosition = costCategoriesToUse.indexOf(currentCostCategory);

    let nextCostCategory = null;
    let previousCostCategory = null;

    if (currentPosition !== costCategoriesToUse.length - 1) {
      nextCostCategory = costCategoriesToUse[currentPosition + 1];
    }

    if (currentPosition !== 0) {
      previousCostCategory = costCategoriesToUse[currentPosition - 1];
    }

    const previousLink = previousCostCategory ? {
      label: previousCostCategory.name,
      route: ReviewClaimLineItemsRoute.getLink({
        partnerId: partner.id,
        projectId: project.id,
        periodId: project.periodId,
        costCategoryId: previousCostCategory.id
      })
    } : null;

    const nextLink = nextCostCategory ? {
      label: nextCostCategory.name,
      route: ReviewClaimLineItemsRoute.getLink({
        partnerId: partner.id,
        projectId: project.id,
        periodId: project.periodId,
        costCategoryId: nextCostCategory.id
      })
    } : null;

    return {
      previousLink,
      nextLink
    };
  }

  private renderNavigationArrows = (routeName: string, costCategories: CostCategoryDto[], project: ProjectDto, partner: PartnerDto) => {
    if (routeName !== "claimLineItemsReview") return null;

    const arrowLinks = this.getLinks(costCategories, project, partner);
    if (arrowLinks === null) return null;

    return <NavigationArrows nextLink={arrowLinks.nextLink} previousLink={arrowLinks.previousLink}/>;
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
      <LineItemTable.String header="Description" qa="cost-description" value={(x) => x.description} />
      <LineItemTable.Currency header="Cost (£)" qa="cost-value" value={(x) => x.value} />
    </LineItemTable.Table>
  );
};

const definition = ReduxContainer.for<Params, Data, {}>(ClaimLineItemsComponent);

export const ClaimLineItems = definition.connect({
  withData: (state, props) => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    partner: Selectors.getPartner(props.partnerId).getPending(state),
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
  Actions.loadPartner(params.partnerId),
  Actions.loadCostCategories(),
  Actions.loadForecastDetail(params.partnerId, params.periodId, params.costCategoryId),
  Actions.loadClaimLineItemsForCategory(params.projectId, params.partnerId, params.costCategoryId, params.periodId),
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
