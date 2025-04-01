import { Currency } from "@ui/components/atoms/Currency/currency";
import { useMounted } from "@ui/context/Mounted";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { TextInput } from "@ui/components/atoms/form/TextInput/TextInput";
import { Field } from "@ui/components/molecules/form/Field/Field";
import { useContent } from "@ui/hooks/content.hook";
import { NumberInput } from "@ui/components/atoms/form/NumberInput/NumberInput";
import { H3 } from "@ui/components/atoms/Heading/Heading.variants";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { FieldErrors, useForm } from "react-hook-form";
import { useContext, useMemo } from "react";
import { SpendProfileContext } from "./spendProfileCosts.logic";
import { SpendProfilePreparePage } from "./spendProfilePageComponent";
import { zodResolver } from "@hookform/resolvers/zod";
import { labourSchema, errorMap, LabourSchema, LabourSchemaType } from "./spendProfile.zod";
import {
  MaybeNewCostDto,
  PCRSpendProfileCostDto,
  PcrSpendProfileDto,
  PCRSpendProfileLabourCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { isObject } from "lodash";
import { parseCurrency } from "@framework/util/numberHelper";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { useOnUpdateLabour } from "./labour.logic";
import { PCRSpendProfileOverheadRate } from "@framework/constants/pcrConstants";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { z, ZodError } from "zod";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";

/**
 * getOverhead
 * -----------
 *
 * in the case that overhead rate has already been set to be 20%
 * then we need to recalculate the overhead total as part of updating the labour costs,
 * since the basic calculation of overheads is 20% of the labour costs.
 *
 * for this we need to send the total running labour profile and the costId of the overhead rate
 * to be updated
 */
const getOverheadData = (spendProfile: PcrSpendProfileDto) => {
  const overhead = spendProfile.costs.find(x => "overheadRate" in x);

  if (!overhead || overhead.overheadRate !== PCRSpendProfileOverheadRate.Twenty) {
    return {
      overheadCostId: null,
      labourProfile: [],
    };
  }
  const labourProfile = spendProfile.costs
    .filter(x => "grossCostOfRole" in x)
    .map(x => ({
      id: x.id,
      value: x.value,
    }));

  return {
    overheadCostId: overhead.id,
    labourProfile,
  };
};

const isLabourCostDto = function (
  cost: PCRSpendProfileCostDto | null | undefined,
): cost is PCRSpendProfileLabourCostDto {
  return (
    isObject(cost) && ["id", "description", "grossCostOfRole", "ratePerDay", "daysSpentOnProject"].every(x => x in cost)
  );
};

type LabourFieldErrors = FieldErrors<z.output<LabourSchemaType>>;

const isTotalCostError = (
  errors: LabourFieldErrors | (LabourFieldErrors & { totalCost: ZodError }),
): errors is LabourFieldErrors & { totalCost: ZodError } => "totalCost" in errors;

export const LabourFormComponent = () => {
  const { cost, costCategory, routes, pcrId, projectId, itemId, costCategoryId, addNewItem, spendProfile } =
    useContext(SpendProfileContext);

  let defaultCost: MaybeNewCostDto<PCRSpendProfileLabourCostDto>;

  const { labourProfile, overheadCostId } = useMemo(() => getOverheadData(spendProfile), [spendProfile]);

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
  const { handleSubmit, watch, formState, register, setError, trigger } = useForm<LabourSchema>({
    defaultValues: {
      id: defaultCost.id,
      form: FormTypes.PcrAddPartnerProjectCostLabour,
      labourDescription: defaultCost.description ?? "",
      grossCostOfRole: String(defaultCost.grossCostOfRole ?? ""),
      ratePerDay: String(defaultCost.ratePerDay ?? ""),
      daysSpentOnProject: defaultCost.daysSpentOnProject ?? undefined,
      costCategoryType: costCategory.type,
      costCategoryId,
      overheadCostId,
      labourProfile,
    },
    resolver: zodResolver(labourSchema, {
      errorMap,
    }),
  });

  const { getContent } = useContent();

  const totalCost = parseCurrency(watch("ratePerDay") ?? 0) * Number(watch("daysSpentOnProject") ?? 0);

  const validationErrors = useZodErrors(setError, formState?.errors) as ValidationErrorType<LabourSchema>;

  useFormRevalidate(watch, trigger);
  const { apiError, isFetching, onUpdate } = useOnUpdateLabour();
  return (
    <SpendProfilePreparePage validationErrors={validationErrors} apiError={apiError}>
      <Form
        data-qa="addPartnerForm"
        onSubmit={handleSubmit(data =>
          onUpdate({
            data,
            context: { link: routes.pcrSpendProfileCostsSummary.getLink({ projectId, pcrId, itemId, costCategoryId }) },
          }),
        )}
      >
        <input type="hidden" name="form" value={FormTypes.PcrAddPartnerProjectCostLabour} />
        <Fieldset data-qa="labour-costs">
          <input type="hidden" name="id" value={cost?.id} />
          <input type="hidden" name="costCategoryType" value={costCategory.type} />
          <input type="hidden" name="costCategoryId" value={costCategoryId} />
          <input type="hidden" name="overheadCostId" value={overheadCostId ?? undefined} />
          {labourProfile.map((x, i) => (
            <>
              <input type="hidden" key={`${x.id}-id`} name={`labourProfile.${i}.id`} value={x.id} />
              <input type="hidden" key={`${x.id}-value`} name={`labourProfile.${i}.value`} value={String(x.value)} />
            </>
          ))}
          <Field
            error={validationErrors?.labourDescription}
            label={getContent(x => x.pcrSpendProfileLabels.labour.role)}
            id="descriptionOfRole"
          >
            <TextInput
              disabled={isFetching}
              inputWidth="one-third"
              {...register("labourDescription")}
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
            <FormGroup hasError={isTotalCostError(formState.errors)}>
              <H3>{getContent(x => x.pcrSpendProfileLabels.labour.totalCost)}</H3>
              <Hint id="hint-for-total-cost">{getContent(x => x.pcrSpendProfileLabels.labour.totalCostHint)}</Hint>

              {isTotalCostError(formState.errors) && (
                <ValidationError
                  id="error-for-total-cost"
                  data-qa="error-for-total-cost"
                  error={formState.errors.totalCost}
                />
              )}
              <P>
                <Currency id="total-cost" value={totalCost} />
              </P>
            </FormGroup>
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
