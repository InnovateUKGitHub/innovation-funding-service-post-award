import React from "react";
import { PcrStepProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { EditorStatus } from "@ui/redux/constants/enums";
import { CostCategoryType } from "@framework/constants/enums";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { useStores } from "@ui/redux/storesProvider";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { Loader } from "@ui/components/bjss/loading";

interface ContainerProps {
  costCategories: CostCategoryDto[];
}

interface TableData {
  costCategory: CostCategoryDto;
  cost: number;
}

const Form = createTypedForm<PCRItemForPartnerAdditionDto>();
const Table = createTypedTable<TableData>();

class Component extends React.Component<
  PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & ContainerProps,
  TableData
> {
  render() {
    return (
      <Section title={x => x.pcrAddPartnerLabels.projectCostsHeading}>
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
                <Content value={x => x.pcrItem.submitButton} />
              </Form.Submit>
            )}
            {this.props.mode === "prepare" && (
              <Form.Button name="saveAndReturnToSummary" onClick={() => this.props.onSave(true)}>
                <Content value={x => x.pcrItem.returnToSummaryButton} />
              </Form.Button>
            )}
            {this.props.mode === "review" && (
              <Link
                styling="SecondaryButton"
                route={this.props.routes.pcrReviewItem.getLink({
                  itemId: this.props.pcrItem.id,
                  pcrId: this.props.pcr.id,
                  projectId: this.props.project.id,
                })}
              >
                <Content value={x => x.pages.pcrAddPartnerSpendProfile.returnToSummaryNoSaveButton} />
              </Link>
            )}
          </Form.Fieldset>
        </Form.Form>
      </Section>
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

    return (
      <Section>
        <Table.Table qa="costsTable" data={data}>
          <Table.Custom
            header={x => x.pages.pcrAddPartnerSpendProfile.categoryHeading}
            qa="category"
            value={x => x.costCategory.name}
            footer={
              <SimpleString className={"govuk-!-font-weight-bold"}>
                <Content value={x => x.pages.pcrAddPartnerSpendProfile.totalCosts} />
              </SimpleString>
            }
          />
          <Table.Currency
            header={x => x.pages.pcrAddPartnerSpendProfile.costHeading}
            qa="cost"
            value={x => x.cost}
            footer={<Currency value={total} />}
          />
          <Table.Custom value={x => this.getLinkToCostSummary(x)} qa="view-or-edit-cost" />
        </Table.Table>
      </Section>
    );
  }

  private getLinkToCostSummary(data: TableData) {
    // If in review, render view summary links for all cost categories except overheads
    if (this.props.mode === "review") {
      if (data.costCategory.type === CostCategoryType.Overheads) {
        return null;
      }
      return (
        <Link
          route={this.props.routes.pcrSpendProfileReviewCostsSummary.getLink({
            itemId: this.props.pcrItem.id,
            pcrId: this.props.pcr.id,
            projectId: this.props.project.id,
            costCategoryId: data.costCategory.id,
          })}
        >
          <Content value={x => x.pages.pcrAddPartnerSpendProfile.labelView} />
        </Link>
      );
    }
    // For all other cost categories go to the summary page
    if (data.costCategory.type !== CostCategoryType.Overheads) {
      return (
        <Link
          route={this.props.routes.pcrSpendProfileCostsSummary.getLink({
            itemId: this.props.pcrItem.id,
            pcrId: this.props.pcr.id,
            projectId: this.props.project.id,
            costCategoryId: data.costCategory.id,
          })}
        >
          <Content value={x => x.pages.pcrAddPartnerSpendProfile.labelEdit} />
        </Link>
      );
    }
    // Validation ensures only one overheads cost
    const overheadsCost = this.props.pcrItem.spendProfile.costs.find(
      x => x.costCategory === CostCategoryType.Overheads,
    );

    // For overheads as there is only one cost, go straight to the cost form
    if (overheadsCost) {
      return (
        <Link
          route={this.props.routes.pcrPrepareSpendProfileEditCost.getLink({
            itemId: this.props.pcrItem.id,
            pcrId: this.props.pcr.id,
            projectId: this.props.project.id,
            costCategoryId: data.costCategory.id,
            costId: overheadsCost.id,
          })}
        >
          <Content value={x => x.pages.pcrAddPartnerSpendProfile.labelEdit} />
        </Link>
      );
    }

    return (
      <Link
        route={this.props.routes.pcrPrepareSpendProfileAddCost.getLink({
          itemId: this.props.pcrItem.id,
          pcrId: this.props.pcr.id,
          projectId: this.props.project.id,
          costCategoryId: data.costCategory.id,
        })}
      >
        <Content value={x => x.pages.pcrAddPartnerSpendProfile.labelEdit} />
      </Link>
    );
  }
}

export const SpendProfileStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const stores = useStores();

  return (
    <Loader
      pending={stores.costCategories.getAllUnfiltered()}
      render={x => <Component costCategories={x} {...props} />}
    />
  );
};
