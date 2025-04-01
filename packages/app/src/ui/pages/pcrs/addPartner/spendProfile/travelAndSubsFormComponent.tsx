import {
  MaybeNewCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileTravelAndSubsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { Currency } from "@ui/components/atoms/Currency/currency";
import { useMounted } from "@ui/context/Mounted";
import { useContext } from "react";
import { SpendProfileContext } from "./spendProfileCosts.logic";
import { FieldErrors, useForm } from "react-hook-form";
import {
  TravelAndASubsistenceSchema,
  travelAndASubsistenceSchema,
  errorMap,
  TravelAndSubsistenceSchemaType,
} from "./spendProfile.zod";
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
import { isObject } from "lodash";
import { Field } from "@ui/components/molecules/form/Field/Field";
import { parseCurrency } from "@framework/util/numberHelper";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { useOnUpdateTravelAndSubsistence } from "./travelAndSubs.logic";
import { z, ZodError } from "zod";

const isTravelAndSubsCostDto = function (
  cost: PCRSpendProfileCostDto | null | undefined,
): cost is PCRSpendProfileTravelAndSubsCostDto {
  return isObject(cost) && ["id", "description", "numberOfTimes", "costOfEach"].every(x => x in cost);
};

type TravelAndSubsFieldErrors = FieldErrors<z.output<TravelAndSubsistenceSchemaType>>;

const isTotalCostError = (
  errors: TravelAndSubsFieldErrors | (TravelAndSubsFieldErrors & { totalCost: ZodError }),
): errors is TravelAndSubsFieldErrors & { totalCost: ZodError } => "totalCost" in errors;

export const TravelAndSubsFormComponent = () => {
  const { cost, costCategory, routes, pcrId, projectId, itemId, costCategoryId, addNewItem } =
    useContext(SpendProfileContext);
  const { isClient } = useMounted();

  let defaultCost: MaybeNewCostDto<PCRSpendProfileTravelAndSubsCostDto>;

  if (addNewItem) {
    defaultCost = {
      id: null,
      description: null,
      numberOfTimes: null,
      costOfEach: null,
      value: null,
      costCategoryId,
      costCategory: costCategory.type,
    };
  } else if (isTravelAndSubsCostDto(cost)) {
    defaultCost = cost;
  } else {
    throw Error("Invalid cost dto");
  }

  const { handleSubmit, watch, formState, register, trigger, setError } = useForm<TravelAndASubsistenceSchema>({
    defaultValues: {
      id: defaultCost.id,
      descriptionOfCost: defaultCost.description ?? "",
      numberOfTimes: defaultCost.numberOfTimes ?? undefined,
      costOfEach: String(defaultCost.costOfEach ?? ""),
      totalCost: defaultCost.value ?? 0,
      form: FormTypes.PcrAddPartnerProjectCostTravelAndSubsistence,
      costCategoryType: costCategory.type,
      costCategoryId,
    },
    resolver: zodResolver(travelAndASubsistenceSchema, {
      errorMap,
    }),
  });

  const { getContent } = useContent();

  const totalCost = Number(watch("numberOfTimes") ?? 0) * parseCurrency(watch("costOfEach") ?? 0);

  const validationErrors = useZodErrors(
    setError,
    formState?.errors,
  ) as ValidationErrorType<TravelAndASubsistenceSchema>;
  useFormRevalidate(watch, trigger);

  const { apiError, isFetching, onUpdate } = useOnUpdateTravelAndSubsistence();

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
        <Fieldset data-qa="travel-and-subs-costs">
          <input type="hidden" name="form" value={FormTypes.PcrAddPartnerProjectCostTravelAndSubsistence} />
          <input type="hidden" name="id" value={cost?.id} />
          <input type="hidden" name="costCategoryType" value={costCategory.type} />
          <input type="hidden" name="costCategoryId" value={costCategoryId} />

          <Field
            error={validationErrors.descriptionOfCost}
            id="descriptionOfCost"
            label={getContent(x => x.pcrSpendProfileLabels.travelAndSubs.description)}
          >
            <TextInput
              inputWidth="one-third"
              id="description"
              {...register("descriptionOfCost")}
              disabled={isFetching}
              defaultValue={String(defaultCost.description ?? "")}
            />
          </Field>

          <Field
            error={validationErrors.numberOfTimes}
            id="numberOfTimes"
            label={getContent(x => x.pcrSpendProfileLabels.travelAndSubs.numberOfTimes)}
          >
            <NumberInput
              inputWidth="one-third"
              {...register("numberOfTimes")}
              disabled={isFetching}
              defaultValue={String(defaultCost.numberOfTimes ?? "")}
            />
          </Field>

          <Field
            error={validationErrors.costOfEach}
            id="costOfEach"
            label={getContent(x => x.pcrSpendProfileLabels.travelAndSubs.costOfEach)}
          >
            <NumberInput
              inputWidth="one-third"
              {...register("costOfEach")}
              disabled={isFetching}
              prefix={getContent(x => x.forms.prefix.gbp)}
              defaultValue={String(defaultCost.costOfEach ?? "")}
            />
          </Field>
        </Fieldset>

        {isClient && (
          <Section>
            <H3>{getContent(x => x.pcrSpendProfileLabels.travelAndSubs.totalCost)}</H3>
            <FormGroup id="totalCost" hasError={!!validationErrors.totalCost}>
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
