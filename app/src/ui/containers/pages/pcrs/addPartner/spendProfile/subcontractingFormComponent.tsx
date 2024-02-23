import { PCRSpendProfileCostDto, PCRSpendProfileSubcontractingCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { useContext } from "react";
import { SpendProfilePreparePage } from "./spendProfilePageComponent";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { useContent } from "@ui/hooks/content.hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SpendProfileContext, appendOrMerge } from "./spendProfileCosts.logic";
import { SubcontractingSchema, subcontractingSchema, errorMap } from "./spendProfile.zod";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { Textarea } from "@ui/components/atomicDesign/atoms/form/TextArea/Textarea";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { isObject } from "lodash";
import { Field } from "@ui/components/atomicDesign/molecules/form/Field/Field";

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

  let defaultCost: PCRSpendProfileSubcontractingCostDto;

  if (addNewItem) {
    defaultCost = {
      id: null as unknown as PcrId,
      description: null,
      subcontractorCountry: null,
      subcontractorRoleAndDescription: null,
      value: null,
      costCategoryId,
      costCategory: costCategory.type,
    };
  } else if (isSubcontractingCostDto(cost)) {
    defaultCost = cost;
  } else {
    throw Error("Invalid cost dto");
  }

  const { handleSubmit, formState, register } = useForm<SubcontractingSchema>({
    defaultValues: {
      id: defaultCost.id,
      subcontractorName: defaultCost.description ?? "",
      subcontractorCountry: defaultCost.subcontractorCountry ?? "",
      subcontractorRoleAndDescription: defaultCost.subcontractorRoleAndDescription ?? "",
      subcontractorCost: String(defaultCost.value ?? ""),
    },
    resolver: zodResolver(subcontractingSchema, {
      errorMap,
    }),
  });

  const { getContent } = useContent();

  const validationErrors = useRhfErrors(formState?.errors) as ValidationError<SubcontractingSchema>;

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
                  id: data.id ?? ("" as PcrId),
                  costCategoryId,
                  costCategory: costCategory.type,
                  description: data?.subcontractorName,
                  value: Number(data.subcontractorCost),
                }),
              },
            },
            context: { link: routes.pcrSpendProfileCostsSummary.getLink({ projectId, pcrId, itemId, costCategoryId }) },
          }),
        )}
      >
        <Fieldset data-qa="subcontracting-costs">
          <input type="hidden" name="id" value={cost?.id} />

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

          <Field
            error={validationErrors.subcontractorRoleAndDescription}
            id="subcontractorRoleAndDescription"
            label={getContent(x => x.pcrSpendProfileLabels.subcontracting.subcontractorRoleAndDescription)}
          >
            <Textarea {...register("subcontractorRoleAndDescription")} disabled={isFetching} />
          </Field>

          <Field
            error={validationErrors?.subcontractorCost}
            id="value"
            label={getContent(x => x.pcrSpendProfileLabels.subcontracting.cost)}
          >
            <NumberInput inputWidth="one-quarter" {...register("subcontractorCost")} disabled={isFetching} />
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
