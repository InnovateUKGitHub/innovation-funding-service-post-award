import { useContext } from "react";
import { SpendProfileContext, appendOrMerge } from "./spendProfileCosts.logic";
import { useForm } from "react-hook-form";
import { OtherCostsSchema, otherCostsSchema, errorMap } from "./spendProfile.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContent } from "@ui/hooks/content.hook";
import { SpendProfilePreparePage } from "./spendProfilePageComponent";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { NumberInput } from "@ui/components/atoms/form/NumberInput/NumberInput";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { TextAreaField } from "@ui/components/molecules/form/TextFieldArea/TextAreaField";
import {
  MaybeNewCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileOtherCostsDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { isObject } from "lodash";
import { Field } from "@ui/components/molecules/form/Field/Field";
import { parseCurrency } from "@framework/util/numberHelper";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

const isOtherCostDto = function (
  cost: PCRSpendProfileCostDto | null | undefined,
): cost is PCRSpendProfileOtherCostsDto {
  return isObject(cost) && ["id", "description", "value"].every(x => x in cost);
};

export const OtherCostsFormComponent = () => {
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

  let defaultCost: MaybeNewCostDto<PCRSpendProfileOtherCostsDto>;

  if (addNewItem) {
    defaultCost = {
      id: null,
      description: null,
      value: null,
      costCategoryId,
      costCategory: costCategory.type,
    };
  } else if (isOtherCostDto(cost)) {
    defaultCost = cost;
  } else {
    throw Error("Invalid cost dto");
  }

  const { handleSubmit, watch, formState, register, setError } = useForm<OtherCostsSchema>({
    defaultValues: {
      id: defaultCost.id,
      descriptionOfCost: defaultCost?.description ?? "",
      estimatedCost: String(defaultCost?.value ?? ""),
      form: FormTypes.PcrAddPartnerSpendProfileOtherCost,
      costCategoryType: costCategory.type,
    },
    resolver: zodResolver(otherCostsSchema, {
      errorMap,
    }),
  });

  const { getContent } = useContent();

  const validationErrors = useZodErrors(setError, formState?.errors) as ValidationErrorType<OtherCostsSchema>;

  return (
    <SpendProfilePreparePage validationErrors={validationErrors}>
      <Form
        onSubmit={handleSubmit(data =>
          onUpdate({
            data: {
              spendProfile: {
                ...spendProfile,
                costs: appendOrMerge(spendProfile.costs, {
                  id: data.id ?? ("" as CostId),
                  description: data.descriptionOfCost,
                  costCategoryId,
                  costCategory: costCategory.type,
                  value: parseCurrency(data.estimatedCost),
                }),
              },
            },
            context: { link: routes.pcrSpendProfileCostsSummary.getLink({ projectId, pcrId, itemId, costCategoryId }) },
          }),
        )}
      >
        <Fieldset data-qa="other-costs">
          <input type="hidden" name="form" value={FormTypes.PcrAddPartnerSpendProfileOtherCost} />
          <input type="hidden" name="id" value={cost?.id} />
          <input type="hidden" name="costCategoryType" value={costCategory.type} />
          <FormGroup hasError={!!validationErrors.descriptionOfCost}>
            <TextAreaField
              {...register("descriptionOfCost")}
              id="description"
              error={validationErrors.descriptionOfCost}
              label={getContent(x => x.pcrSpendProfileLabels.otherCosts.description)}
              disabled={isFetching}
              characterCount={watch("descriptionOfCost")?.length ?? 0}
              characterCountType="ascending"
              defaultValue={String(defaultCost.description ?? "")}
            />
          </FormGroup>

          <Field
            error={validationErrors.estimatedCost}
            id="estimatedCost"
            label={getContent(x => x.pcrSpendProfileLabels.otherCosts.totalCost)}
          >
            <NumberInput
              inputWidth="one-quarter"
              {...register("estimatedCost")}
              disabled={isFetching}
              prefix={getContent(x => x.forms.prefix.gbp)}
              defaultValue={String(defaultCost.value ?? "")}
            />
          </Field>
        </Fieldset>

        <Fieldset>
          <Button type="submit" disabled={isFetching}>
            {getContent(x => x.pages.pcrSpendProfilePrepareCost.buttonSubmit({ costCategoryName: costCategory.name }))}
          </Button>
        </Fieldset>
      </Form>
    </SpendProfilePreparePage>
  );
};
