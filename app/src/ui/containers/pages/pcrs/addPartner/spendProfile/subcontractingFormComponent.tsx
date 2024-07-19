import {
  MaybeNewCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileSubcontractingCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { useContext } from "react";
import { SpendProfilePreparePage } from "./spendProfilePageComponent";
import { useContent } from "@ui/hooks/content.hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SpendProfileContext, appendOrMerge } from "./spendProfileCosts.logic";
import { SubcontractingSchema, subcontractingSchema, errorMap } from "./spendProfile.zod";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { isObject } from "lodash";
import { Field } from "@ui/components/atomicDesign/molecules/form/Field/Field";
import { TextAreaField } from "@ui/components/atomicDesign/molecules/form/TextFieldArea/TextAreaField";
import { parseCurrency } from "@framework/util/numberHelper";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

const isSubcontractingCostDto = function (
  cost: PCRSpendProfileCostDto | null | undefined,
): cost is PCRSpendProfileSubcontractingCostDto {
  return (
    isObject(cost) &&
    ["id", "description", "subcontractorCountry", "subcontractorRoleAndDescription", "value"].every(x => x in cost)
  );
};

export const SubcontractingFormComponent = () => {
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

  let defaultValues: MaybeNewCostDto<PCRSpendProfileSubcontractingCostDto>;

  if (addNewItem) {
    defaultValues = {
      id: null,
      description: null,
      subcontractorCountry: null,
      subcontractorRoleAndDescription: null,
      value: null,
      costCategoryId,
      costCategory: costCategory.type,
    };
  } else if (isSubcontractingCostDto(cost)) {
    defaultValues = cost;
  } else {
    throw Error("Invalid cost dto");
  }

  const { handleSubmit, formState, register, watch, setError } = useForm<SubcontractingSchema>({
    defaultValues: {
      id: defaultValues.id,
      subcontractorName: defaultValues.description ?? "",
      subcontractorCountry: defaultValues.subcontractorCountry ?? "",
      subcontractorRoleAndDescription: defaultValues.subcontractorRoleAndDescription ?? "",
      subcontractorCost: String(defaultValues.value ?? ""),
      form: FormTypes.PcrAddPartnerSpendProfileSubcontractingCost,
      costCategoryType: costCategory.type,
    },
    resolver: zodResolver(subcontractingSchema, {
      errorMap,
    }),
  });

  const { getContent } = useContent();

  const validationErrors = useZodErrors(setError, formState?.errors) as ValidationErrorType<SubcontractingSchema>;

  return (
    <SpendProfilePreparePage validationErrors={validationErrors}>
      <Form
        onSubmit={handleSubmit(data =>
          onUpdate({
            data: {
              spendProfile: {
                ...spendProfile,
                costs: appendOrMerge(spendProfile.costs, {
                  ...data,
                  id: data.id ?? ("" as CostId),
                  costCategoryId,
                  costCategory: costCategory.type,
                  description: data?.subcontractorName,
                  value: parseCurrency(data.subcontractorCost),
                }),
              },
            },
            context: { link: routes.pcrSpendProfileCostsSummary.getLink({ projectId, pcrId, itemId, costCategoryId }) },
          }),
        )}
      >
        <Fieldset data-qa="subcontracting-costs">
          <input type="hidden" name="form" value={FormTypes.PcrAddPartnerSpendProfileSubcontractingCost} />
          <input type="hidden" name="id" value={cost?.id} />
          <input type="hidden" name="costCategoryType" value={costCategory.type} />

          <Field
            error={validationErrors?.subcontractorName}
            id="subcontractorName"
            label={getContent(x => x.pcrSpendProfileLabels.subcontracting.subcontractorName)}
          >
            <TextInput inputWidth="one-half" {...register("subcontractorName")} disabled={isFetching} />
          </Field>

          <Field
            error={validationErrors?.subcontractorCountry}
            id="subcontractorCountry"
            label={getContent(x => x.pcrSpendProfileLabels.subcontracting.subcontractorCountry)}
          >
            <TextInput inputWidth="one-half" {...register("subcontractorCountry")} disabled={isFetching} />
          </Field>

          <TextAreaField
            id="subcontractorRoleAndDescription"
            error={validationErrors.subcontractorRoleAndDescription}
            label={getContent(x => x.pcrSpendProfileLabels.subcontracting.subcontractorRoleAndDescription)}
            disabled={isFetching}
            characterCount={watch("subcontractorRoleAndDescription")?.length ?? 0}
            {...register("subcontractorRoleAndDescription")}
            characterCountType="ascending"
            defaultValue={defaultValues.subcontractorRoleAndDescription ?? ""}
          />

          <Field
            error={validationErrors?.subcontractorCost}
            id="value"
            label={getContent(x => x.pcrSpendProfileLabels.subcontracting.cost)}
          >
            <NumberInput
              inputWidth="one-quarter"
              {...register("subcontractorCost")}
              disabled={isFetching}
              prefix={getContent(x => x.forms.prefix.gbp)}
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
