import { CostCategoryType } from "@framework/constants/enums";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { PCRSpendProfileOtherFundingDto } from "@framework/dtos/pcrSpendProfileDto";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { AccessibilityText } from "@ui/components/atomicDesign/atoms/AccessibilityText/AccessibilityText";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../../pcrItemWorkflowMigrated";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useLinks } from "../../utils/useNextLink";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { OtherSourcesOfFundingSchema, addPartnerErrorMap, otherSourcesOfFundingSchema } from "../addPartner.zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { createRegisterButton } from "@framework/util/registerButton";
import { PcrPage } from "../../pcrPage";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { TBody, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { DateInputGroup } from "@ui/components/atomicDesign/atoms/DateInputs/DateInputGroup";
import { DateInput } from "@ui/components/atomicDesign/atoms/DateInputs/DateInput";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { SpendProfile } from "@gql/dtoMapper/mapPcrSpendProfile";
import { combineDate, getMonth, getYear } from "@ui/components/atomicDesign/atoms/Date";
import { head } from "lodash";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";

const getOtherFundingCostCategory = (costCategories: Pick<CostCategoryDto, "id" | "type">[]) => {
  const otherFundingCostCategory = costCategories.find(x => x.type === CostCategoryType.Other_Public_Sector_Funding);
  if (!otherFundingCostCategory)
    throw new Error(`Cannot find otherFundingCostCategory matching ${CostCategoryType.Other_Public_Sector_Funding}`);
  return otherFundingCostCategory;
};

const getFunds = (
  fetchedFunds: PCRSpendProfileOtherFundingDto[],
  // costCategories: Pick<CostCategoryDto, "id" | "type">[],
  // isClient: boolean,
) => {
  const funds = fetchedFunds.filter(x => x.costCategory === CostCategoryType.Other_Public_Sector_Funding);
  return funds;

  /**
   * TODO: update logic with js disabled
   * this logic below intended to help with js disabled
   */
  // if (isClient) return funds;

  // const otherFundingCostCategory = getOtherFundingCostCategory(costCategories);
  // const extraRows = funds.length <= 7 ? 10 - funds.length : 3;
  // const extraFundItems: PCRSpendProfileOtherFundingDto[] = range(extraRows).map(() =>
  //   getEmptyFund(otherFundingCostCategory.id),
  // );

  // return [...funds, ...extraFundItems];
};

type FundingSourceRhfError = {
  funds: {
    description: RhfError;
    dateSecured: RhfError;
    value: RhfError;
  }[];
};

export const mapWithDateParts = (fund: PCRSpendProfileOtherFundingDto) => ({
  description: fund.description ?? "",
  dateSecured_month: getMonth(fund.dateSecured),
  dateSecured_year: getYear(fund.dateSecured),
  dateSecured: fund.dateSecured,
  value: fund.value ?? undefined,
});

export const OtherSourcesOfFundingStep = () => {
  const { getContent } = useContent();
  const { isClient } = useMounted();
  const { projectId, itemId, fetchKey, markedAsCompleteHasBeenChecked, useFormValidate, onSave, isFetching } =
    usePcrWorkflowContext();

  const { costCategories, pcrSpendProfile } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const otherFundingCostCategory = head(
    costCategories.filter(x => x.type === CostCategoryType.Other_Public_Sector_Funding),
  );

  if (!otherFundingCostCategory) throw new Error("could not find other public funding cost category");

  const spendProfile = new SpendProfile(itemId).getSpendProfile(pcrSpendProfile, [otherFundingCostCategory]);
  const funds = getFunds(spendProfile.funds);

  const { handleSubmit, register, formState, trigger, setValue, watch, control } = useForm<OtherSourcesOfFundingSchema>(
    {
      defaultValues: {
        markedAsComplete: markedAsCompleteHasBeenChecked,
        button_submit: "submit",
        funds: funds.map(mapWithDateParts),
      },
      resolver: zodResolver(otherSourcesOfFundingSchema, {
        errorMap: addPartnerErrorMap,
      }),
    },
  );

  const validationErrors = useRhfErrors(formState.errors) as FundingSourceRhfError;

  useFormValidate(trigger);

  const registerButton = createRegisterButton(setValue, "button_submit");

  const links = useLinks();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "funds",
  });

  const total = watch("funds").reduce((acc, cur) => acc + Number(cur.value), 0);

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section title={x => x.pages.pcrAddPartnerOtherFundingSources.formSectionTitle}>
        <Content markdown value={x => x.pages.pcrAddPartnerOtherFundingSources.guidance} />

        <Form
          data-qa="addPartnerForm"
          onSubmit={handleSubmit(data =>
            onSave({
              data: {
                spendProfile: {
                  ...spendProfile,
                  funds: data.funds.map(x => ({
                    description: x.description,
                    value: Number(x.value),
                    dateSecured: combineDate(x.dateSecured_month, x.dateSecured_year, false),
                    costCategory: otherFundingCostCategory.type,
                    costCategoryId: otherFundingCostCategory.id,
                    id: "" as PcrId,
                  })),
                },
              },
              context: links(data),
            }),
          )}
        >
          <Fieldset>
            <input type="hidden" value={funds.length} {...register("itemsLength")} />

            <Table>
              <THead>
                <TR>
                  <TH>{getContent(x => x.pages.pcrAddPartnerOtherFundingSources.columnHeaderDescription)}</TH>
                  <TH>{getContent(x => x.pages.pcrAddPartnerOtherFundingSources.columnHeaderDate)}</TH>
                  <TH>{getContent(x => x.pages.pcrAddPartnerOtherFundingSources.columnHeaderValue)}</TH>
                  <TH hidden>Action</TH>
                </TR>
              </THead>

              <TBody>
                {fields.map((x, i) => (
                  <TR key={`funds.${i}.key`}>
                    <TD>
                      <FormGroup id={`funds_${i}_description`} hasError={!!validationErrors?.funds?.[i]?.description}>
                        <ValidationError error={validationErrors?.funds?.[i]?.description as RhfError} />
                        <TextInput
                          hasError={!!validationErrors?.funds?.[i]?.description}
                          aria-label={`source of funding item ${i + 1}`}
                          {...register(`funds.${i}.description`)}
                          disabled={isFetching}
                        />
                      </FormGroup>
                    </TD>

                    <TD>
                      <DateInputGroup
                        id={`funds_${i}_dateSecured`}
                        error={validationErrors?.funds?.[i]?.dateSecured as RhfError}
                      >
                        <DateInput
                          noLabel
                          type="month"
                          disabled={isFetching}
                          aria-label={`month funding is secured for item ${i + 1}`}
                          {...register(`funds.${i}.dateSecured_month`)}
                        />

                        <DateInput
                          noLabel
                          type="year"
                          disabled={isFetching}
                          aria-label={`year funding is secured for item ${i + 1}`}
                          {...register(`funds.${i}.dateSecured_year`)}
                        />
                      </DateInputGroup>
                    </TD>

                    <TD>
                      <FormGroup id={`funds_${i}_value`} hasError={!!validationErrors?.funds?.[i]?.value}>
                        <ValidationError error={validationErrors?.funds?.[i]?.value as RhfError} />
                        <TextInput
                          hasError={!!validationErrors?.funds?.[i]?.value}
                          aria-label={`funding amount for item ${i}`}
                          {...register(`funds.${i}.value`)}
                          disabled={isFetching}
                        />
                      </FormGroup>
                    </TD>

                    <TD>
                      <Button
                        type="button"
                        link
                        data-qa="remove-fund"
                        onClick={() => {
                          remove(i);
                        }}
                      >
                        {getContent(x => x.pages.pcrAddPartnerOtherFundingSources.buttonRemove)}
                      </Button>
                    </TD>
                  </TR>
                ))}
              </TBody>

              <TFoot>
                {isClient && (
                  <TR>
                    <TD>
                      <Button
                        type="button"
                        link
                        onClick={() => {
                          const costCategoryId = getOtherFundingCostCategory(costCategories).id;
                          const emptyFund = {
                            id: "",
                            costCategoryId,
                            costCategory: CostCategoryType.Other_Public_Sector_Funding,
                            description: "",
                            dateSecured: null,
                            dateSecured_month: "",
                            dateSecured_year: "",
                            value: undefined as unknown as number,
                          };

                          append(emptyFund);
                        }}
                      >
                        {getContent(x => x.pages.pcrAddPartnerOtherFundingSources.buttonAdd)}
                      </Button>
                    </TD>

                    <TD>
                      <AccessibilityText>No data</AccessibilityText>
                    </TD>

                    <TD>
                      <AccessibilityText>No data</AccessibilityText>
                    </TD>
                  </TR>
                )}
                <TR>
                  <TD>
                    <AccessibilityText>No data</AccessibilityText>
                  </TD>

                  <TD>
                    <P bold>{getContent(x => x.pages.pcrAddPartnerOtherFundingSources.footerLabelTotal)} </P>
                  </TD>

                  <TD className="govuk-table__cell--numeric">
                    <Currency value={total} />
                  </TD>

                  {isClient && (
                    <TD>
                      <AccessibilityText>No data</AccessibilityText>
                    </TD>
                  )}
                </TR>
              </TFoot>
            </Table>
          </Fieldset>

          <Fieldset>
            <Button type="submit" {...registerButton("submit")} disabled={isFetching}>
              {getContent(x => x.pcrItem.submitButton)}
            </Button>

            <Button type="submit" secondary {...registerButton("returnToSummary")} disabled={isFetching}>
              {getContent(x => x.pcrItem.returnToSummaryButton)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};
