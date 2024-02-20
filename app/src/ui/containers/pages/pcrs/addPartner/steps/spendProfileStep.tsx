import { CostCategoryType } from "@framework/constants/enums";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useNextLink, useSummaryLink } from "../../utils/useNextLink";
import { useContent } from "@ui/hooks/content.hook";
import { PcrPage } from "../../pcrPage";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { TBody, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { useMemo } from "react";
import { SpendProfile } from "@gql/dtoMapper/mapPcrSpendProfile";
import { sumBy } from "lodash";
import { TableEmptyCell } from "@ui/components/atomicDesign/atoms/table/TableEmptyCell/TableEmptyCell";

export const SpendProfileStep = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, mode } = usePcrWorkflowContext();

  const { spendProfileCostCategories, pcrSpendProfile } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const data = useMemo(() => {
    const spendProfile = new SpendProfile(itemId).getSpendProfile(pcrSpendProfile, spendProfileCostCategories);

    const costCategories = spendProfileCostCategories.map(costCategory => ({
      ...costCategory,
      cost: spendProfile.costs
        .filter(y => y.costCategoryId === costCategory.id)
        .reduce((t, v) => t + (v.value || 0), 0),
    }));
    return {
      overheadsCostId: spendProfile.costs.find(x => x.costCategory === CostCategoryType.Overheads)?.id ?? null,
      costCategories,
      total: sumBy(costCategories, "cost"),
    };
  }, []);

  const nextLink = useNextLink();
  const summaryLink = useSummaryLink();

  return (
    <PcrPage>
      <Section>
        <H2>{getContent(x => x.pcrAddPartnerLabels.projectCostsHeading)}</H2>
        <Section>
          <Table>
            <THead>
              <TR>
                <TH>{getContent(x => x.pages.pcrAddPartnerSpendProfile.categoryHeading)}</TH>
                <TH numeric>{getContent(x => x.pages.pcrAddPartnerSpendProfile.costHeading)}</TH>
                <TH>
                  <TableEmptyCell />
                </TH>
              </TR>
            </THead>

            <TBody>
              {data.costCategories.map(x => (
                <TR key={x.name}>
                  <TD>{x.name}</TD>
                  <TD numeric>
                    <Currency value={x.cost} />
                  </TD>
                  <TD>
                    <LinkToCostSummary
                      overheadCostId={data.overheadsCostId}
                      costCategoryId={x.id}
                      costCategoryType={x.type}
                    />
                  </TD>
                </TR>
              ))}
            </TBody>
            <TFoot>
              <TR>
                <TH>{getContent(x => x.pages.pcrAddPartnerSpendProfile.totalCosts)}</TH>
                <TH numeric>
                  <Currency value={data.total} />
                </TH>
                <TH>
                  <TableEmptyCell />
                </TH>
              </TR>
            </TFoot>
          </Table>
        </Section>

        <Section>
          {mode === "review" ? (
            <Link route={summaryLink} styling="SecondaryButton">
              {getContent(x => x.pcrItem.returnToSummaryButton)}
            </Link>
          ) : (
            <>
              <Link route={nextLink} styling="PrimaryButton">
                {getContent(x => x.pcrItem.submitButton)}
              </Link>

              <Link route={summaryLink} styling="SecondaryButton">
                {getContent(x => x.pcrItem.saveAndReturnToSummaryButton)}
              </Link>
            </>
          )}
        </Section>
      </Section>
    </PcrPage>
  );
};

const LinkToCostSummary = ({
  costCategoryType,
  costCategoryId,
  overheadCostId,
}: {
  costCategoryType: CostCategoryType;
  costCategoryId: CostCategoryId;
  overheadCostId: PcrId | null;
}) => {
  const { mode, routes, itemId, pcrId, projectId } = usePcrWorkflowContext();

  // If in review, render view summary links for all cost categories except overheads
  if (mode === "review") {
    if (costCategoryType === CostCategoryType.Overheads) {
      return null;
    }
    return (
      <Link
        route={routes.pcrSpendProfileReviewCostsSummary.getLink({
          itemId,
          pcrId,
          projectId,
          costCategoryId,
        })}
      >
        <Content value={x => x.pages.pcrAddPartnerSpendProfile.labelView} />
      </Link>
    );
  }
  // For all other cost categories go to the summary page
  if (costCategoryType !== CostCategoryType.Overheads) {
    return (
      <Link
        route={routes.pcrSpendProfileCostsSummary.getLink({
          itemId,
          pcrId,
          projectId,
          costCategoryId,
        })}
      >
        <Content value={x => x.pages.pcrAddPartnerSpendProfile.labelEdit} />
      </Link>
    );
  }

  // For overheads as there is only one cost, go straight to the cost form
  if (overheadCostId) {
    return (
      <Link
        route={routes.pcrPrepareSpendProfileEditCost.getLink({
          itemId,
          pcrId,
          projectId,
          costCategoryId,
          costId: overheadCostId,
        })}
      >
        <Content value={x => x.pages.pcrAddPartnerSpendProfile.labelEdit} />
      </Link>
    );
  }

  return (
    <Link
      route={routes.pcrPrepareSpendProfileAddCost.getLink({
        itemId,
        pcrId,
        projectId,
        costCategoryId,
      })}
    >
      <Content value={x => x.pages.pcrAddPartnerSpendProfile.labelEdit} />
    </Link>
  );
};
