import { CostCategoryType } from "@framework/constants/enums";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { PCRSpendProfileOtherFundingDto } from "@framework/dtos/pcrSpendProfileDto";
import { Content } from "@ui/components/molecules/Content/content";
import { Section } from "@ui/components/molecules/Section/section";
import { Currency } from "@ui/components/atoms/Currency/currency";
import { useMounted } from "@ui/context/Mounted";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useLinks } from "../../utils/useNextLink";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFieldArrayRemove, UseFormRegister, useFieldArray, useForm } from "react-hook-form";
import { addPartnerErrorMap } from "../addPartnerSummary.zod";
import { createRegisterButton } from "@framework/util/registerButton";
import { PcrPage } from "../../pcrPage";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { TBody, TCaption, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atoms/table/tableComponents";
import { TextInput } from "@ui/components/atoms/form/TextInput/TextInput";
import { DateInputGroup } from "@ui/components/atoms/DateInputs/DateInputGroup";
import { DateInput } from "@ui/components/atoms/DateInputs/DateInput";
import { SpendProfile } from "@gql/dtoMapper/mapPcrSpendProfile";
import { combineDate, getMonth, getYear } from "@ui/components/atoms/Date";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { OtherSourcesOfFundingSchema, otherSourcesOfFundingSchema } from "./schemas/otherSourcesOfFunding.zod";
import { useMemo } from "react";
import { PCROrganisationType } from "@framework/constants/pcrConstants";
import { TableEmptyCell } from "@ui/components/atoms/table/TableEmptyCell/TableEmptyCell";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { parseCurrency } from "@framework/util/numberHelper";
import { FormTypes } from "@ui/zod/FormTypes";
import { range } from "lodash";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

type DateParts = {
  dateSecured_month: string;
  dateSecured_year: string;
};

const getEmptyFund = (costCategoryId: CostCategoryId) => ({
  id: "" as CostId,
  costCategoryId,
  costCategory: CostCategoryType.Other_Public_Sector_Funding,
  description: "",
  dateSecured: null,
  dateSecured_month: "",
  dateSecured_year: "",
  value: "",
});

const getOtherFundingCostCategory = (costCategories: Pick<CostCategoryDto, "id" | "type">[]) => {
  const otherFundingCostCategory = costCategories.find(x => x.type === CostCategoryType.Other_Public_Sector_Funding);
  if (!otherFundingCostCategory)
    throw new Error(`Cannot find otherFundingCostCategory matching ${CostCategoryType.Other_Public_Sector_Funding}`);
  return otherFundingCostCategory;
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
  value: String(fund.value ?? ""),
  id: fund.id ?? "",
  costCategoryId: fund.costCategoryId,
  costCategory: fund.costCategory,
});

type SourceOfFundingRow = Omit<PCRSpendProfileOtherFundingDto, "value"> & DateParts & { value: Nullable<string> };

const NoJsSourcesOfFundingRows = ({
  rows,
  costCategories,
  validationErrors,
}: {
  rows: SourceOfFundingRow[];
  costCategories: Pick<CostCategoryDto, "id" | "type">[];
  validationErrors: FundingSourceRhfError;
}) => {
  const { getContent } = useContent();
  const otherFundingCostCategory = getOtherFundingCostCategory(costCategories);
  const extraRows = rows.length <= 7 ? 10 - rows.length : 3;
  const extraFundItems: SourceOfFundingRow[] = range(extraRows).map(() => getEmptyFund(otherFundingCostCategory.id));

  const combinedRows = [...rows, ...extraFundItems];
  return (
    <>
      {combinedRows.map((x, i) => (
        <TR key={`funds.${i}.key`} className="govuk-table__row--editable">
          <TD>
            <input type="hidden" name={`funds.${i}.costCategory`} value={x.costCategory} />
            <input type="hidden" name={`funds.${i}.costCategoryId`} value={x.costCategoryId} />
            <input type="hidden" name={`funds.${i}.id`} value={x.id} />
            <FormGroup
              noMarginBottom
              id={`funds_${i}_description`}
              hasError={!!validationErrors?.funds?.[i]?.description}
            >
              <ValidationError error={validationErrors?.funds?.[i]?.description as RhfError} />
              <TextInput
                hasError={!!validationErrors?.funds?.[i]?.description}
                aria-label={`source of funding item ${i + 1}`}
                name={`funds.${i}.description`}
                defaultValue={x.description ?? ""}
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
                aria-label={`month funding is secured for item ${i + 1}`}
                name={`funds.${i}.dateSecured_month`}
                defaultValue={x.dateSecured_month ?? ""}
              />

              <DateInput
                noLabel
                type="year"
                aria-label={`year funding is secured for item ${i + 1}`}
                name={`funds.${i}.dateSecured_year`}
                defaultValue={x.dateSecured_year ?? ""}
              />
            </DateInputGroup>
          </TD>

          <TD>
            <FormGroup noMarginBottom id={`funds_${i}_value`} hasError={!!validationErrors?.funds?.[i]?.value}>
              <ValidationError error={validationErrors?.funds?.[i]?.value as RhfError} />
              <TextInput
                numeric
                hasError={!!validationErrors?.funds?.[i]?.value}
                aria-label={`funding amount for item ${i}`}
                name={`funds.${i}.value`}
                inputMode="numeric"
                defaultValue={x.value ?? ""}
                prefix={getContent(x => x.forms.prefix.gbp)}
              />
            </FormGroup>
          </TD>

          <TD>
            <TableEmptyCell />
          </TD>
        </TR>
      ))}
    </>
  );
};

