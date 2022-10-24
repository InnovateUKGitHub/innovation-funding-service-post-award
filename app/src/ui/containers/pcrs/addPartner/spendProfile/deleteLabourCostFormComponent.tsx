import * as ACC from "@ui/components";
import { PCRSpendProfileLabourCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { SpendProfileDeleteFormProps } from "@ui/containers";

export const DeleteLabourCostFormComponent = (props: SpendProfileDeleteFormProps<PCRSpendProfileLabourCostDto>) => {
  const { data, costCategory } = props;
  return (
    <ACC.Section
      title={x => x.pages.pcrSpendProfileDeleteCost.sectionTitleCost({ costCategoryName: costCategory.name })}
    >
      <ACC.ValidationMessage messageType="alert" message={x => x.pages.pcrSpendProfileDeleteCost.guidanceDelete} />
      <ACC.SummaryList qa="deleteLabourCost">
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.labour.role}
          content={data.description}
          qa="roleWithinProject"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.labour.grossCost}
          content={<ACC.Renderers.Currency value={data.grossCostOfRole} />}
          qa="grossCostOfRole"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.labour.rate}
          content={<ACC.Renderers.Currency value={data.ratePerDay} />}
          qa="ratePerDay"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.labour.daysSpentOnProject}
          content={data.daysSpentOnProject}
          qa="daysSpentOnProject"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.labour.totalCost}
          content={<ACC.Renderers.Currency value={data.value} />}
          qa="totalCost"
        />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
