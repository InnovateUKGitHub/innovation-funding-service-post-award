import * as ACC from "@ui/components";
import { PCRSpendProfileSubcontractingCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { SpendProfileDeleteFormProps } from "@ui/containers";

export const DeleteSubcontractingCostFormComponent = (
  props: SpendProfileDeleteFormProps<PCRSpendProfileSubcontractingCostDto>,
) => {
  const { data, costCategory } = props;
  return (
    <ACC.Section
      title={x => x.pages.pcrSpendProfileDeleteCost.sectionTitleCost({ costCategoryName: costCategory.name })}
    >
      <ACC.ValidationMessage messageType="alert" message={x => x.pages.pcrSpendProfileDeleteCost.guidanceDelete} />
      <ACC.SummaryList qa="deleteSubcontractingCost">
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.subcontracting.subcontractorName}
          content={data.description}
          qa="description"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.subcontracting.subcontractorCountry}
          content={data.subcontractorCountry}
          qa="subcontractorCountry"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.subcontracting.subcontractorRoleAndDescription}
          content={data.subcontractorRoleAndDescription}
          qa="subcontractorRoleAndDescription"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.subcontracting.cost}
          content={<ACC.Renderers.Currency value={data.value} />}
          qa="value"
        />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
