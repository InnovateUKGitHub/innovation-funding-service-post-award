import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import {
  ILinkInfo,
  PCRItemForPartnerAdditionDto,
  PCRItemStatus,
  PCRItemType,
  ProjectDto,
  ProjectRole
} from "@framework/types";
import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { EditorStatus, IEditorStore, StoresConsumer } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";
import { PcrWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { addPartnerStepNames } from "@ui/containers/pcrs/addPartner/addPartnerWorkflow";
import { PCRSpendProfileCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { CostCategoryType } from "@framework/entities";
import classNames from "classnames";

export interface PcrSpendProfileCostSummaryParams {
  projectId: string;
  pcrId: string;
  itemId: string;
  costCategoryId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  costCategory: Pending<CostCategoryDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
 }

interface Callbacks {
  onChange: (dto: PCRDto) => void;
  onSave: (dto: PCRDto, link: ILinkInfo) => void;
}

class Component extends ContainerBase<PcrSpendProfileCostSummaryParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      editor: this.props.editor,
      costCategory: this.props.costCategory,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.editor, x.costCategory)} />;
  }

  private renderContents(project: ProjectDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, costCategory: CostCategoryDto) {
    const addPartnerItem = editor.data.items.find(x => x.id === this.props.itemId && x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
    const addPartnerWorkflow = this.getWorkflow(addPartnerItem);
    const spendProfileStep = addPartnerWorkflow && addPartnerWorkflow.getCurrentStepInfo();
    const stepRoute = this.props.routes.pcrPrepareItem.getLink({itemId: this.props.itemId, pcrId: this.props.pcrId, projectId: this.props.projectId, step: spendProfileStep && spendProfileStep.stepNumber || undefined});
    const Form = ACC.TypedForm<PCRDto>();
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={stepRoute}>Back to project costs</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        <ACC.Section title={`${costCategory.name} costs`}>
          {this.renderGuidance(costCategory)}
          {this.renderTable(addPartnerItem.spendProfile.costs, costCategory)}
          <Form.Form
            qa="submit-costs"
            data={editor.data}
            isSaving={editor.status === EditorStatus.Saving}
            onSubmit={() => this.props.onSave(editor.data, stepRoute)}
            onChange={dto => this.props.onChange(dto)}
          >
            <Form.Fieldset>
              <Form.Submit>Save and return to summary</Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderGuidance(costCategory: CostCategoryDto) {
    return <ACC.Info summary={`${costCategory.name} costs guidance`}><ACC.Renderers.Markdown value={this.labourGuidance}/></ACC.Info>;
  }

  private renderFooterRow(row: { key: string, title: string, value: React.ReactNode, qa: string, isBold?: boolean }) {
    return (
      <tr key={row.key} className="govuk-table__row" data-qa={row.qa}>
        <th className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">{row.title}</th>
        <td className={classNames("govuk-table__cell", "govuk-table__cell--numeric", { "govuk-!-font-weight-bold": row.isBold })}>{row.value}</td>
        <td className={classNames("govuk-table__cell")} />
      </tr>
    );
  }

  private renderTable(costs: PCRSpendProfileCostDto[], costCategory: CostCategoryDto) {
    const Table = ACC.TypedTable<PCRSpendProfileCostDto>();
    const total = costs.reduce((acc, cost) => acc + (cost.value || 0), 0);
    const footers = [
      (
        <tr key={1} className="govuk-table__row">
          <td className="govuk-table__cell" colSpan={3}>
            <ACC.Link route={this.props.routes.pcrPrepareSpendProfileAddCost.getLink({itemId: this.props.itemId, pcrId: this.props.pcrId, projectId: this.props.projectId, costCategoryId: this.props.costCategoryId})}>Add a cost</ACC.Link>
          </td>
        </tr>
      ),
      this.renderFooterRow({
        key: "2", title: `Total ${costCategory.name.toLocaleLowerCase()} costs`, qa: "total-costs", isBold: false, value: <ACC.Renderers.Currency value={total} />
      }),
    ];
    return (
      <Table.Table qa="costs" data={costs} footers={footers}>
        <Table.String header="Description" value={x => x.description} qa={"role"}/>
        <Table.Currency header="Cost (£)" value={x => x.value} qa={"cost"}/>
        <Table.Link content="Edit" value={x => this.props.routes.pcrPrepareSpendProfileEditCost.getLink({itemId: this.props.itemId, costId: x.id, costCategoryId: this.props.costCategoryId, projectId: this.props.projectId, pcrId: this.props.pcrId})} qa={"edit"}/>
      </Table.Table>
    );
  }

  private getWorkflow(addPartnerItem: PCRItemForPartnerAdditionDto) {
    // You need to have a workflow to find a step number by name
    // so getting a workflow with undefined step first
    // allowing me to find the step name and get the workflow with the correct step
    const summaryWorkflow = PcrWorkflow.getWorkflow(addPartnerItem, undefined, this.props.config.features);
    if (!summaryWorkflow) return null;
    const stepName: addPartnerStepNames = "spendProfileStep";
    const spendProfileStep = summaryWorkflow.findStepNumberByName(stepName);
    return PcrWorkflow.getWorkflow(addPartnerItem, spendProfileStep, this.props.config.features);
  }

  // TODO put this somewhere sensible
  private labourGuidance = `
The new partner will need to account for all labour costs as they occur. For example, there must be timesheets and payroll records. These must show the actual hours worked by individuals and paid by the organisation.
They can include the following labour costs, based on PAYE records:

* gross salary
* National Insurance
* company pension contribution
* life insurance
* other non-discretionary package costs

You cannot include:

* discretionary bonuses
* performance related payments of any kind

You may include the total number of working days for staff but do not include:

* sick days
* waiting time
* training days
* non-productive time

List the total days worked by all categories of staff on the project. Describe their roles.

We will review the total amount of time and cost of labour before we approve this request. The terms and conditions of the grant include compliance with these points.`;
}

const Container = (props: PcrSpendProfileCostSummaryParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <Component
        project={stores.projects.getById(props.projectId)}
        costCategory={stores.costCategories.get(props.costCategoryId)}
        editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId, (dto) => {
          const addPartnerItem = dto.items.find(x => x.id === props.itemId)!;
          addPartnerItem.status = PCRItemStatus.Incomplete;
        })}
        onSave={(dto, link) => {
          stores.messages.clearMessages();
          stores.projectChangeRequests.updatePcrEditor(true, props.projectId, dto, undefined, () =>
            stores.navigation.navigateTo(link));
        }}
        onChange={(dto) => {
          stores.messages.clearMessages();
          stores.projectChangeRequests.updatePcrEditor(false, props.projectId, dto);
        }}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const PCRSpendProfileCostsSummaryRoute = defineRoute<PcrSpendProfileCostSummaryParams>({
  routeName: "pcrSpendProfileCostsSummary",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/spendProfile/:costCategoryId",
  container: (props) => <Container {...props} />,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
    costCategoryId: route.params.costCategoryId,
  }),
  getTitle: ({ params, stores }) => ({displayTitle: "Add partner", htmlTitle: "Add partner"}),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
