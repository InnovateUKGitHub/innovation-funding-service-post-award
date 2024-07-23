import {
  MaybeNewCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileTravelAndSubsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { useContext } from "react";
import { SpendProfileContext, appendOrMerge } from "./spendProfileCosts.logic";
import { useForm } from "react-hook-form";
import { TravelAndASubsistenceSchema, travelAndASubsistenceSchema, errorMap } from "./spendProfile.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContent } from "@ui/hooks/content.hook";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { SpendProfilePreparePage } from "./spendProfilePageComponent";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { H3 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { isObject } from "lodash";
import { Field } from "@ui/components/atomicDesign/molecules/form/Field/Field";
import { parseCurrency } from "@framework/util/numberHelper";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";

const isTravelAndSubsCostDto = function (
  cost: PCRSpendProfileCostDto | null | undefined,
): cost is PCRSpendProfileTravelAndSubsCostDto {
  return isObject(cost) && ["id", "description", "numberOfTimes", "costOfEach"].every(x => x in cost);
};

export const TravelAndSubsFormComponent = () => {
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

  const { handleSubmit, watch, formState, register, trigger } = useForm<TravelAndASubsistenceSchema>({
    defaultValues: {
      id: defaultCost.id,
      descriptionOfCost: defaultCost.description ?? "",
      numberOfTimes: defaultCost.numberOfTimes ?? undefined,
      costOfEach: String(defaultCost.costOfEach ?? ""),
      totalCost: defaultCost.value ?? 0,
    },
    resolver: zodResolver(travelAndASubsistenceSchema, {
      errorMap,
    }),
  });

  const { getContent } = useContent();

  const totalCost = Number(watch("numberOfTimes") ?? 0) * parseCurrency(watch("costOfEach") ?? 0);

  const validationErrors = useRhfErrors(formState?.errors) as ValidationErrorType<TravelAndASubsistenceSchema>;
  useFormRevalidate(watch, trigger);

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
                  numberOfTimes: Number(data.numberOfTimes),
                  costOfEach: parseCurrency(data.costOfEach),
                  value: totalCost,
                }),
              },
            },
            context: { link: routes.pcrSpendProfileCostsSummary.getLink({ projectId, pcrId, itemId, costCategoryId }) },
          }),
        )}
      >
        <Fieldset data-qa="travel-and-subs-costs">
          <input type="hidden" name="id" value={cost?.id} />
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
            />
          </Field>

          <Field
            error={validationErrors.numberOfTimes}
            id="numberOfTimes"
            label={getContent(x => x.pcrSpendProfileLabels.travelAndSubs.numberOfTimes)}
          >
            <NumberInput inputWidth="one-third" {...register("numberOfTimes")} disabled={isFetching} />
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
            />
          </Field>
        </Fieldset>

        {isClient && (
          <Section>
            <H3>{getContent(x => x.pcrSpendProfileLabels.travelAndSubs.totalCost)}</H3>
            <FormGroup id="totalCost" hasError={!!validationErrors.totalCost}>
              <ValidationError error={validationErrors.totalCost} />
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
