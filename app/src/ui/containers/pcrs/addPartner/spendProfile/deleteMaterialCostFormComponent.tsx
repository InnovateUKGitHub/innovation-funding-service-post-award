import { PCRSpendProfileMaterialsCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { Section } from "@ui/components/layout/section";
import { Currency } from "@ui/components/renderers/currency";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { ValidationMessage } from "@ui/components/validationMessage";
import { SpendProfileDeleteFormProps } from "./spendProfileDeleteCost.page";

export const DeleteMaterialsCostFormComponent = (
  props: SpendProfileDeleteFormProps<PCRSpendProfileMaterialsCostDto>,
) => {
  const { data, costCategory } = props;
  return (
    <Section title={x => x.pages.pcrSpendProfileDeleteCost.sectionTitleCost({ costCategoryName: costCategory.name })}>
      <ValidationMessage messageType="alert" message={x => x.pages.pcrSpendProfileDeleteCost.guidanceDelete} />
      <SummaryList qa="deleteMaterialsCost">
        <SummaryListItem label={x => x.pcrSpendProfileLabels.materials.item} content={data.description} qa="item" />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.materials.quantity}
          content={data.quantity}
          qa="quantity"
        />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.materials.costPerItem}
          content={<Currency value={data.costPerItem} />}
          qa="costPerItem"
        />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.materials.totalCost}
          content={<Currency value={data.value} />}
          qa="totalCost"
        />
      </SummaryList>
    </Section>
  );
};
