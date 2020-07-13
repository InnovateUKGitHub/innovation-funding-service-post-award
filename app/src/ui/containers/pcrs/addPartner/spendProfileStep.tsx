import React from "react";
import * as ACC from "@ui/components";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { EditorStatus, StoresConsumer } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { CostCategoryType } from "@framework/entities";

interface ContainerProps {
  costCategories: CostCategoryDto[];
}

interface TableData {
  costCategory: CostCategoryDto;
  cost: number;
}

class Component extends React.Component<PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & ContainerProps, TableData> {
  render() {
    const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();

    return (
      <ACC.Section title="Project costs for new partner">
        {this.renderTable()}
        <Form.Form
          qa="addPartnerForm"
          data={this.props.pcrItem}
          isSaving={this.props.status === EditorStatus.Saving}
          onSubmit={() => this.props.onSave()}
          onChange={dto => this.props.onChange(dto)}
        >
          <Form.Fieldset qa="save-and-continue">
            {this.props.mode === "prepare" && <Form.Submit>Save and continue</Form.Submit>}
            {this.props.mode === "prepare" && <Form.Button name="saveAndReturnToSummary" onClick={() => this.props.onSave(true)}>Save and return to summary</Form.Button>}
            {this.props.mode === "review" && <ACC.Link styling="SecondaryButton" route={this.props.routes.pcrReviewItem.getLink({ itemId: this.props.pcrItem.id, pcrId: this.props.pcr.id, projectId: this.props.project.id })}>Return to summary</ACC.Link>}
          </Form.Fieldset>
        </Form.Form>
      </ACC.Section>
    );
  }

  private renderTable() {
    const costCategories = this.props.costCategories.filter(x => x.competitionType === this.props.project.competitionType && x.organisationType === this.props.pcrItem.organisationType);
    const data = costCategories.map(
      costCategory => ({
        costCategory,
        cost: this.props.pcrItem.spendProfile.costs.filter(y => y.costCategoryId === costCategory.id).reduce((t, v) => t + (v.value || 0), 0),
      })
    );
    const total = data.map(x => x.cost).reduce((t, val) => t + val, 0);
    const Table = ACC.TypedTable<TableData>();

    return (
      <ACC.Section>
        <Table.Table qa="costsTable" data={data}>
          <Table.Custom header="Category" qa="category" value={x => x.costCategory.name} footer={<ACC.Renderers.SimpleString className={"govuk-!-font-weight-bold"}>Total costs (£)</ACC.Renderers.SimpleString>} />
          <Table.Currency header="Cost (£)" qa="cost" value={x => x.cost} footer={<ACC.Renderers.Currency value={total} />} />
          <Table.Custom value={x => this.getLinkToCostSummary(x)} qa="view-or-edit-cost"/>
        </Table.Table>
      </ACC.Section>
    );
  }

  private getLinkToCostSummary(data: TableData) {
    // If in review, render view summary links for all cost categories except overheads
    if (this.props.mode === "review") {
      if (data.costCategory.type === CostCategoryType.Overheads) {
        return null;
      }
      return <ACC.Link route={this.props.routes.pcrSpendProfileReviewCostsSummary.getLink({ itemId: this.props.pcrItem.id, pcrId: this.props.pcr.id, projectId: this.props.project.id, costCategoryId: data.costCategory.id })}>View</ACC.Link>;
    }
    // For all other cost categories go to the summary page
    if (data.costCategory.type !== CostCategoryType.Overheads) {
      return <ACC.Link route={this.props.routes.pcrSpendProfileCostsSummary.getLink({ itemId: this.props.pcrItem.id, pcrId: this.props.pcr.id, projectId: this.props.project.id, costCategoryId: data.costCategory.id })}>Edit</ACC.Link>;
    }
    // Validation ensures only one overheads cost
    const overheadsCost = this.props.pcrItem.spendProfile.costs.find(x => x.costCategory === CostCategoryType.Overheads);

    // For overheads as there is only one cost, go straight to the cost form
    if (overheadsCost) {
      return <ACC.Link route={this.props.routes.pcrPrepareSpendProfileEditCost.getLink({ itemId: this.props.pcrItem.id, pcrId: this.props.pcr.id, projectId: this.props.project.id, costCategoryId: data.costCategory.id, costId: overheadsCost.id })}>Edit</ACC.Link>;
    }

    return <ACC.Link route={this.props.routes.pcrPrepareSpendProfileAddCost.getLink({ itemId: this.props.pcrItem.id, pcrId: this.props.pcr.id, projectId: this.props.project.id, costCategoryId: data.costCategory.id })}>Edit</ACC.Link>;
  }
}

export const SpendProfileStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => (
  <StoresConsumer>
    {
      stores => {
        return <ACC.Loader
          pending={stores.costCategories.getAll()}
          render={x => <Component costCategories={x} {...props} />}
        />;
      }
    }
  </StoresConsumer>
);
