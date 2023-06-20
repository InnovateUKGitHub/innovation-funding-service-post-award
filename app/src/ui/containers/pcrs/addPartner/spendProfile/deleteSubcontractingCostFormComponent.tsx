import { PCRSpendProfileSubcontractingCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { Section } from "@ui/components/layout/section";
import { Currency } from "@ui/components/renderers/currency";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { ValidationMessage } from "@ui/components/validationMessage";
import { SpendProfileDeleteFormProps } from "./spendProfileDeleteCost.page";

export const DeleteSubcontractingCostFormComponent = (
  props: SpendProfileDeleteFormProps<PCRSpendProfileSubcontractingCostDto>,
) => {
  const { data, costCategory } = props;
  return (
    <Section title={x => x.pages.pcrSpendProfileDeleteCost.sectionTitleCost({ costCategoryName: costCategory.name })}>
      <ValidationMessage messageType="alert" message={x => x.pages.pcrSpendProfileDeleteCost.guidanceDelete} />
      <SummaryList qa="deleteSubcontractingCost">
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.subcontracting.subcontractorName}
          content={data.description}
          qa="description"
        />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.subcontracting.subcontractorCountry}
          content={data.subcontractorCountry}
          qa="subcontractorCountry"
        />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.subcontracting.subcontractorRoleAndDescription}
          content={data.subcontractorRoleAndDescription}
          qa="subcontractorRoleAndDescription"
        />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.subcontracting.cost}
          content={<Currency value={data.value} />}
          qa="value"
        />
      </SummaryList>
    </Section>
  );
};
