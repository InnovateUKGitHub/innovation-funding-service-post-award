import classNames from "classnames";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { useContent } from "@ui/hooks/content.hook";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { diffAsPercentage, sumBy } from "@framework/util/numberHelper";
import { Pending } from "../../../../shared/pending";
import { BaseProps, ContainerBase, defineRoute, RouteState } from "../../containerBase";
import { DocumentView } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { NavigationArrows } from "@ui/components/atomicDesign/molecules/NavigationArrows/navigationArrows";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { AccessibilityText } from "@ui/components/atomicDesign/atoms/AccessibilityText/AccessibilityText";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { Percentage } from "@ui/components/atomicDesign/atoms/Percentage/percentage";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { ProjectRole } from "@framework/constants/project";
import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { ClaimDto } from "@framework/dtos/claimDto";
import { ClaimLineItemDto } from "@framework/dtos/claimLineItemDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { useStores } from "@ui/redux/storesProvider";

interface ClaimLineItemsParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  costCategoryId: string;
  periodId: PeriodId;
}

interface Data {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  claimDetails: Pending<ClaimDetailsDto>;
  costCategories: Pending<CostCategoryDto[]>;
  forecastDetail: Pending<ForecastDetailsDTO>;
  documents: Pending<DocumentSummaryDto[]>;
  claim: Pending<ClaimDto>;
  content: Record<string, string>;
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

const LineItemTable = createTypedTable<ClaimLineItemDto>();

export class ClaimLineItemsComponent extends ContainerBase<ClaimLineItemsParams, Data> {
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

    return <PageLoader pending={combined} render={data => this.renderContents(data)} />;
  }

  private renderContents({
    project,
    partner,
    claimDetails,
    costCategories,
    forecastDetail,
    documents,
    claim,
  }: CombinedData) {
    const params: ClaimLineItemsParams = {
      partnerId: this.props.partnerId,
      costCategoryId: this.props.costCategoryId,
      periodId: this.props.periodId,
      projectId: this.props.projectId,
    };

    const backLink =
      this.props.currentRoute.routeName === ReviewClaimLineItemsRoute.routeName
        ? this.props.routes.reviewClaim.getLink(params)
        : this.props.routes.claimDetails.getLink(params);

    // TODO: we get this twice which is not ideal, but this whole file should be refactored to a function component and we can address it then
    const currentCostCategory = costCategories.find(x => x.id === this.props.costCategoryId);

    return (
      <Page
        backLink={<BackLink route={backLink}>Back to claim</BackLink>}
        pageTitle={<Title {...project} heading={currentCostCategory?.name} />}
      >
        <Section>
          <ClaimLineItemsTable
            lineItems={claimDetails.lineItems}
            forecastDetail={forecastDetail}
            content={this.props.content}
          />
        </Section>
        {this.getSupportingDocumentsSection(project.competitionType, documents, claimDetails)}
        {this.renderNavigationArrows(costCategories, project, partner, claim)}
      </Page>
    );
  }

  private getSupportingDocumentsSection(
    competitionType: string,
    documents: DocumentSummaryDto[],
    claimDetails: ClaimDetailsDto,
  ) {
    const { content } = this.props;
    const { isKTP } = checkProjectCompetition(competitionType);

    // Note: KTP projects submit evidence on the whole claim, not each cost category.
    const displaySupportingDocs = !isKTP;

    return (
      displaySupportingDocs && (
        <>
          <Section qa="supporting-documents-section" title={content.supportingDocumentsTitle}>
            <DocumentView hideHeader qa="claim-line-item-documents" documents={documents} />
          </Section>

          {this.renderAdditionalInformation(claimDetails)}
        </>
      )
    );
  }

  // TODO - this is something which we do in at least two places so should be generic
  private filterOverheads(costCategoryName: string, overheadRate: number): boolean {
    return !(costCategoryName === "Overheads" && overheadRate <= this.props.config.options.standardOverheadRate);
  }

