import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { useMounted } from "@ui/context/Mounted";

import { SpendProfileContext, appendOrMerge } from "./spendProfileCosts.logic";
import { useForm } from "react-hook-form";
import { errorMap, MaterialsSchema, materialsSchema } from "./spendProfile.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContent } from "@ui/hooks/content.hook";
import { SpendProfilePreparePage } from "./spendProfilePageComponent";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { H3 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useContext } from "react";
import {
  MaybeNewCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileMaterialsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { isObject } from "lodash";
import { Field } from "@ui/components/atomicDesign/molecules/form/Field/Field";
import { parseCurrency } from "@framework/util/numberHelper";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { FormTypes } from "@ui/zod/FormTypes";

const isMaterialsCostDto = function (
  cost: PCRSpendProfileCostDto | null | undefined,
): cost is PCRSpendProfileMaterialsCostDto {
  return isObject(cost) && ["id", "description", "quantity", "costPerItem"].every(x => x in cost);
};

export const MaterialsFormComponent = () => {
  const {
    cost,
    isFetching,
    costCategory,
    onUpdate,
    routes,
    pcrId,
    projectId,
    itemId,
    costCategoryId,
    spendProfile,
    addNewItem,
  } = useContext(SpendProfileContext);
  const { isClient } = useMounted();

  let defaultCost: MaybeNewCostDto<PCRSpendProfileMaterialsCostDto>;

  if (addNewItem) {
    defaultCost = {
      id: null,
      description: null,
      quantity: null,
      costPerItem: null,
      value: null,
      costCategoryId,
      costCategory: costCategory.type,
    };
  } else if (isMaterialsCostDto(cost)) {
    defaultCost = cost;
  } else {
    throw Error("Invalid cost dto");
  }

  const { handleSubmit, watch, formState, register, setError } = useForm<MaterialsSchema>({
    defaultValues: {
      id: defaultCost.id,
      materialsDescription: defaultCost.description ?? "",
      quantityOfMaterialItems: defaultCost.quantity ?? undefined,
      costPerItem: String(defaultCost.costPerItem ?? ""),
      form: FormTypes.PcrAddPartnerSpendProfileMaterialsCost,
      costCategoryType: costCategory.type,
    },
    resolver: zodResolver(materialsSchema, {
      errorMap,
    }),
  });

  const { getContent } = useContent();

  const totalCost = Number(watch("quantityOfMaterialItems") ?? 0) * parseCurrency(watch("costPerItem") ?? 0);

  const validationErrors = useZodErrors(setError, formState?.errors) as ValidationErrorType<MaterialsSchema>;

  return (
    <SpendProfilePreparePage validationErrors={validationErrors}>
      <Form
        onSubmit={handleSubmit(data =>
          onUpdate({
            data: {
              spendProfile: {
                ...spendProfile,
                costs: appendOrMerge(spendProfile.costs, {
                  description: data?.materialsDescription,
                  id: data.id ?? ("" as CostId),
                  costCategoryId,
                  costCategory: costCategory.type,
                  quantity: Number(data.quantityOfMaterialItems),
                  costPerItem: parseCurrency(data.costPerItem),
                  value: totalCost,
                }),
              },
            },
            context: { link: routes.pcrSpendProfileCostsSummary.getLink({ projectId, pcrId, itemId, costCategoryId }) },
          }),
        )}
      >
        <Fieldset data-qa="materials-costs">
          <input type="hidden" name="form" value={FormTypes.PcrAddPartnerSpendProfileMaterialsCost} />
          <input type="hidden" name="id" value={cost?.id} />
          <input type="hidden" name="costCategoryType" value={costCategory.type} />
          <Field
            error={validationErrors?.materialsDescription}
            id="materialsDescription"
            label={getContent(x => x.pcrSpendProfileLabels.materials.item)}
          >
            <TextInput
              inputWidth="one-third"
              {...register("materialsDescription")}
              disabled={isFetching}
              defaultValue={String(defaultCost.description ?? "")}
            />
          </Field>

          <Field
            error={validationErrors?.quantityOfMaterialItems}
            id="quantity"
            label={getContent(x => x.pcrSpendProfileLabels.materials.quantity)}
          >
            <NumberInput
              inputWidth="one-third"
              {...register("quantityOfMaterialItems")}
              disabled={isFetching}
              defaultValue={String(defaultCost.quantity ?? "")}
            />
          </Field>

          <Field
            error={validationErrors.costPerItem}
            label={getContent(x => x.pcrSpendProfileLabels.materials.costPerItem)}
            id="costPerItem"
          >
            <NumberInput
              inputWidth="one-third"
              {...register("costPerItem")}
              disabled={isFetching}
              prefix={getContent(x => x.forms.prefix.gbp)}
              defaultValue={String(defaultCost.costPerItem ?? "")}
            />
          </Field>
        </Fieldset>

        {isClient && (
          <Section>
            <H3>{getContent(x => x.pcrSpendProfileLabels.materials.totalCost)}</H3>
            <P>
              <Currency value={totalCost} />
            </P>
          </Section>
        )}

        <Fieldset>
          <Button type="submit" disabled={isFetching}>
            {getContent(x => x.pages.pcrSpendProfilePrepareCost.buttonSubmit({ costCategoryName: costCategory.name }))}
          </Button>
        </Fieldset>
      </Form>
    </SpendProfilePreparePage>
  );
};
