import { Currency } from "@ui/components/atoms/Currency/currency";
import { useMounted } from "@ui/context/Mounted";

import { SpendProfileContext } from "./spendProfileCosts.logic";
import { FieldErrors, useForm } from "react-hook-form";
import { errorMap, MaterialsSchema, materialsSchema, MaterialsSchemaType } from "./spendProfile.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContent } from "@ui/hooks/content.hook";
import { SpendProfilePreparePage } from "./spendProfilePageComponent";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { TextInput } from "@ui/components/atoms/form/TextInput/TextInput";
import { NumberInput } from "@ui/components/atoms/form/NumberInput/NumberInput";
import { Section } from "@ui/components/atoms/Section/Section";
import { H3 } from "@ui/components/atoms/Heading/Heading.variants";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { useContext } from "react";
import {
  MaybeNewCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileMaterialsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { isObject } from "lodash";
import { Field } from "@ui/components/molecules/form/Field/Field";
import { parseCurrency } from "@framework/util/numberHelper";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { FormTypes } from "@ui/zod/FormTypes";
import { useOnUpdateMaterials } from "./materials.logic";
import { z, ZodError } from "zod";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";

const isMaterialsCostDto = function (
  cost: PCRSpendProfileCostDto | null | undefined,
): cost is PCRSpendProfileMaterialsCostDto {
  return isObject(cost) && ["id", "description", "quantity", "costPerItem"].every(x => x in cost);
};

type MaterialsFieldErrors = FieldErrors<z.output<MaterialsSchemaType>>;

const isTotalCostError = (
  errors: MaterialsFieldErrors | (MaterialsFieldErrors & { totalCost: ZodError }),
): errors is MaterialsFieldErrors & { totalCost: ZodError } => "totalCost" in errors;

export const MaterialsFormComponent = () => {
  const { cost, costCategory, routes, pcrId, projectId, itemId, costCategoryId, addNewItem } =
    useContext(SpendProfileContext);
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

  const { handleSubmit, watch, formState, register, setError, trigger } = useForm<MaterialsSchema>({
    defaultValues: {
      id: defaultCost.id,
      materialsDescription: defaultCost.description ?? "",
      quantityOfMaterialItems: defaultCost.quantity ?? undefined,
      costPerItem: String(defaultCost.costPerItem ?? ""),
      form: FormTypes.PcrAddPartnerProjectCostMaterials,
      costCategoryType: costCategory.type,
      costCategoryId,
    },
    resolver: zodResolver(materialsSchema, {
      errorMap,
    }),
  });

  const { getContent } = useContent();

  const totalCost = Number(watch("quantityOfMaterialItems") ?? 0) * parseCurrency(watch("costPerItem") ?? 0);

  const validationErrors = useZodErrors(setError, formState?.errors) as ValidationErrorType<MaterialsSchema>;

  const { apiError, isFetching, onUpdate } = useOnUpdateMaterials();

  useFormRevalidate(watch, trigger);
  return (
    <SpendProfilePreparePage validationErrors={validationErrors} apiError={apiError}>
      <Form
        onSubmit={handleSubmit(data =>
          onUpdate({
            data,
            context: { link: routes.pcrSpendProfileCostsSummary.getLink({ projectId, pcrId, itemId, costCategoryId }) },
          }),
        )}
      >
        <Fieldset data-qa="materials-costs">
          <input type="hidden" name="form" value={FormTypes.PcrAddPartnerProjectCostMaterials} />
          <input type="hidden" name="id" value={cost?.id} />
          <input type="hidden" name="costCategoryType" value={costCategory.type} />
          <input type="hidden" name="costCategoryId" value={costCategoryId} />
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
            <FormGroup hasError={isTotalCostError(formState.errors)}>
              <H3>{getContent(x => x.pcrSpendProfileLabels.materials.totalCost)}</H3>
              {isTotalCostError(formState.errors) && (
                <ValidationError
                  id="error-for-total-cost"
                  data-qa="error-for-total-cost"
                  error={formState.errors.totalCost}
                />
              )}
              <P>
                <Currency value={totalCost} />
              </P>
            </FormGroup>
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
