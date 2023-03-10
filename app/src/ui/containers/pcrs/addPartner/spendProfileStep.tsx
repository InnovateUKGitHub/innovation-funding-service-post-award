import React from "react";
import * as ACC from "@ui/components";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { useStores } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { CostCategoryType } from "@framework/constants";
import { EditorStatus } from "@ui/constants/enums";

interface ContainerProps {
  costCategories: CostCategoryDto[];
}

interface TableData {
  costCategory: CostCategoryDto;
  cost: number;
}

const Form = ACC.createTypedForm<PCRItemForPartnerAdditionDto>();

class Component extends React.Component<
  PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & ContainerProps,
  TableData
> {
  render() {
    return (
      <ACC.Section title={x => x.pcrAddPartnerLabels.projectCostsHeading}>
        {this.renderTable()}
        <Form.Form
          qa="addPartnerForm"
          data={this.props.pcrItem}
          isSaving={this.props.status === EditorStatus.Saving}
          onSubmit={() => this.props.onSave(false)}
          onChange={dto => this.props.onChange(dto)}
        >
          <Form.Fieldset qa="save-and-continue">
            {this.props.mode === "prepare" && (
              <Form.Submit>
                <ACC.Content value={x => x.pcrItem.submitButton} />
              </Form.Submit>
            )}
            {this.props.mode === "prepare" && (
              <Form.Button name="saveAndReturnToSummary" onClick={() => this.props.onSave(true)}>
                <ACC.Content value={x => x.pcrItem.returnToSummaryButton} />
              </Form.Button>
            )}
            {this.props.mode === "review" && (
              <ACC.Link
                styling="SecondaryButton"
                route={this.props.routes.pcrReviewItem.getLink({
                  itemId: this.props.pcrItem.id,
                  pcrId: this.props.pcr.id,
                  projectId: this.props.project.id,
                })}
              >
                <ACC.Content value={x => x.pages.pcrAddPartnerSpendProfile.returnToSummaryNoSaveButton} />
              </ACC.Link>
            )}
          </Form.Fieldset>
        </Form.Form>
      </ACC.Section>
    );
  }

  private renderTable() {
    const costCategories = this.props.costCategories.filter(
      x =>
        x.competitionType === this.props.project.competitionType &&
        x.organisationType === this.props.pcrItem.organisationType,
    );
    const data = costCategories.map(costCategory => ({
      costCategory,
      cost: this.props.pcrItem.spendProfile.costs
        .filter(y => y.costCategoryId === costCategory.id)
        .reduce((t, v) => t + (v.value || 0), 0),
    }));
    const total = data.map(x => x.cost).reduce((t, val) => t + val, 0);
    const Table = ACC.TypedTable<TableData>();

    return (
      <ACC.Section>
        <Table.Table qa="costsTable" data={data}>
          <Table.Custom
            header={x => x.pages.pcrAddPartnerSpendProfile.categoryHeading}
            qa="category"
            value={x => x.costCategory.name}
            footer={
              <ACC.Renderers.SimpleString className={"govuk-!-font-weight-bold"}>
                <ACC.Content value={x => x.pages.pcrAddPartnerSpendProfile.totalCosts} />
              </ACC.Renderers.SimpleString>
            }
          />
          <Table.Currency
            header={x => x.pages.pcrAddPartnerSpendProfile.costHeading}
            qa="cost"
            value={x => x.cost}
            footer={<ACC.Renderers.Currency value={total} />}
          />
          <Table.Custom value={x => this.getLinkToCostSummary(x)} qa="view-or-edit-cost" />
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
      return (
        <ACC.Link
          route={this.props.routes.pcrSpendProfileReviewCostsSummary.getLink({
            itemId: this.props.pcrItem.id,
            pcrId: this.props.pcr.id,
            projectId: this.props.project.id,
            costCategoryId: data.costCategory.id,
          })}
        >
          <ACC.Content value={x => x.pages.pcrAddPartnerSpendProfile.labelView} />
        </ACC.Link>
      );
    }
    // For all other cost categories go to the summary page
    if (data.costCategory.type !== CostCategoryType.Overheads) {
      return (
        <ACC.Link
          route={this.props.routes.pcrSpendProfileCostsSummary.getLink({
            itemId: this.props.pcrItem.id,
            pcrId: this.props.pcr.id,
            projectId: this.props.project.id,
            costCategoryId: data.costCategory.id,
          })}
        >
          <ACC.Content value={x => x.pages.pcrAddPartnerSpendProfile.labelEdit} />
        </ACC.Link>
      );
    }
    // Validation ensures only one overheads cost
    const overheadsCost = this.props.pcrItem.spendProfile.costs.find(
      x => x.costCategory === CostCategoryType.Overheads,
    );

    // For overheads as there is only one cost, go straight to the cost form
    if (overheadsCost) {
      return (
        <ACC.Link
          route={this.props.routes.pcrPrepareSpendProfileEditCost.getLink({
            itemId: this.props.pcrItem.id,
            pcrId: this.props.pcr.id,
            projectId: this.props.project.id,
            costCategoryId: data.costCategory.id,
            costId: overheadsCost.id,
          })}
        >
          <ACC.Content value={x => x.pages.pcrAddPartnerSpendProfile.labelEdit} />
        </ACC.Link>
      );
    }

    return (
      <ACC.Link
        route={this.props.routes.pcrPrepareSpendProfileAddCost.getLink({
          itemId: this.props.pcrItem.id,
          pcrId: this.props.pcr.id,
          projectId: this.props.project.id,
          costCategoryId: data.costCategory.id,
        })}
      >
        <ACC.Content value={x => x.pages.pcrAddPartnerSpendProfile.labelEdit} />
      </ACC.Link>
    );
  }
}

export const SpendProfileStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const stores = useStores();

  return (
    <ACC.Loader
      pending={stores.costCategories.getAllUnfiltered()}
      render={x => <Component costCategories={x} {...props} />}
    />
  );
};
