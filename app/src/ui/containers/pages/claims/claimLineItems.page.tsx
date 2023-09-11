import classNames from "classnames";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { useContent } from "@ui/hooks/content.hook";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { diffAsPercentage, sumBy } from "@framework/util/numberHelper";
import { BaseProps, defineRoute, RouteState } from "@ui/containers/containerBase";
import { DocumentView } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { NavigationArrows } from "@ui/components/atomicDesign/molecules/NavigationArrows/navigationArrows";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { AccessibilityText } from "@ui/components/atomicDesign/atoms/AccessibilityText/AccessibilityText";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { Percentage } from "@ui/components/atomicDesign/atoms/Percentage/percentage";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { ProjectRole } from "@framework/constants/project";
import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { ClaimLineItemDto } from "@framework/dtos/claimLineItemDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { useClaimLineItemsData } from "./claimLineItems.logic";

interface ClaimLineItemsParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  costCategoryId: CostCategoryId;
  periodId: PeriodId;
}

interface Data {
  project: Pick<ProjectDto, "title" | "projectNumber" | "competitionType" | "id">;
  partner: Pick<PartnerDto, "id" | "organisationType" | "overheadRate">;
  claimDetails: Pick<ClaimDetailsDto, "comments"> & {
    lineItems: Pick<ClaimLineItemDto, "description" | "value" | "lastModifiedDate">[];
  };
  costCategories: Pick<CostCategoryDto, "id" | "name" | "competitionType" | "organisationType">[];
  forecastDetail: Pick<ForecastDetailsDTO, "value">;
  documents: DocumentSummaryDto[];
  content: Record<string, string>;
}

const LineItemTable = createTypedTable<Pick<ClaimLineItemDto, "description" | "value" | "lastModifiedDate">>();

export const ClaimLineItemsPage = (props: BaseProps & ClaimLineItemsParams) => {
  const content = useClaimLineItemsContent();
  const { project, partner, claimDetails, costCategories, forecastDetail, documents } = useClaimLineItemsData(
    props.projectId,
    props.partnerId,
    props.periodId,
    props.costCategoryId,
  );

  const params: ClaimLineItemsParams = {
    partnerId: props.partnerId,
    costCategoryId: props.costCategoryId,
    periodId: props.periodId,
    projectId: props.projectId,
  };

  const backLink =
    props.currentRoute.routeName === ReviewClaimLineItemsRoute.routeName
      ? props.routes.reviewClaim.getLink(params)
      : props.routes.claimDetails.getLink(params);

  const currentCostCategory = costCategories.find(x => x.id === params.costCategoryId);

  return (
    <Page
      backLink={<BackLink route={backLink}>Back to claim</BackLink>}
      pageTitle={
        <Title title={project.title} projectNumber={project.projectNumber} heading={currentCostCategory?.name} />
      }
    >
      <Section>
        <ClaimLineItemsTable lineItems={claimDetails.lineItems} forecastDetail={forecastDetail} content={content} />
      </Section>
      {getSupportingDocumentsSection(project.competitionType, documents, claimDetails, content)}
      {renderNavigationArrows(
        costCategories,
        project,
        partner,
        props.currentRoute.routeName,
        params,
        props.config.options.standardOverheadRate,
      )}
    </Page>
  );
};

const ClaimLineItemsTable = ({
  lineItems,
  forecastDetail,
  content,
}: {
  lineItems: Pick<ClaimLineItemDto, "description" | "value" | "lastModifiedDate">[];
  forecastDetail: Data["forecastDetail"];
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

const getSupportingDocumentsSection = (
  competitionType: string,
  documents: Data["documents"],
  claimDetails: Data["claimDetails"],
  content: Record<string, string>,
) => {
  const { isKTP } = checkProjectCompetition(competitionType);

  // Note: KTP projects submit evidence on the whole claim, not each cost category.
  const displaySupportingDocs = !isKTP;

  return (
    displaySupportingDocs && (
      <>
        <Section qa="supporting-documents-section" title={content.supportingDocumentsTitle}>
          <DocumentView hideHeader qa="claim-line-item-documents" documents={documents} />
        </Section>

        {renderAdditionalInformation(claimDetails, content)}
      </>
    )
  );
};

const renderAdditionalInformation = (claimDetail: Data["claimDetails"], content: Record<string, string>) => {
  if (!claimDetail.comments) return null;

  return (
    <Section title={content.additionalInfoTitle} qa="additional-information">
      <SimpleString>{claimDetail.comments}</SimpleString>
    </Section>
  );
};

const renderNavigationArrows = (
  costCategories: Data["costCategories"],
  project: Data["project"],
  partner: Data["partner"],
  routeName: string,
  params: ClaimLineItemsParams,
  standardOverheadRate: number,
) => {
  const route = routeName === ReviewClaimLineItemsRoute.routeName ? ReviewClaimLineItemsRoute : ClaimLineItemsRoute;

  const navigationLinks = getLinks(
    costCategories,
    project,
    partner,
    partner?.overheadRate ?? 0,
    route,
    params,
    standardOverheadRate,
  );

  if (navigationLinks === null) return null;

  return navigationLinks ? <NavigationArrows {...navigationLinks} /> : null;
};

const getLinks = (
  costCategories: Data["costCategories"],
  project: Data["project"],
  partner: Data["partner"],
  overheadRate: number,
  pages: { getLink: (params: ClaimLineItemsParams) => ILinkInfo },
  params: ClaimLineItemsParams,
  standardOverheadRate: number,
) => {
  const periodId = params.periodId;
  const costCategoriesToUse = costCategories
    .filter(x => x.competitionType === project.competitionType && x.organisationType === partner.organisationType)
    .filter(x => filterOverheads(x.name, overheadRate, standardOverheadRate));

  const currentCostCategory = costCategoriesToUse.find(x => x.id === params.costCategoryId);
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

  const createCostCategoryLink = (costCategory: Pick<CostCategoryDto, "name" | "id"> | null) =>
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
};

const filterOverheads = (costCategoryName: string, overheadRate: number, standardOverheadRate: number): boolean => {
  return !(costCategoryName === "Overheads" && overheadRate <= standardOverheadRate);
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

const getParams = (route: RouteState): ClaimLineItemsParams => ({
  projectId: route.params.projectId as ProjectId,
  partnerId: route.params.partnerId as PartnerId,
  costCategoryId: route.params.costCategoryId as CostCategoryId,
  periodId: parseInt(route.params.periodId, 10) as PeriodId,
});

export const ClaimLineItemsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "claimLineItemsView",
  routePath: "/projects/:projectId/claims/:partnerId/details/:periodId/costs/:costCategoryId",
  container: ClaimLineItemsPage,
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
  container: ClaimLineItemsPage,
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