  private getLinks(
    costCategories: CostCategoryDto[],
    project: ProjectDto,
    partner: PartnerDto,
    overheadRate: number,
    pages: { getLink: (params: ClaimLineItemsParams) => ILinkInfo },
  ) {
    const periodId = this.props.periodId;
    const costCategoriesToUse = costCategories
      .filter(x => x.competitionType === project.competitionType && x.organisationType === partner.organisationType)
      .filter(x => this.filterOverheads(x.name, overheadRate));

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

    const createCostCategoryLink = (costCategory: CostCategoryDto | null) =>
      costCategory
        ? {
            label: costCategory.name,
            route: pages.getLink({
              partnerId: partner.id,
              projectId: project.id,
              periodId,
              costCategoryId: costCategory.id,
            }),
          }
        : null;

    const previousLink = createCostCategoryLink(previousCostCategory);
    const nextLink = createCostCategoryLink(nextCostCategory);

    return {
      previousLink,
      nextLink,
    };
  }

  private readonly renderNavigationArrows = (
    costCategories: CostCategoryDto[],
    project: ProjectDto,
    partner: PartnerDto,
    claim: ClaimDto,
  ) => {
    const route =
      this.props.currentRoute.routeName === ReviewClaimLineItemsRoute.routeName
        ? ReviewClaimLineItemsRoute
        : ClaimLineItemsRoute;

    const navigationLinks = this.getLinks(costCategories, project, partner, claim.overheadRate, route);

    if (navigationLinks === null) return null;

    return navigationLinks ? <NavigationArrows {...navigationLinks} /> : null;
  };

  private readonly renderAdditionalInformation = (claimDetail: ClaimDetailsDto) => {
    if (!claimDetail.comments) return null;

    return (
      <Section title={this.props.content.additionalInfoTitle} qa="additional-information">
        <SimpleString>{claimDetail.comments}</SimpleString>
      </Section>
    );
  };
}

const ClaimLineItemsTable = ({
  lineItems,
  forecastDetail,
  content,
}: {
  lineItems: ClaimLineItemDto[];
  forecastDetail: ForecastDetailsDTO;
  content: Record<string, string>;
}) => {
  const renderFooterRow = (row: {
    key: string;
    title: string;
    value: React.ReactNode;
    qa: string;
    isBold?: boolean;
  }) => (
    <tr key={row.key} className="govuk-table__row" data-qa={row.qa}>
      <th className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">{row.title}</th>
      <td
        className={classNames("govuk-table__cell", "govuk-table__cell--numeric", {
          "govuk-!-font-weight-bold": row.isBold,
        })}
      >
        {row.value}
      </td>
      <th className="govuk-table__cell">
        <AccessibilityText>{content.noDataMessage}</AccessibilityText>
      </th>
    </tr>
  );

  const total: number = sumBy(lineItems, item => item.value);

  const forecast = forecastDetail.value;
  const diff = diffAsPercentage(forecast, total);

  return (
    <LineItemTable.Table
      data={lineItems}
      qa="current-claim-summary-table"
      footers={[
        renderFooterRow({
          key: "1",
          title: content.totalCostTitle,
          qa: "footer-total-costs",
          isBold: true,
          value: <Currency value={total} />,
        }),
        renderFooterRow({
          key: "2",
          title: content.forecastCostTitle,
          qa: "footer-forecast-costs",
          value: <Currency value={forecast} />,
        }),
        renderFooterRow({
          key: "3",
          title: content.differenceTitle,
          qa: "footer-difference",
          value: <Percentage value={diff} />,
        }),
      ]}
    >
      <LineItemTable.String header={content.descriptionHeader} qa="cost-description" value={x => x.description} />
      <LineItemTable.Currency header={content.costHeader} qa="cost-value" value={x => x.value} />
      <LineItemTable.ShortDate
        colClassName={() => "govuk-table__header--numeric"}
        header={content.lastUpdatedHeader}
        qa="cost-last-updated"
        value={x => x.lastModifiedDate}
      />
    </LineItemTable.Table>
  );
};

