import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as ACC from "../../components";
import { DocumentList, NavigationArrows } from "../../components";
import { State } from "router5";
import { ClaimDto, ILinkInfo, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import classNames from "classnames";
import { StoresConsumer } from "@ui/redux";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";

interface Params {
  projectId: string;
  partnerId: string;
  costCategoryId: string;
  periodId: number;
}

interface Data {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  claimDetails: Pending<ClaimDetailsDto>;
  costCategories: Pending<CostCategoryDto[]>;
  forecastDetail: Pending<ForecastDetailsDTO>;
  documents: Pending<DocumentSummaryDto[]>;
  claim: Pending<ClaimDto>;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  claimDetails: ClaimDetailsDto;
  costCategories: CostCategoryDto[];
  forecastDetail: ForecastDetailsDTO;
  documents: DocumentSummaryDto[];
  claim: ClaimDto;
}

export class ClaimLineItemsComponent extends ContainerBase<Params, Data, {}> {
  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      claimDetails: this.props.claimDetails,
      costCategories: this.props.costCategories,
      forecastDetail: this.props.forecastDetail,
      documents: this.props.documents,
      claim: this.props.claim,
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private renderContents({ project, partner, claimDetails, costCategories, forecastDetail, documents, claim }: CombinedData) {
    const params: Params = {
      partnerId: this.props.partnerId,
      costCategoryId: this.props.costCategoryId,
      periodId: this.props.periodId,
      projectId: this.props.projectId
    };

    const backLink = this.props.route.name === ReviewClaimLineItemsRoute.routeName ?
      this.props.routes.reviewClaim.getLink(params) :
      this.props.routes.claimDetails.getLink(params);

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={backLink}>Back to claim</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
      >
        <ACC.Section>
          <ClaimLineItemsTable lineItems={claimDetails.lineItems} forecastDetail={forecastDetail} />
        </ACC.Section>
        <ACC.Section title="Supporting documents" subtitle={documents.length > 0 ? "(Documents open in a new window)" : ""} qa="supporting-documents-section">
          {this.renderDocumentList(documents)}
        </ACC.Section>
        {this.renderAdditionalInformation(claimDetails)}
        {this.renderNavigationArrows(costCategories, project, partner, claim)}
      </ACC.Page>
    );
  }

  private renderDocumentList(documents: DocumentSummaryDto[]) {
    return documents.length > 0
      ? <DocumentList documents={documents} qa="supporting-documents"/>
      : <ACC.ValidationMessage message="No documents uploaded." messageType="info" />;
  }

  private getLinks(costCategories: CostCategoryDto[], project: ProjectDto, partner: PartnerDto, claim: ClaimDto, pages: { getLink: (params: Params) => ILinkInfo }) {
    const periodId = this.props.periodId;
    const costCategoriesToUse = costCategories
      .filter(x => x.competitionType === project.competitionType && x.organisationType === partner.organisationType)
      .filter(x => !x.isCalculated || claim.overheadRate > this.props.config.standardOverheadRate);
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
      route: pages.getLink({
        partnerId: partner.id,
        projectId: project.id,
        periodId,
        costCategoryId: previousCostCategory.id
      })
    } : null;

    const nextLink = nextCostCategory ? {
      label: nextCostCategory.name,
      route: pages.getLink({
        partnerId: partner.id,
        projectId: project.id,
        periodId,
        costCategoryId: nextCostCategory.id
      })
    } : null;

    return {
      previousLink,
      nextLink
    };
  }

  private renderNavigationArrows = (costCategories: CostCategoryDto[], project: ProjectDto, partner: PartnerDto, claim: ClaimDto) => {
    const route = this.props.route.name === ReviewClaimLineItemsRoute.routeName ? ReviewClaimLineItemsRoute : ClaimLineItemsRoute;
    const arrowLinks = this.getLinks(costCategories, project, partner, claim, route);
    if (arrowLinks === null) return null;

    return <NavigationArrows nextLink={arrowLinks.nextLink} previousLink={arrowLinks.previousLink} />;
  }

  private renderAdditionalInformation = (claimDetail: ClaimDetailsDto) => {
    if (!claimDetail.comments) return null;
    return (
      <ACC.Section title="Additional information" qa="additional-information">
        <ACC.Renderers.SimpleString>
          {claimDetail.comments}
        </ACC.Renderers.SimpleString>
      </ACC.Section>
    );
  }
}

const ClaimLineItemsTable: React.FunctionComponent<{ lineItems: ClaimLineItemDto[], forecastDetail: ForecastDetailsDTO }> = ({ lineItems, forecastDetail }) => {
  const LineItemTable = ACC.TypedTable<ClaimLineItemDto>();
  const renderFooterRow = (row: { key: string, title: string, value: React.ReactNode, qa: string, isBold?: boolean }) => (
    <tr key={row.key} className="govuk-table__row" data-qa={row.qa}>
      <th className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">{row.title}</th>
      <td className={classNames("govuk-table__cell", "govuk-table__cell--numeric", { "govuk-!-font-weight-bold": row.isBold })}>{row.value}</td>
    </tr>
  );

  const total = lineItems.reduce((count, item) => count + (item.value || 0), 0);
  const forecast = forecastDetail.value;

  // @TODO remove multiply by 100
  const diff = 100 * (forecast - total) / forecast;

  return (
    <LineItemTable.Table
      data={lineItems}
      qa="current-claim-summary-table"
      footers={[
        renderFooterRow({
          key: "1", title: "Total costs", qa: "footer-total-costs", isBold: true, value:
            <ACC.Renderers.Currency value={total} />
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

const ClaimLineItemsContainer = (props: Params & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <ClaimLineItemsComponent
          project={stores.projects.getById(props.projectId)}
          partner={stores.partners.getById(props.partnerId)}
          claimDetails={stores.claimDetails.get(props.projectId, props.partnerId, props.periodId, props.costCategoryId)}
          costCategories={stores.costCategories.getAll()}
          forecastDetail={stores.forecastDetails.get(props.partnerId, props.periodId, props.costCategoryId)}
          claim={stores.claims.get(props.partnerId, props.periodId)}
          documents={stores.claimDetailDocuments.getClaimDetailDocuments(props.projectId, props.partnerId, props.periodId, props.costCategoryId)}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

const getParams = (route: State): Params => ({
  projectId: route.params.projectId,
  partnerId: route.params.partnerId,
  costCategoryId: route.params.costCategoryId,
  periodId: parseInt(route.params.periodId, 10)
});

export const ClaimLineItemsRoute = defineRoute({
  routeName: "claimLineItemsView",
  routePath: "/projects/:projectId/claims/:partnerId/details/:periodId/costs/:costCategoryId",
  container: ClaimLineItemsContainer,
  getParams: (route) => getParams(route),
  getTitle: ({ params, stores }) => {
    const costCatName = stores.costCategories.get(params.costCategoryId).then(x => x.name).data;
    return {
      htmlTitle: costCatName ? `View costs for ${costCatName}` : "View costs",
      displayTitle: costCatName || "Line items"
    };
  },
});

export const ReviewClaimLineItemsRoute = defineRoute({
  routeName: "claimLineItemsReview",
  routePath: "/projects/:projectId/claims/:partnerId/review/:periodId/costs/:costCategoryId",
  container: ClaimLineItemsContainer,
  getParams: (route) => getParams(route),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager) ||
    auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: ({ params, stores }) => {
    const costCatName = stores.costCategories.get(params.costCategoryId).then(x => x.name).data;
    return {
      htmlTitle: costCatName ? `Review costs for ${costCatName}` : "Review costs",
      displayTitle: costCatName || "Costs"
    };
  },
});
