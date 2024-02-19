import { CostCategoryType } from "@framework/constants/enums";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { PCRSpendProfileOtherFundingDto } from "@framework/dtos/pcrSpendProfileDto";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../../pcrItemWorkflowMigrated";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useLinks } from "../../utils/useNextLink";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { addPartnerErrorMap } from "../addPartnerSummary.zod";
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
import { SpendProfile } from "@gql/dtoMapper/mapPcrSpendProfile";
import { combineDate, getMonth, getYear } from "@ui/components/atomicDesign/atoms/Date";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { OtherSourcesOfFundingSchema, otherSourcesOfFundingSchema } from "./schemas/otherSourcesOfFunding.zod";
import { useMemo } from "react";
import { PCROrganisationType } from "@framework/constants/pcrConstants";
import { TableEmptyCell } from "@ui/components/atomicDesign/atoms/table/TableEmptyCell/TableEmptyCell";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";

const getOtherFundingCostCategory = (costCategories: Pick<CostCategoryDto, "id" | "type">[]) => {
  const otherFundingCostCategory = costCategories.find(x => x.type === CostCategoryType.Other_Public_Sector_Funding);
  if (!otherFundingCostCategory)
    throw new Error(`Cannot find otherFundingCostCategory matching ${CostCategoryType.Other_Public_Sector_Funding}`);
  return otherFundingCostCategory;
};

const getFunds = (fetchedFunds: PCRSpendProfileOtherFundingDto[]) => {
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
  id: fund.id ?? "",
  costCategoryId: fund.costCategoryId,
  costCategory: fund.costCategory,
});

export const OtherSourcesOfFundingStep = () => {
  const { getContent } = useContent();
  const { isClient } = useMounted();
  const { projectId, itemId, fetchKey, onSave, isFetching, markedAsCompleteHasBeenChecked } = usePcrWorkflowContext();

  const { costCategories, pcrSpendProfile, academicCostCategories, spendProfileCostCategories, pcrItem } =
    useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const { spendProfile, funds } = useMemo(() => {
    const costCategoryList =
      pcrItem.organisationType === PCROrganisationType.Academic ? academicCostCategories : spendProfileCostCategories;

    const spendProfile = new SpendProfile(itemId).getSpendProfile(pcrSpendProfile, costCategoryList);
    return { spendProfile, funds: getFunds(spendProfile.funds).map(mapWithDateParts) };
  }, [itemId]);

  const { handleSubmit, register, formState, trigger, setValue, watch, control } = useForm<OtherSourcesOfFundingSchema>(
    {
      defaultValues: {
        button_submit: "submit",
        funds,
      },
      resolver: zodResolver(otherSourcesOfFundingSchema, {
        errorMap: addPartnerErrorMap,
      }),
    },
  );

  const validationErrors = useRhfErrors(formState.errors) as FundingSourceRhfError;

  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

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
                    costCategory: x.costCategory,
                    costCategoryId: x.costCategoryId,
                    id: x.id as PcrId,
                  })),
                },
              },
              context: links(data),
            }),
          )}
        >
          <Fieldset>
            <input type="hidden" value={fields.length} {...register("itemsLength")} />

            <Table>
              <THead>
                <TR>
                  <TH>{getContent(x => x.pages.pcrAddPartnerOtherFundingSources.columnHeaderDescription)}</TH>
                  <TH>{getContent(x => x.pages.pcrAddPartnerOtherFundingSources.columnHeaderDate)}</TH>
                  <TH>{getContent(x => x.pages.pcrAddPartnerOtherFundingSources.columnHeaderValue)}</TH>
                  <TH hidden>{getContent(x => x.pages.pcrAddPartnerOtherFundingSources.actionHeader)}</TH>
                  <TH>
                    <TableEmptyCell />
                  </TH>
                </TR>
              </THead>

              <TBody>
                {fields.map((x, i) => (
                  <TR key={`funds.${i}.key`} className="govuk-table__row--editable">
                    <TD>
                      <FormGroup
                        noMarginBottom
                        id={`funds_${i}_description`}
                        hasError={!!validationErrors?.funds?.[i]?.description}
                      >
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
                        noMarginBottom
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
                      <FormGroup
                        noMarginBottom
                        id={`funds_${i}_value`}
                        hasError={!!validationErrors?.funds?.[i]?.value}
                      >
                        <ValidationError error={validationErrors?.funds?.[i]?.value as RhfError} />
                        <TextInput
                          numeric
                          hasError={!!validationErrors?.funds?.[i]?.value}
                          aria-label={`funding amount for item ${i}`}
                          {...register(`funds.${i}.value`)}
                          disabled={isFetching}
                          inputMode="numeric"
                        />
                      </FormGroup>
                    </TD>

                    <TD>
                      <Button
                        className="govuk-"
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
                      <TableEmptyCell />
                    </TD>

                    <TD>
                      <TableEmptyCell />
                    </TD>

                    <TD>
                      <TableEmptyCell />
                    </TD>
                  </TR>
                )}
                <TR>
                  <TH>
                    <TableEmptyCell />
                  </TH>

                  <TH>{getContent(x => x.pages.pcrAddPartnerOtherFundingSources.footerLabelTotal)}</TH>

                  <TH className="govuk-table__cell--numeric">
                    <Currency value={total} />
                  </TH>

                  <TH>
                    <TableEmptyCell />
                  </TH>

                  <TH>
                    <TableEmptyCell />
                  </TH>
                </TR>
              </TFoot>
            </Table>
          </Fieldset>

          <Fieldset>
            <Button type="submit" {...registerButton("submit")} disabled={isFetching}>
              {getContent(x => x.pcrItem.submitButton)}
            </Button>

            <Button type="submit" secondary {...registerButton("returnToSummary")} disabled={isFetching}>
              {getContent(x => x.pcrItem.saveAndReturnToSummaryButton)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};