/**
 * ### useClaimLineItemsContent
 *
 * hook returns content used in ClaimLineItems component
 */
export function useClaimLineItemsContent() {
  const { getContent } = useContent();

  const supportingDocumentsTitle = getContent(x => x.pages.claimLineItems.supportingDocumentsTitle);
  const additionalInfoTitle = getContent(x => x.pages.claimLineItems.additionalInfoTitle);
  const totalCostTitle = getContent(x => x.pages.claimLineItems.totalCostTitle);
  const forecastCostTitle = getContent(x => x.pages.claimLineItems.forecastCostTitle);
  const differenceTitle = getContent(x => x.pages.claimLineItems.differenceTitle);
  const descriptionHeader = getContent(x => x.pages.claimLineItems.descriptionHeader);
  const costHeader = getContent(x => x.pages.claimLineItems.costHeader);
  const lastUpdatedHeader = getContent(x => x.pages.claimLineItems.lastUpdatedHeader);
  const noDataMessage = getContent(x => x.pages.claimLineItems.noDataMessage);

  return {
    supportingDocumentsTitle,
    additionalInfoTitle,
    totalCostTitle,
    forecastCostTitle,
    differenceTitle,
    descriptionHeader,
    costHeader,
    lastUpdatedHeader,
    noDataMessage,
  };
}

const ClaimLineItemsContainer = (props: ClaimLineItemsParams & BaseProps) => {
  const claimLineItemsContent = useClaimLineItemsContent();
  const stores = useStores();

  return (
    <ClaimLineItemsComponent
      {...props}
      content={claimLineItemsContent}
      project={stores.projects.getById(props.projectId)}
      partner={stores.partners.getById(props.partnerId)}
      claimDetails={stores.claimDetails.get(props.projectId, props.partnerId, props.periodId, props.costCategoryId)}
      costCategories={stores.costCategories.getAllFiltered(props.partnerId)}
      forecastDetail={stores.forecastDetails.get(props.partnerId, props.periodId, props.costCategoryId)}
      claim={stores.claims.get(props.partnerId, props.periodId)}
      documents={stores.claimDetailDocuments.getClaimDetailDocuments(
        props.projectId,
        props.partnerId,
        props.periodId,
        props.costCategoryId,
      )}
    />
  );
};

const getParams = (route: RouteState): ClaimLineItemsParams => ({
  projectId: route.params.projectId as ProjectId,
  partnerId: route.params.partnerId as PartnerId,
  costCategoryId: route.params.costCategoryId,
  periodId: parseInt(route.params.periodId, 10) as PeriodId,
});

export const ClaimLineItemsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "claimLineItemsView",
  routePath: "/projects/:projectId/claims/:partnerId/details/:periodId/costs/:costCategoryId",
  container: ClaimLineItemsContainer,
  getParams: route => getParams(route),
  getTitle: ({ params, stores }) => {
    const costCatName = stores.costCategories.get(params.costCategoryId).then(x => x.name).data;
    return {
      htmlTitle: costCatName ? `View costs for ${costCatName}` : "View costs",
      displayTitle: costCatName || "Line items",
    };
  },
});

export const ReviewClaimLineItemsRoute = defineRoute({
  routeName: "claimLineItemsReview",
  routePath: "/projects/:projectId/claims/:partnerId/review/:periodId/costs/:costCategoryId",
  container: ClaimLineItemsContainer,
  getParams: route => getParams(route),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager) ||
    auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: ({ params, stores }) => {
    const costCatName = stores.costCategories.get(params.costCategoryId).then(x => x.name).data;
    return {
      htmlTitle: costCatName ? `Review costs for ${costCatName}` : "Review costs",
      displayTitle: costCatName || "Costs",
    };
  },
});
