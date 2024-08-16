import { useContext, useMemo } from "react";
import { useMounted } from "@ui/context/Mounted";
import { appendOrMerge, SpendProfileContext } from "./spendProfileCosts.logic";
import { useForm } from "react-hook-form";
import { CapitalUsageSchema, capitalUsageSchema, errorMap } from "./spendProfile.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContent } from "@ui/hooks/content.hook";
import { SpendProfilePreparePage } from "./spendProfilePageComponent";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { NumberInput } from "@ui/components/atoms/form/NumberInput/NumberInput";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { Radio, RadioList } from "@ui/components/atoms/form/Radio/Radio";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { TextAreaField } from "@ui/components/molecules/form/TextFieldArea/TextAreaField";
import { Section } from "@ui/components/atoms/Section/Section";
import { H3 } from "@ui/components/atoms/Heading/Heading.variants";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Currency } from "@ui/components/atoms/Currency/currency";
import {
  MaybeNewCostDto,
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { isObject } from "lodash";
import { PCRSpendProfileCapitalUsageType } from "@framework/constants/pcrConstants";
import { Field } from "@ui/components/molecules/form/Field/Field";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { parseCurrency } from "@framework/util/numberHelper";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

const isCapitalUsageCostDto = function (
  cost: PCRSpendProfileCostDto | null | undefined,
): cost is PCRSpendProfileCapitalUsageCostDto {
  return (
    isObject(cost) &&
    ["id", "description", "depreciationPeriod", "netPresentValue", "residualValue", "utilisation"].every(x => x in cost)
  );
};

export const CapitalUsageFormComponent = () => {
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

  let defaultCost: MaybeNewCostDto<PCRSpendProfileCapitalUsageCostDto>;

  if (addNewItem) {
    defaultCost = {
      id: null,
      description: null,
      depreciationPeriod: null,
      netPresentValue: null,
      residualValue: null,
      utilisation: null,
      costCategoryId,
      costCategory: costCategory.type,
      type: PCRSpendProfileCapitalUsageType.Unknown,
      typeLabel: "",
      value: null,
    };
  } else if (isCapitalUsageCostDto(cost)) {
    defaultCost = cost;
  } else {
    throw Error("Invalid cost dto");
  }

  const { handleSubmit, watch, formState, register, setError } = useForm<CapitalUsageSchema>({
    defaultValues: {
      id: defaultCost.id,
      capitalUsageDescription: defaultCost.description ?? "",
      depreciationPeriod: defaultCost.depreciationPeriod ?? undefined,
      netPresentValue: String(defaultCost.netPresentValue ?? ""),
      residualValue: String(defaultCost.residualValue ?? ""),
      utilisation: defaultCost.utilisation ?? undefined,
      itemType: defaultCost.type ?? PCRSpendProfileCapitalUsageType.Unknown,
      form: FormTypes.PcrAddPartnerSpendProfileCapitalUsageCost,
      costCategoryType: costCategory.type,
    },
    resolver: zodResolver(capitalUsageSchema, {
      errorMap,
    }),
  });

  const { getContent } = useContent();

  const typeOptions = useMemo(
    () => [
      {
        id: "type_10",
        value: 10,
        label: getContent(x => x.pcrSpendProfileLabels.capitalUsage.new),
      },
      {
        id: "type_20",
        value: 20,
        label: getContent(x => x.pcrSpendProfileLabels.capitalUsage.existing),
      },
    ],
    [getContent],
  );

  const validationErrors = useZodErrors(setError, formState?.errors) as ValidationErrorType<CapitalUsageSchema>;

  const values = watch();

  const netCost =
    (parseCurrency(values.netPresentValue) - parseCurrency(values.residualValue)) * (Number(values.utilisation) / 100);
  return (
    <SpendProfilePreparePage validationErrors={validationErrors}>
      <Form
        onSubmit={handleSubmit(data =>
          onUpdate({
            data: {
              spendProfile: {
                ...spendProfile,
                costs: appendOrMerge(spendProfile.costs, {
                  description: data.capitalUsageDescription,
                  type: Number(data.itemType),
                  id: data.id ?? ("" as CostId),
                  costCategoryId,
                  costCategory: costCategory.type,
                  depreciationPeriod: Number(data.depreciationPeriod),
                  netPresentValue: parseCurrency(data.netPresentValue),
                  residualValue: parseCurrency(data.residualValue),
                  utilisation: Number(data.utilisation),
                  typeLabel: typeOptions.find(x => x.value === Number(data.itemType))?.label ?? "",
                  value: netCost,
                }),
              },
            },
            context: { link: routes.pcrSpendProfileCostsSummary.getLink({ projectId, pcrId, itemId, costCategoryId }) },
          }),
        )}
      >
        <Fieldset data-qa="capital-usage-costs">
          <input type="hidden" name="form" value={FormTypes.PcrAddPartnerSpendProfileCapitalUsageCost} />
          <input type="hidden" name="id" value={cost?.id} />
          <input type="hidden" name="costCategoryType" value={costCategory.type} />
          <FormGroup>
            <TextAreaField
              {...register("capitalUsageDescription")}
              error={validationErrors?.capitalUsageDescription}
              id="capitalUsageDescription"
              label={getContent(x => x.pcrSpendProfileLabels.capitalUsage.description)}
              disabled={isFetching}
              characterCount={watch("capitalUsageDescription")?.length ?? 0}
              characterCountType="ascending"
              defaultValue={String(defaultCost.description ?? "")}
            />
          </FormGroup>

          <FormGroup hasError={!!validationErrors.itemType}>
            <Legend>{getContent(x => x.pcrSpendProfileLabels.capitalUsage.type)}</Legend>
            <ValidationError error={validationErrors.itemType} />
            <RadioList register={register} name="itemType">
              {typeOptions.map(x => (
                <Radio
                  label={x.label}
                  key={x.id}
                  id={x.id}
                  value={x.value}
                  disabled={isFetching}
                  defaultChecked={String(x.value) === String(defaultCost.type)}
                />
              ))}
            </RadioList>
          </FormGroup>

          <Field
            error={validationErrors.depreciationPeriod}
            id="depreciationPeriod"
            label={getContent(x => x.pcrSpendProfileLabels.capitalUsage.depreciationPeriod)}
          >
            <NumberInput
              inputWidth="one-quarter"
              {...register("depreciationPeriod")}
              disabled={isFetching}
              suffix={getContent(x => x.forms.suffix.months)}
              defaultValue={String(defaultCost.depreciationPeriod ?? "")}
            />
          </Field>

          <Field
            hint={getContent(x => x.pcrSpendProfileLabels.capitalUsage.netPresentValueHint)}
            error={validationErrors.netPresentValue}
            id="netPresentValue"
            label={getContent(x => x.pcrSpendProfileLabels.capitalUsage.netPresentValue)}
          >
            <NumberInput
              inputWidth="one-quarter"
              {...register("netPresentValue")}
              disabled={isFetching}
              prefix={getContent(x => x.forms.prefix.gbp)}
              defaultValue={String(defaultCost.netPresentValue ?? "")}
            />
          </Field>

          <Field
            error={validationErrors.residualValue}
            id="residualValue"
            label={getContent(x => x.pcrSpendProfileLabels.capitalUsage.residualValue)}
          >
            <NumberInput
              inputWidth="one-quarter"
              {...register("residualValue")}
              disabled={isFetching}
              prefix={getContent(x => x.forms.prefix.gbp)}
              defaultValue={String(defaultCost.residualValue ?? "")}
            />
          </Field>

          <Field
            error={validationErrors.utilisation}
            id="utilisation"
            label={getContent(x => x.pcrSpendProfileLabels.capitalUsage.utilisation)}
          >
            <NumberInput
              inputWidth="one-quarter"
              {...register("utilisation")}
              disabled={isFetching}
              defaultValue={String(defaultCost.utilisation ?? "")}
              suffix="%"
            />
          </Field>
        </Fieldset>

        {isClient && (
          <Section>
            <H3>{getContent(x => x.pcrSpendProfileLabels.capitalUsage.netCost)}</H3>
            <P>
              <Currency value={netCost} />
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
