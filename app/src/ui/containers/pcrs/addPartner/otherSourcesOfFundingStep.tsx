import React from "react";
import * as ACC from "@ui/components";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { EditorStatus, StoresConsumer } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { CostCategoryType } from "@framework/entities";
import { range } from "@shared/range";
import { PCRSpendProfileOtherFundingDto } from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { Pending } from "@shared/pending";
import { PCROtherFundingDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";

interface ContainerProps {
  costCategories: CostCategoryDto[];
  funds: PCRSpendProfileOtherFundingDto[];
}

class Component extends React.Component<PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & ContainerProps> {

  render() {

    const {pcrItem, onSave, status, funds} = this.props;

    const Form = ACC.TypedForm<{}>();
    const Table = ACC.TypedTable<PCRSpendProfileOtherFundingDto>();

    return (
      <ACC.Section titleContent={x => x.pcrAddPartnerOtherFundingSources.formSectionTitle()}>
        <ACC.Content value={x => x.pcrAddPartnerOtherFundingSources.guidance()} />
        <Form.Form
          qa="addPartnerForm"
          data={{}}
          isSaving={status === EditorStatus.Saving}
          onSubmit={() => onSave()}
        >
          <Form.Fieldset>
            <Form.Hidden value={() => funds.length} name={"itemsLength"} />
            { this.renderTable(Form, Table, funds, pcrItem) }
          </Form.Fieldset>
          <Form.Fieldset qa="save-and-continue">
            <Form.Submit>
              <ACC.Content value={x => x.pcrAddPartnerOtherFundingSources.pcrItem.submitButton()}/>
            </Form.Submit>
            <Form.Button name="saveAndReturnToSummary" onClick={() => onSave(true)}>
              <ACC.Content value={x => x.pcrAddPartnerOtherFundingSources.pcrItem.returnToSummaryButton()} />
            </Form.Button>
          </Form.Fieldset>
        </Form.Form>
      </ACC.Section>
    );
  }

  private renderTable(Form: ACC.FormBuilder<{}>, Table: ACC.ITypedTable<PCRSpendProfileOtherFundingDto>, funds: PCRSpendProfileOtherFundingDto[], pcrItem: PCRItemForPartnerAdditionDto) {
    return (
      <Table.Table qa="otherFundingTable" data={funds} footers={this.renderFooters(pcrItem)}>
        <Table.Custom
          headerContent={x => x.pcrAddPartnerOtherFundingSources.columnHeaderDescription()}
          qa="cost-description"
          value={(x, i) => (
            <React.Fragment>
              <Form.Hidden value={_dontUse => funds[i.row].id} name={`item_${i.row}_id`} />
              <Form.String
                name={`item_${i.row}_description`}
                // the dto "_dontUse" should not be used here because the form as is doesn't support deeply nested form child elements
                value={_dontUse => funds[i.row].description}
                update={(_dontUse, val) => {
                  funds[i.row].description = val;
                  // onChange needs to be called here because the form as is doesn't support deeply nested form child elements
                  this.props.onChange(pcrItem);
                }}
                validation={this.getCostValidation(i.row, "description")}
              />
            </React.Fragment>
          )}
        />
        <Table.Custom
          headerContent={x => x.pcrAddPartnerOtherFundingSources.columnHeaderDate()}
          qa="cost-date"
          value={(x, i) => (
            <Form.MonthYear
              name={`item_${i.row}_date`}
              value={_dontUse => funds[i.row].dateSecured}
              update={(_dontUse, val) => {
                funds[i.row].dateSecured = val;
                this.props.onChange(pcrItem);
              }}
              startOrEnd="start"
              hideLabel={true}
              validation={this.getCostValidation(i.row, "dateSecured")}
            />
          )}
        />
        <Table.Custom
          headerContent={x => x.pcrAddPartnerOtherFundingSources.columnHeaderValue()}
          qa="cost-value"
          value={(x, i) => (
            <Form.Numeric
              name={`item_${i.row}_value`}
              value={_dontUse => funds[i.row].value}
              update={(_dontUse, val) => {
                funds[i.row].value = val;
                this.props.onChange(pcrItem);
              }}
              validation={this.getCostValidation(i.row, "value")}
            />
          )}
        />
        {this.props.isClient ? <Table.Custom
          header="Action"
          hideHeader={true}
          qa="remove"
          value={dto => (
            <a data-qa="remove-fund" href="" className="govuk-link" role="button" onClick={e => this.removeItem(e, pcrItem, dto)}>
              <ACC.Content value={x => x.pcrAddPartnerOtherFundingSources.removeButton()} />
            </a>
          )}
          width={1}
        /> : null}
      </Table.Table>
    );
  }

  private addItem(e: React.SyntheticEvent<HTMLAnchorElement>, dto: PCRItemForPartnerAdditionDto) {
    e.preventDefault();
    const otherFundingCostCategory = this.props.costCategories.find(x => x.type === CostCategoryType.Other_Funding)!;
    dto.spendProfile.funds.push({
      costCategoryId: otherFundingCostCategory.id,
      costCategory: CostCategoryType.Other_Funding,
      description: null,
      id: "",
      value: null,
      dateSecured: null
    });
    this.props.onChange(dto);
  }

  private getCostValidation(rowNumber: number, field: keyof PCRSpendProfileOtherFundingDto) {
    const index = rowNumber;
    const results = this.props.validator.spendProfile.results[0].funds.results;
    const relevantResults = results.filter(x => x.model.costCategory === CostCategoryType.Other_Funding);
    const result =  relevantResults[index] as PCROtherFundingDtoValidator;
    return result ? result[field] : undefined;
  }

  private removeItem(e: React.SyntheticEvent<HTMLAnchorElement>, pcrItemDto: PCRItemForPartnerAdditionDto, dto: PCRSpendProfileOtherFundingDto) {
    e.preventDefault();
    const index = pcrItemDto.spendProfile.funds.findIndex(x => x === dto);
    pcrItemDto.spendProfile.funds.splice(index, 1);
    this.props.onChange(pcrItemDto);
  }

  private renderFooters(pcrItemDto: PCRItemForPartnerAdditionDto) {
    const total = pcrItemDto.spendProfile.funds
      .filter(x => x.costCategory === CostCategoryType.Other_Funding)
      .reduce((t, item) => t + (item.value || 0), 0);

    const footers: JSX.Element[] = [];

    if (this.props.isClient) {
      footers.push(
        <tr key={1} className="govuk-table__row">
          <td colSpan={4} className="govuk-table__cell">
            <a href="" className="govuk-link" role="button" onClick={(e) => this.addItem(e, pcrItemDto)} data-qa="add-fund">
              <ACC.Content value={x => x.pcrAddPartnerOtherFundingSources.addButton()} />
            </a>
          </td>
        </tr>
      );
    }

    footers.push(
      <tr key={2} className="govuk-table__row">
        <td className="govuk-table__cell"><ACC.Renderers.AccessibilityText>No data</ACC.Renderers.AccessibilityText></td>
        <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">
          <ACC.Content value={x => x.pcrAddPartnerOtherFundingSources.footerLabelTotal()} />
        </td>
        <td className="govuk-table__cell govuk-table__cell--numeric"><ACC.Renderers.Currency value={total} /></td>
        {this.props.isClient ? <td className="govuk-table__cell"><ACC.Renderers.AccessibilityText>No data</ACC.Renderers.AccessibilityText></td> : null}
      </tr>
    );

    return footers;
  }

}

export const OtherSourcesOfFundingStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => (
  <StoresConsumer>
    {
      stores => {
        const costCategoriesPending = stores.costCategories.getAll();
        const fundsPending = costCategoriesPending.chain(costCategories => {
          const funds = props.pcrItem.spendProfile.funds.filter(x => x.costCategory === CostCategoryType.Other_Funding);
          if (props.isClient) {
            return Pending.done(funds);
          }
          const otherFundingCostCategory = costCategories.find(x => x.type === CostCategoryType.Other_Funding)!;
          const extraRows = funds.length <= 7 ? 10 - funds.length : 3;
          const extraFundItems: PCRSpendProfileOtherFundingDto[] = range(extraRows).map(() => ({
            id: "",
            costCategoryId: otherFundingCostCategory.id,
            costCategory: otherFundingCostCategory.type,
            description: null,
            dateSecured: null,
            value: null
          } as PCRSpendProfileOtherFundingDto));
          return Pending.done([...funds, ...extraFundItems]);
        });
        return (
          <ACC.Loader
            pending={Pending.combine({costCategoriesPending, fundsPending})}
            render={x => <Component funds={x.fundsPending} costCategories={x.costCategoriesPending} {...props} />}
          />);
      }
    }
  </StoresConsumer>
);
