import React from "react";

import * as ACC from "@ui/components";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { useStores } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { range } from "@shared/range";
import { PCRSpendProfileOtherFundingDto } from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { Pending } from "@shared/pending";
import { PCROtherFundingDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";
import { CostCategoryType } from "@framework/constants";
import { EditorStatus } from "@ui/constants/enums";
import { useMounted } from "@ui/features";
import { Result } from "@ui/validation";

interface ContainerProps {
  costCategories: CostCategoryDto[];
  funds: PCRSpendProfileOtherFundingDto[];
}

const Form = ACC.createTypedForm<null>();
const Table = ACC.createTypedTable<PCRSpendProfileOtherFundingDto>();

const OtherSourcesOfFunding = ({
  pcrItem,
  onSave,
  status,
  funds,
  ...props
}: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & ContainerProps) => {
  const { isClient } = useMounted();

  const addItem = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, dto: PCRItemForPartnerAdditionDto) => {
    e.preventDefault();
    const otherFundingCostCategory = props.costCategories.find(
      x => x.type === CostCategoryType.Other_Public_Sector_Funding,
    );
    if (!otherFundingCostCategory)
      throw new Error(
        `Cannot find other public sector funding cost category matching ${
          CostCategoryType[CostCategoryType.Other_Public_Sector_Funding]
        }: ${CostCategoryType.Other_Public_Sector_Funding}`,
      );
    dto.spendProfile.funds.push({
      costCategoryId: otherFundingCostCategory.id,
      costCategory: CostCategoryType.Other_Public_Sector_Funding,
      description: null,
      id: "",
      value: null,
      dateSecured: null,
    });

    props.onChange(dto);
  };

  const getCostValidation = (rowNumber: number, field: keyof PCROtherFundingDtoValidator) => {
    const index = rowNumber;
    const results = props.validator.spendProfile.results[0].funds.results;
    const relevantResults = results.filter(x => x.model.costCategory === CostCategoryType.Other_Public_Sector_Funding);
    const result = relevantResults[index] as PCROtherFundingDtoValidator;
    const costValidation = result ? result[field] : undefined;
    return costValidation as Result;
  };

  const removeItem = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    pcrItemDto: PCRItemForPartnerAdditionDto,
    dto: PCRSpendProfileOtherFundingDto,
  ) => {
    e.preventDefault();
    const index = pcrItemDto.spendProfile.funds.findIndex(x => x === dto);

    pcrItemDto.spendProfile.funds.splice(index, 1);

    props.onChange(pcrItemDto);
  };

  const renderFooters = (pcrItemDto: PCRItemForPartnerAdditionDto) => {
    const total = pcrItemDto.spendProfile.funds
      .filter(x => x.costCategory === CostCategoryType.Other_Public_Sector_Funding)
      .reduce((t, item) => t + (item.value || 0), 0);

    const footers: JSX.Element[] = [];

    if (isClient) {
      footers.push(
        <tr key={1} className="govuk-table__row">
          <td colSpan={4} className="govuk-table__cell">
            <button
              data-module="govuk-button"
              data-qa="add-fund"
              className="govuk-link govuk-!-font-size-19"
              onClick={e => addItem(e, pcrItemDto)}
            >
              <ACC.Content value={x => x.pages.pcrAddPartnerOtherFundingSources.buttonAdd} />
            </button>
          </td>
        </tr>,
      );
    }

    footers.push(
      <tr key={2} className="govuk-table__row">
        <td className="govuk-table__cell">
          <ACC.Renderers.AccessibilityText>No data</ACC.Renderers.AccessibilityText>
        </td>

        <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">
          <ACC.Content value={x => x.pages.pcrAddPartnerOtherFundingSources.footerLabelTotal} />
        </td>

        <td className="govuk-table__cell govuk-table__cell--numeric">
          <ACC.Renderers.Currency value={total} />
        </td>

        {isClient ? (
          <td className="govuk-table__cell">
            <ACC.Renderers.AccessibilityText>No data</ACC.Renderers.AccessibilityText>
          </td>
        ) : null}
      </tr>,
    );

    return footers;
  };

  return (
    <ACC.Section title={x => x.pages.pcrAddPartnerOtherFundingSources.formSectionTitle}>
      <ACC.Content markdown value={x => x.pages.pcrAddPartnerOtherFundingSources.guidance} />

      <Form.Form
        qa="addPartnerForm"
        data={null}
        isSaving={status === EditorStatus.Saving}
        onSubmit={() => onSave(false)}
      >
        <Form.Fieldset>
          <Form.Hidden value={() => funds.length} name={"itemsLength"} />

          <Table.Table qa="otherFundingTable" data={funds} footers={renderFooters(pcrItem)}>
            <Table.Custom
              header={x => x.pages.pcrAddPartnerOtherFundingSources.columnHeaderDescription}
              qa="cost-description"
              value={(x, i) => (
                <>
                  <Form.Hidden value={() => funds[i.row].id} name={`item_${i.row}_id`} />
                  <Form.String
                    name={`item_${i.row}_description`}
                    // the dto "_doNotUse" should not be used here because the form as is doesn't support deeply nested form child elements
                    value={() => funds[i.row].description}
                    update={(_doNotUse, val) => {
                      funds[i.row].description = val;
                      // onChange needs to be called here because the form as is doesn't support deeply nested form child elements
                      props.onChange(pcrItem);
                    }}
                    validation={getCostValidation(i.row, "description")}
                  />
                </>
              )}
            />

            <Table.Custom
              header={x => x.pages.pcrAddPartnerOtherFundingSources.columnHeaderDate}
              qa="cost-date"
              value={(x, i) => (
                <Form.MonthYear
                  name={`item_${i.row}_date`}
                  value={() => funds[i.row].dateSecured}
                  update={(_doNotUse, val) => {
                    funds[i.row].dateSecured = val;
                    props.onChange(pcrItem);
                  }}
                  startOrEnd="start"
                  hideLabel
                  validation={getCostValidation(i.row, "dateSecured")}
                />
              )}
            />
            <Table.Custom
              header={x => x.pages.pcrAddPartnerOtherFundingSources.columnHeaderValue}
              qa="cost-value"
              value={(x, i) => (
                <Form.Numeric
                  name={`item_${i.row}_value`}
                  value={() => funds[i.row].value}
                  update={(_doNotUse, val) => {
                    funds[i.row].value = val;
                    props.onChange(pcrItem);
                  }}
                  validation={getCostValidation(i.row, "value")}
                />
              )}
            />
            {isClient ? (
              <Table.Custom
                header="Action"
                hideHeader
                qa="remove"
                value={dto => (
                  <button
                    data-module="govuk-button"
                    data-qa="remove-fund"
                    className="govuk-link govuk-!-font-size-19"
                    onClick={e => removeItem(e, pcrItem, dto)}
                  >
                    <ACC.Content value={x => x.pages.pcrAddPartnerOtherFundingSources.buttonRemove} />
                  </button>
                )}
                width={1}
              />
            ) : null}
          </Table.Table>
        </Form.Fieldset>

        <Form.Fieldset qa="save-and-continue">
          <Form.Submit>
            <ACC.Content value={x => x.pcrItem.submitButton} />
          </Form.Submit>

          <Form.Button name="saveAndReturnToSummary" onClick={() => onSave(true)}>
            <ACC.Content value={x => x.pcrItem.returnToSummaryButton} />
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};

export const OtherSourcesOfFundingStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const stores = useStores();
  const { isClient } = useMounted();

  const costCategoriesPending = stores.costCategories.getAllUnfiltered();
  const fundsPending = costCategoriesPending.chain(costCategories => {
    const funds = props.pcrItem.spendProfile.funds.filter(
      x => x.costCategory === CostCategoryType.Other_Public_Sector_Funding,
    );

    if (isClient) return Pending.done(funds);

    const otherFundingCostCategory = costCategories.find(x => x.type === CostCategoryType.Other_Public_Sector_Funding);
    if (!otherFundingCostCategory)
      throw new Error(`Cannot find otherFundingCostCategory matching ${CostCategoryType.Other_Public_Sector_Funding}`);
    const extraRows = funds.length <= 7 ? 10 - funds.length : 3;
    const extraFundItems: PCRSpendProfileOtherFundingDto[] = range(extraRows).map(
      () =>
        ({
          id: "",
          costCategoryId: otherFundingCostCategory.id,
          costCategory: otherFundingCostCategory.type,
          description: null,
          dateSecured: null,
          value: null,
        } as PCRSpendProfileOtherFundingDto),
    );

    return Pending.done([...funds, ...extraFundItems]);
  });

  return (
    <ACC.Loader
      pending={Pending.combine({ costCategoriesPending, fundsPending })}
      render={x => <OtherSourcesOfFunding {...props} funds={x.fundsPending} costCategories={x.costCategoriesPending} />}
    />
  );
};
