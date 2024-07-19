import { CostCategoryGroupType } from "@framework/constants/enums";
import { PCRSpendProfileOverheadRate } from "@framework/constants/pcrConstants";
import { parseCurrency, roundCurrency } from "@framework/util/numberHelper";
import { DocumentView } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { SpendProfilePreparePage } from "./spendProfilePageComponent";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { useContext, useMemo } from "react";
import { SpendProfileContext, appendOrMerge } from "./spendProfileCosts.logic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OverheadSchema, overheadSchema, errorMap } from "./spendProfile.zod";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Radio, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { useContent } from "@ui/hooks/content.hook";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { H3 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { isObject, sumBy } from "lodash";
import { createRegisterButton } from "@framework/util/registerButton";
import {
  MaybeNewCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileOverheadsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { CostCategoryList } from "@framework/types/CostCategory";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

const isOverheadsCostDto = function (
  cost: PCRSpendProfileCostDto | null | undefined,
): cost is PCRSpendProfileOverheadsCostDto {
  return isObject(cost) && ["id", "overheadRate", "value"].every(x => x in cost);
};

export const OverheadsFormComponent = ({}) => {
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
    documents,
    stepRoute,
    addNewItem,
  } = useContext(SpendProfileContext);
  const { isClient } = useMounted();

  let defaultCost: MaybeNewCostDto<PCRSpendProfileOverheadsCostDto>;

  if (addNewItem) {
    defaultCost = {
      description: "",
      id: null,
      overheadRate: PCRSpendProfileOverheadRate.Unknown,
      value: null,
      costCategoryId,
      costCategory: costCategory.type,
    };
  } else if (isOverheadsCostDto(cost)) {
    defaultCost = cost;
  } else {
    throw Error("Invalid cost dto");
  }

  const { getContent } = useContent();

  const rateOptions = useMemo(
    () => [
      {
        id: "overheadRate_20",
        value: PCRSpendProfileOverheadRate.Zero,
        label: getContent(x => x.pcrSpendProfileLabels.overheads.zeroPercent),
      },
      {
        id: "overheadRate_30",
        value: PCRSpendProfileOverheadRate.Twenty,
        label: getContent(x => x.pcrSpendProfileLabels.overheads.twentyPercent),
      },
      {
        id: "overheadRate_10",
        value: PCRSpendProfileOverheadRate.Calculated,
        label: getContent(x => x.pcrSpendProfileLabels.overheads.calculated),
      },
    ],
    [getContent],
  );

  const { handleSubmit, watch, formState, register, setValue, trigger, setError } = useForm<OverheadSchema>({
    defaultValues: {
      id: defaultCost.id,
      calculatedValue: defaultCost.value ? String(defaultCost.value) : null,
      overheadRate: defaultCost?.overheadRate ?? PCRSpendProfileOverheadRate.Unknown,
      button_submit: "submit",
      form: FormTypes.PcrAddPartnerSpendProfileOverheadCost,
      costCategoryType: costCategory.type,
    },
    resolver: zodResolver(overheadSchema, {
      errorMap,
    }),
  });

  const registerButton = createRegisterButton(setValue, "button_submit");

  const totalLabourCosts = useMemo(
    () =>
      sumBy(
        spendProfile.costs.filter(
          x => new CostCategoryList().fromId(x.costCategory).group === CostCategoryGroupType.Labour,
        ),
        x => x?.value ?? 0,
      ),
    [spendProfile],
  );

  const getOverheadsCostValue = (overheadRate: PCRSpendProfileOverheadRate) => {
    switch (overheadRate) {
      case PCRSpendProfileOverheadRate.Calculated:
        return parseCurrency(watch("calculatedValue")) ?? 0;
      case PCRSpendProfileOverheadRate.Twenty:
        return roundCurrency((totalLabourCosts * 20) / 100);
      case PCRSpendProfileOverheadRate.Unknown:
      case PCRSpendProfileOverheadRate.Zero:
      default:
        return 0;
    }
  };

  const getUploadDocumentsLink = () => {
    return routes.pcrSpendProfileOverheadDocument.getLink({
      projectId,
      pcrId,
      itemId,
      costCategoryId,
    });
  };

  const overheadRate = Number(watch("overheadRate")) as PCRSpendProfileOverheadRate;

  // If server rendering then always show hidden section
  const displayHiddenForm = !isClient || overheadRate === PCRSpendProfileOverheadRate.Calculated;

  const validationErrors = useZodErrors(setError, formState?.errors) as ValidationErrorType<OverheadSchema>;

  const calculatedTotalCost = getOverheadsCostValue(overheadRate);

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
                  ...data,
                  id: data.id ?? ("" as CostId),
                  description: "",
                  costCategoryId,
                  costCategory: costCategory.type,
                  overheadRate: Number(data.overheadRate),
                  value:
                    typeof data.calculatedValue === "string" && data.calculatedValue.trim().length > 0
                      ? parseCurrency(data.calculatedValue)
                      : 0,
                }),
              },
            },
            context: {
              link: data.button_submit === "uploadDocuments" ? getUploadDocumentsLink() : stepRoute,
            },
          }),
        )}
        data-qa="overheadsForm"
      >
        <Fieldset data-qa="overhead-costs">
          <input type="hidden" name="form" value={FormTypes.PcrAddPartnerSpendProfileOverheadCost} />
          <input type="hidden" name="id" value={cost?.id} />
          <input type="hidden" name="costCategoryType" value={costCategory.type} />
          <FormGroup hasError={!!validationErrors.overheadRate}>
            <ValidationError error={validationErrors?.overheadRate} />
            <RadioList register={register} name="overheadRate">
              {rateOptions.map(x => (
                <Radio
                  key={x.id}
                  id={x.id}
                  disabled={isFetching}
                  label={x.label}
                  value={x.value}
                  defaultChecked={x.value === defaultCost.overheadRate}
                />
              ))}
            </RadioList>
          </FormGroup>
        </Fieldset>

        {displayHiddenForm && (
          <Fieldset>
            <P>{getContent(x => x.spendProfileMessages.calculatedGuidanceOverheads)}</P>
            <Button
              type="submit"
              disabled={isFetching}
              secondary
              name="calculateOverheadsDocuments"
              {...registerButton("uploadDocuments")}
            >
              {getContent(x => x.pcrSpendProfileLabels.overheads.linkDocumentsUpload)}
            </Button>

            <Section qa="overheads-form-section">
              <DocumentView hideHeader qa="overheads-documents" documents={documents} />
            </Section>

            <FormGroup hasError={!!validationErrors?.calculatedValue}>
              <Label htmlFor="value">{getContent(x => x.pcrSpendProfileLabels.overheads.calculatedCost)}</Label>
              <ValidationError error={validationErrors?.calculatedValue} />
              <NumberInput
                hasError={!!validationErrors?.calculatedValue}
                id="value"
                {...register("calculatedValue")}
                inputWidth="one-quarter"
                disabled={isFetching}
                prefix={getContent(x => x.forms.prefix.gbp)}
              />
            </FormGroup>
          </Fieldset>
        )}

        {isClient && (
          <>
            <H3>{getContent(x => x.pcrSpendProfileLabels.overheads.totalCost)}</H3>
            <P>
              <Currency value={calculatedTotalCost} />
            </P>
          </>
        )}

        <Fieldset>
          <Button type="submit" disabled={isFetching} {...registerButton("submit")}>
            {getContent(x => x.pages.pcrSpendProfilePrepareCost.overheads.buttonSubmit)}
          </Button>
        </Fieldset>
      </Form>
    </SpendProfilePreparePage>
  );
};
