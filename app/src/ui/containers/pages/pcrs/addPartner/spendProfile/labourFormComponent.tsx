import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { useMounted } from "@ui/context/Mounted";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { Field } from "@ui/components/atomicDesign/molecules/form/Field/Field";
import { useContent } from "@ui/hooks/content.hook";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { H3 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { SpendProfileContext, appendOrMerge } from "./spendProfileCosts.logic";
import { SpendProfilePreparePage } from "./spendProfilePageComponent";
import { zodResolver } from "@hookform/resolvers/zod";
import { labourSchema, errorMap, LabourSchema } from "./spendProfile.zod";
import {
  MaybeNewCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileLabourCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { isObject } from "lodash";
import { parseCurrency } from "@framework/util/numberHelper";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

const isLabourCostDto = function (
  cost: PCRSpendProfileCostDto | null | undefined,
): cost is PCRSpendProfileLabourCostDto {
  return (
    isObject(cost) && ["id", "description", "grossCostOfRole", "ratePerDay", "daysSpentOnProject"].every(x => x in cost)
  );
};

export const LabourFormComponent = () => {
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

  let defaultCost: MaybeNewCostDto<PCRSpendProfileLabourCostDto>;

  if (addNewItem) {
    defaultCost = {
      id: null,
      description: null,
      grossCostOfRole: null,
      ratePerDay: null,
      daysSpentOnProject: null,
      value: null,
      costCategoryId,
      costCategory: costCategory.type,
    };
  } else if (isLabourCostDto(cost)) {
    defaultCost = cost;
  } else {
    throw Error("Invalid cost dto");
  }

  const { isClient } = useMounted();

  const { handleSubmit, watch, formState, register, setError } = useForm<LabourSchema>({
    defaultValues: {
      id: defaultCost.id,
      form: FormTypes.PcrAddPartnerSpendProfileLabourCost,
      descriptionOfRole: defaultCost.description ?? "",
      grossCostOfRole: String(defaultCost.grossCostOfRole ?? ""),
      ratePerDay: String(defaultCost.ratePerDay ?? ""),
      daysSpentOnProject: defaultCost.daysSpentOnProject ?? undefined,
      costCategoryType: costCategory.type,
    },
    resolver: zodResolver(labourSchema, {
      errorMap,
    }),
  });

  const { getContent } = useContent();

  const totalCost = parseCurrency(watch("ratePerDay") ?? 0) * Number(watch("daysSpentOnProject") ?? 0);

  const validationErrors = useZodErrors(setError, formState?.errors) as ValidationErrorType<LabourSchema>;

  return (
    <SpendProfilePreparePage validationErrors={validationErrors}>
      <Form
        data-qa="addPartnerForm"
        onSubmit={handleSubmit(data =>
          onUpdate({
            data: {
              spendProfile: {
                ...spendProfile,
                costs: appendOrMerge(spendProfile.costs, {
                  description: data.descriptionOfRole,
                  id: data.id as CostId,
                  costCategoryId,
                  costCategory: costCategory.type,
                  grossCostOfRole: parseCurrency(data.grossCostOfRole),
                  ratePerDay: parseCurrency(data.ratePerDay),
                  daysSpentOnProject: Number(data.daysSpentOnProject),
                  value: totalCost,
                }),
              },
            },
            context: { link: routes.pcrSpendProfileCostsSummary.getLink({ projectId, pcrId, itemId, costCategoryId }) },
          }),
        )}
      >
        <input type="hidden" name="form" value={FormTypes.PcrAddPartnerSpendProfileLabourCost} />
        <Fieldset data-qa="labour-costs">
          <input type="hidden" name="id" value={cost?.id} />
          <input type="hidden" name="costCategoryType" value={costCategory.type} />

          <Field
            error={validationErrors?.descriptionOfRole}
            label={getContent(x => x.pcrSpendProfileLabels.labour.role)}
            id="descriptionOfRole"
          >
            <TextInput
              disabled={isFetching}
              inputWidth="one-third"
              {...register("descriptionOfRole")}
              defaultValue={defaultCost.description ?? ""}
            />
          </Field>

          <Field
            error={validationErrors?.grossCostOfRole}
            label={getContent(x => x.pcrSpendProfileLabels.labour.grossCost)}
            id="grossCostOfRole"
          >
            <NumberInput
              disabled={isFetching}
              inputWidth={10}
              {...register("grossCostOfRole")}
              prefix={getContent(x => x.forms.prefix.gbp)}
              defaultValue={String(defaultCost.grossCostOfRole ?? "")}
            />
          </Field>

          <Field
            error={validationErrors?.ratePerDay}
            label={getContent(x => x.pcrSpendProfileLabels.labour.rate)}
            id="ratePerDay"
            hint={getContent(x => x.pcrSpendProfileLabels.labour.rateHint)}
          >
            <NumberInput
              disabled={isFetching}
              inputWidth={5}
              {...register("ratePerDay")}
              prefix={getContent(x => x.forms.prefix.gbp)}
              suffix={getContent(x => x.forms.suffix.perDay)}
              defaultValue={String(defaultCost.ratePerDay ?? "")}
            />
          </Field>

          <Field
            error={validationErrors?.daysSpentOnProject}
            label={getContent(x => x.pcrSpendProfileLabels.labour.daysSpentOnProject)}
            id="daysSpentOnProject"
          >
            <NumberInput
              disabled={isFetching}
              inputWidth={3}
              {...register("daysSpentOnProject")}
              defaultValue={String(defaultCost.daysSpentOnProject ?? "")}
            />
          </Field>

          {isClient && (
            <>
              <H3>{getContent(x => x.pcrSpendProfileLabels.labour.totalCost)}</H3>
              <Hint id="hint-for-total-cost">{getContent(x => x.pcrSpendProfileLabels.labour.totalCostHint)}</Hint>
              <P>
                <Currency id="total-cost" value={totalCost} />
              </P>
            </>
          )}
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
