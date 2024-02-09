import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../../pcrItemWorkflowMigrated";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { PcrPage } from "../../pcrPage";
import { TBody, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { sum } from "lodash";
import { SpendProfile } from "@gql/dtoMapper/mapPcrSpendProfile";

export const AcademicCostsReviewStep = () => {
  const { getContent } = useContent();
  const { projectId, pcrId, itemId, fetchKey, routes } = usePcrWorkflowContext();

  const { pcrItem, academicCostCategories, pcrSpendProfile } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const spendProfile = new SpendProfile(itemId).getSpendProfile(pcrSpendProfile, academicCostCategories);

  const costs = academicCostCategories.map(
    costCat => spendProfile.costs.find(x => x.costCategoryId === costCat.id)?.value ?? 0,
  );

  const total = sum(costs);

  return (
    <PcrPage>
      <Section title={x => x.pcrAddPartnerLabels.projectCostsHeading}>
        <Section title={x => x.pcrAddPartnerLabels.tsbReferenceHeading}>
          <SimpleString qa="tsbReference">{pcrItem.tsbReference}</SimpleString>
        </Section>

        <Section title={x => x.pages.pcrAddPartnerAcademicCosts.costsSectionTitle}>
          <Table>
            <THead>
              <TR>
                <TH>{getContent(x => x.pages.pcrAddPartnerAcademicCosts.categoryHeading)}</TH>
                <TH className="govuk-table__header--numeric">
                  {getContent(x => x.pages.pcrAddPartnerAcademicCosts.costHeading)}
                </TH>
              </TR>
            </THead>
            <TBody>
              {academicCostCategories.map((x, i) => (
                <TR key={x.name}>
                  <TD>
                    <P>{x.name}</P>
                  </TD>
                  <TD>
                    <P>{costs[i]}</P>
                  </TD>
                </TR>
              ))}
            </TBody>

            <TFoot>
              <TR>
                <TD>
                  <P bold className="govuk-body">
                    {getContent(x => x.pages.pcrAddPartnerAcademicCosts.totalCosts)}
                  </P>
                </TD>
                <TD className="govuk-table__header--numeric">
                  <P bold>
                    <Currency value={total} />
                  </P>
                </TD>
              </TR>
            </TFoot>
          </Table>
        </Section>

        <Link
          styling="SecondaryButton"
          route={routes.pcrReviewItem.getLink({
            itemId,
            pcrId,
            projectId,
          })}
        >
          {getContent(x => x.pcrItem.saveAndReturnToSummaryButton)}
        </Link>
      </Section>
    </PcrPage>
  );
};
