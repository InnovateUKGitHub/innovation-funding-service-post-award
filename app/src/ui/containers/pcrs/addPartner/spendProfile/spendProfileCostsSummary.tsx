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
    const costs = addPartnerItem.spendProfile.costs.filter(x => x.costCategoryId === this.props.costCategoryId);
    const Form = ACC.TypedForm<PCRDto>();
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={stepRoute}><ACC.Content value={x => x.pcrSpendProfileCostsSummaryContent.backLink()}/></ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        <ACC.Section titleContent={x => x.pcrSpendProfileCostsSummaryContent.costsSectionTitle(costCategory.name)}>
          {this.renderGuidance(costCategory)}
          {this.renderTable(costs, costCategory)}
          <Form.Form
            qa="submit-costs"
            data={editor.data}
            isSaving={editor.status === EditorStatus.Saving}
            onSubmit={() => this.props.onSave(editor.data, stepRoute)}
            onChange={dto => this.props.onChange(dto)}
          >
            <Form.Fieldset>
              <Form.Submit><ACC.Content value={x => x.pcrSpendProfileCostsSummaryContent.submitButton()}/></Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderGuidance(costCategory: CostCategoryDto) {
    return (
      <ACC.Info summary={<ACC.Content value={x => x.pcrSpendProfileCostsSummaryContent.guidanceTitle(costCategory.name)}/>}>
        <ACC.Content value={x => x.pcrSpendProfileCostsSummaryContent.messages().costGuidance(costCategory.type)}/>
      </ACC.Info>
    );
  }

  private renderFooterRow(row: { key: string, title: React.ReactNode, value: React.ReactNode, qa: string, isBold?: boolean }) {
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
            <ACC.Link route={this.props.routes.pcrPrepareSpendProfileAddCost.getLink({itemId: this.props.itemId, pcrId: this.props.pcrId, projectId: this.props.projectId, costCategoryId: this.props.costCategoryId})}>
              <ACC.Content value={x => x.pcrSpendProfileCostsSummaryContent.addCostButton()}/>
            </ACC.Link>
          </td>
        </tr>
      ),
      this.renderFooterRow({
        key: "2", title: <ACC.Content value={x => x.pcrSpendProfileCostsSummaryContent.labels().totalCosts(costCategory.name)}/>, qa: "total-costs", isBold: false, value: <ACC.Renderers.Currency value={total} />
      }),
    ];
    return (
      <Table.Table qa="costs" data={costs} footers={footers}>
        <Table.String headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().description()} value={x => x.description} qa={"description"}/>
        <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().cost()} value={x => x.value} qa={"cost"}/>
        <Table.Custom qa="links" header="Links" hideHeader={true} value={x => this.renderLinks(this.props.itemId, x.id, this.props.costCategoryId, this.props.projectId, this.props.pcrId)} />
      </Table.Table>
    );
  }

  private renderLinks(itemId: string, costId: string, costCategoryId: string, projectId: string, pcrId: string) {
    const links: { route: ILinkInfo, text: React.ReactNode, qa: string; }[] = [];
    links.push({route: this.props.routes.pcrPrepareSpendProfileEditCost.getLink({itemId, costId, costCategoryId, projectId, pcrId}), text: <ACC.Content value={x => x.pcrSpendProfileCostsSummaryContent.editCostButton()} />, qa:"edit"});
    links.push({route: this.props.routes.pcrPrepareSpendProfileDeleteCost.getLink({itemId, costId, costCategoryId, projectId, pcrId}), text: <ACC.Content value={x => x.pcrSpendProfileCostsSummaryContent.removeCostButton()} />, qa:"remove"});

    return links.map((x, i) => <div key={i} data-qa={x.qa}><ACC.Link route={x.route}>{x.text}</ACC.Link></div>);
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
  getTitle: ({ content }) => (content.pcrSpendProfileCostsSummaryContent.title()),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
