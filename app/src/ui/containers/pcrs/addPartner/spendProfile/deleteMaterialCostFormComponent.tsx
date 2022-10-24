import * as ACC from "@ui/components";
import { PCRSpendProfileMaterialsCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { SpendProfileDeleteFormProps } from "@ui/containers";

export const DeleteMaterialsCostFormComponent = (
  props: SpendProfileDeleteFormProps<PCRSpendProfileMaterialsCostDto>,
) => {
  const { data, costCategory } = props;
  return (
    <ACC.Section
      title={x => x.pages.pcrSpendProfileDeleteCost.sectionTitleCost({ costCategoryName: costCategory.name })}
    >
      <ACC.ValidationMessage messageType="alert" message={x => x.pages.pcrSpendProfileDeleteCost.guidanceDelete} />
      <ACC.SummaryList qa="deleteMaterialsCost">
        <ACC.SummaryListItem label={x => x.pcrSpendProfileLabels.materials.item} content={data.description} qa="item" />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.materials.quantity}
          content={data.quantity}
          qa="quantity"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.materials.costPerItem}
          content={<ACC.Renderers.Currency value={data.costPerItem} />}
          qa="costPerItem"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.materials.totalCost}
          content={<ACC.Renderers.Currency value={data.value} />}
          qa="totalCost"
        />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