const SourcesOfFundingRows = ({
  validationErrors,
  rows,
  register,
  isFetching,
  remove,
}: {
  validationErrors: FundingSourceRhfError;
  rows: SourceOfFundingRow[];
  register: UseFormRegister<OtherSourcesOfFundingSchema>;
  isFetching: boolean;
  remove: UseFieldArrayRemove;
}) => {
  const { getContent } = useContent();
  return (
    <>
      {rows.map((x, i) => (
        <TR key={`funds.${i}.key`} className="govuk-table__row--editable">
          <TD>
            <input type="hidden" name={`funds.${i}.costCategory`} value={x.costCategory} />
            <input type="hidden" name={`funds.${i}.costCategoryId`} value={x.costCategoryId} />
            <input type="hidden" name={`funds.${i}.id`} value={x.id} />
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
                defaultValue={x.description ?? ""}
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
                defaultValue={x.dateSecured_month ?? ""}
              />

              <DateInput
                noLabel
                type="year"
                disabled={isFetching}
                aria-label={`year funding is secured for item ${i + 1}`}
                {...register(`funds.${i}.dateSecured_year`)}
                defaultValue={x.dateSecured_year ?? ""}
              />
            </DateInputGroup>
          </TD>

          <TD>
            <FormGroup noMarginBottom id={`funds_${i}_value`} hasError={!!validationErrors?.funds?.[i]?.value}>
              <ValidationError error={validationErrors?.funds?.[i]?.value as RhfError} />
              <TextInput
                numeric
                hasError={!!validationErrors?.funds?.[i]?.value}
                aria-label={`funding amount for item ${i}`}
                {...register(`funds.${i}.value`)}
                disabled={isFetching}
                inputMode="numeric"
                defaultValue={String(x.value ?? "")}
                prefix={getContent(x => x.forms.prefix.gbp)}
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
    </>
  );
};

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
    return {
      spendProfile,
      funds: spendProfile.funds
        .filter(x => x.costCategory === CostCategoryType.Other_Public_Sector_Funding)
        .map(mapWithDateParts),
    };
  }, [itemId, isClient]);

  const { handleSubmit, register, formState, trigger, setValue, watch, control, setError } =
    useForm<OtherSourcesOfFundingSchema>({
      defaultValues: {
        button_submit: "submit",
        funds,
        form: FormTypes.PcrAddPartnerOtherSourcesOfFundingStep,
      },
      resolver: zodResolver(otherSourcesOfFundingSchema, {
        errorMap: addPartnerErrorMap,
      }),
    });

  const validationErrors = useZodErrors(setError, formState.errors) as FundingSourceRhfError;

  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  const registerButton = createRegisterButton(setValue, "button_submit");

  const links = useLinks();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "funds",
  });

  const total = watch("funds").reduce((acc, cur) => acc + (parseCurrency(cur.value) || 0), 0);

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
                    value: parseCurrency(x.value),
                    dateSecured: combineDate(x.dateSecured_month, x.dateSecured_year, false),
                    costCategory: x.costCategory,
                    costCategoryId: x.costCategoryId,
                    id: x.id as CostId,
                  })),
                },
              },
              context: links(data),
            }),
          )}
        >
          <input type="hidden" value={fields.length} {...register("itemsLength")} />
          <input type="hidden" {...register("form")} value={FormTypes.PcrAddPartnerOtherSourcesOfFundingStep} />
          <Fieldset>
            <Table>
              <TCaption hidden>{getContent(x => x.pages.pcrAddPartnerOtherFundingSources.tableCaption)}</TCaption>
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
                {isClient ? (
                  <SourcesOfFundingRows
                    isFetching={isFetching}
                    rows={fields}
                    register={register}
                    validationErrors={validationErrors}
                    remove={remove}
                  />
                ) : (
                  <NoJsSourcesOfFundingRows
                    rows={funds}
                    validationErrors={validationErrors}
                    costCategories={costCategories}
                  />
                )}
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
                          append(getEmptyFund(costCategoryId));
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
