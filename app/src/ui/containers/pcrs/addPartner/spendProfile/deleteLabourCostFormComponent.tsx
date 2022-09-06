import * as ACC from "@ui/components";
import { PCRSpendProfileLabourCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { SpendProfileDeleteFormProps } from "@ui/containers";

export const DeleteLabourCostFormComponent = (props: SpendProfileDeleteFormProps<PCRSpendProfileLabourCostDto>) => {
  const { data, costCategory } = props;
  return (
    <ACC.Section title={x => x.pcrSpendProfileDeleteCostContent.costSectionTitle(costCategory.name)}>
      <ACC.ValidationMessage messageType="alert" message={x => x.pcrSpendProfileDeleteCostContent.deleteGuidance} />
      <ACC.SummaryList qa="deleteLabourCost">
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileDeleteCostContent.labels.labour.role}
          content={data.description}
          qa="roleWithinProject"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileDeleteCostContent.labels.labour.grossCost}
          content={<ACC.Renderers.Currency value={data.grossCostOfRole} />}
          qa="grossCostOfRole"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileDeleteCostContent.labels.labour.rate}
          content={<ACC.Renderers.Currency value={data.ratePerDay} />}
          qa="ratePerDay"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileDeleteCostContent.labels.labour.daysOnProject}
          content={data.daysSpentOnProject}
          qa="daysSpentOnProject"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileDeleteCostContent.labels.labour.totalCost}
          content={<ACC.Renderers.Currency value={data.value} />}
          qa="totalCost"
        />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
