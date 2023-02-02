import { useNavigate } from "react-router-dom";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import {
  CostCategoryItem,
  CostCategoryList,
  ILinkInfo,
  PCRItemForPartnerAdditionDto,
  PCRItemStatus,
  PCRItemType,
  ProjectDto,
  ProjectRole,
} from "@framework/types";
import { EditorStatus } from "@ui/constants/enums";
import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { IEditorStore, useStores } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";
import { PcrWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { AddPartnerStepNames } from "@ui/containers/pcrs/addPartner/addPartnerWorkflow";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import classNames from "classnames";
import { PCRSpendProfileCostDto } from "@framework/dtos/pcrSpendProfileDto";

export interface PcrSpendProfileCostSummaryParams {
  projectId: ProjectId;
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

const Form = ACC.createTypedForm<PCRDto>();
const Table = ACC.createTypedTable<PCRSpendProfileCostDto>();

class SpendProfileCostsSummaryComponent extends ContainerBase<PcrSpendProfileCostSummaryParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      editor: this.props.editor,
      costCategory: this.props.costCategory,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.editor, x.costCategory)} />;
  }

  private renderContents(
    project: ProjectDto,
    editor: IEditorStore<PCRDto, PCRDtoValidator>,
    costCategory: CostCategoryDto,
  ) {
    const addPartnerItem = editor.data.items.find(
      x => x.id === this.props.itemId && x.type === PCRItemType.PartnerAddition,
    ) as PCRItemForPartnerAdditionDto;
    const addPartnerWorkflow = this.getWorkflow(addPartnerItem);
    const spendProfileStep = addPartnerWorkflow && addPartnerWorkflow.getCurrentStepInfo();
    const stepRoute = this.props.routes.pcrPrepareItem.getLink({
      itemId: this.props.itemId,
      pcrId: this.props.pcrId,
      projectId: this.props.projectId,
      step: (spendProfileStep && spendProfileStep.stepNumber) || undefined,
    });
    const costs = addPartnerItem.spendProfile.costs.filter(x => x.costCategoryId === this.props.costCategoryId);
    const costCategoryType = new CostCategoryList(project.competitionType).fromId(costCategory.type);
    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={stepRoute}>
            <ACC.Content value={x => x.pages.pcrSpendProfileCostsSummary.backLink} />
          </ACC.BackLink>
        }
        pageTitle={<ACC.Projects.Title {...project} />}
        project={project}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        <ACC.Section
          title={x => x.pages.pcrSpendProfileCostsSummary.sectionTitleCosts({ costCategoryName: costCategory.name })}
        >
          {this.renderPreGuidanceWarning(costCategoryType)}
          {this.renderGuidance(costCategoryType)}
          {this.renderTable(costs, costCategory)}
          <Form.Form
            qa="submit-costs"
            data={editor.data}
            isSaving={editor.status === EditorStatus.Saving}
            onSubmit={() => this.props.onSave(editor.data, stepRoute)}
            onChange={dto => this.props.onChange(dto)}
          >
            <Form.Fieldset>
              <Form.Submit>
                <ACC.Content value={x => x.pages.pcrSpendProfileCostsSummary.buttonSubmit} />
              </Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderPreGuidanceWarning(costCategory: CostCategoryItem) {
    if (costCategory.showPreGuidanceWarning) {
      return <ACC.ValidationMessage markdown messageType="info" message={costCategory.preGuidanceWarningMessageKey} />;
    }

    return null;
  }

  private renderGuidance(costCategory: CostCategoryItem) {
    if (costCategory.showGuidance) {
      return (
        <ACC.Info
          summary={
            <ACC.Content
              value={x => x.pages.pcrSpendProfileCostsSummary.guidanceTitle({ costCategoryName: costCategory.name })}
            />
          }
        >
          <ACC.Content markdown value={costCategory.guidanceMessageKey} />
        </ACC.Info>
      );
    }

    return null;
  }

  private renderFooterRow(row: {
    key: string;
    title: React.ReactNode;
    value: React.ReactNode;
    qa: string;
    isBold?: boolean;
  }) {
    return (
      <tr key={row.key} className="govuk-table__row" data-qa={row.qa}>
        <th className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">{row.title}</th>
        <td
          className={classNames("govuk-table__cell", "govuk-table__cell--numeric", {
            "govuk-!-font-weight-bold": row.isBold,
          })}
        >
          {row.value}
        </td>
        <td className={classNames("govuk-table__cell")} />
      </tr>
    );
  }

  private renderTable(costs: PCRSpendProfileCostDto[], costCategory: CostCategoryDto) {
    const total = costs.reduce((acc, cost) => acc + (cost.value || 0), 0);
    const footers = [
      <tr key={1} className="govuk-table__row">
        <td className="govuk-table__cell" colSpan={3}>
          <ACC.Link
            route={this.props.routes.pcrPrepareSpendProfileAddCost.getLink({
              itemId: this.props.itemId,
              pcrId: this.props.pcrId,
              projectId: this.props.projectId,
              costCategoryId: this.props.costCategoryId,
            })}
          >
            <ACC.Content value={x => x.pages.pcrSpendProfileCostsSummary.buttonAddCost} />
          </ACC.Link>
        </td>
      </tr>,
      this.renderFooterRow({
        key: "2",
        title: <ACC.Content value={x => x.pcrSpendProfileLabels.totalCosts({ costCategoryName: costCategory.name })} />,
        qa: "total-costs",
        isBold: false,
        value: <ACC.Renderers.Currency value={total} />,
      }),
    ];
    return (
      <Table.Table qa="costs" data={costs} footers={footers}>
        <Table.String header={x => x.pcrSpendProfileLabels.description} value={x => x.description} qa={"description"} />
        <Table.Currency header={x => x.pcrSpendProfileLabels.cost} value={x => x.value} qa={"cost"} />
        <Table.Custom
          qa="links"
          header="Links"
          hideHeader
          value={x =>
            this.renderLinks(this.props.itemId, x.id, this.props.costCategoryId, this.props.projectId, this.props.pcrId)
          }
        />
      </Table.Table>
    );
  }

  private renderLinks(itemId: string, costId: string, costCategoryId: string, projectId: ProjectId, pcrId: string) {
    const links: { route: ILinkInfo; text: React.ReactNode; qa: string }[] = [];
    links.push({
      route: this.props.routes.pcrPrepareSpendProfileEditCost.getLink({
        itemId,
        costId,
        costCategoryId,
        projectId,
        pcrId,
      }),
      text: <ACC.Content value={x => x.pages.pcrSpendProfileCostsSummary.buttonEditCost} />,
      qa: "edit",
    });
    links.push({
      route: this.props.routes.pcrPrepareSpendProfileDeleteCost.getLink({
        itemId,
        costId,
        costCategoryId,
        projectId,
        pcrId,
      }),
      text: <ACC.Content value={x => x.pages.pcrSpendProfileCostsSummary.buttonRemoveCost} />,
      qa: "remove",
    });

    return links.map((x, i) => (
      <div key={i} data-qa={x.qa}>
        <ACC.Link route={x.route}>{x.text}</ACC.Link>
      </div>
    ));
  }

  private getWorkflow(addPartnerItem: PCRItemForPartnerAdditionDto) {
    // You need to have a workflow to find a step number by name
    // so getting a workflow with undefined step first
    // allowing me to find the step name and get the workflow with the correct step
    const summaryWorkflow = PcrWorkflow.getWorkflow(addPartnerItem, undefined);
    if (!summaryWorkflow) return null;
    const stepName: AddPartnerStepNames = "spendProfileStep";
    const spendProfileStep = summaryWorkflow.findStepNumberByName(stepName);
    return PcrWorkflow.getWorkflow(addPartnerItem, spendProfileStep);
  }
}

const SpendProfileCostsSummaryContainer = (props: PcrSpendProfileCostSummaryParams & BaseProps) => {
  const navigate = useNavigate();
  const stores = useStores();

  return (
    <SpendProfileCostsSummaryComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      costCategory={stores.costCategories.get(props.costCategoryId)}
      editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId, dto => {
        const addPartnerItem = dto.items.find(x => x.id === props.itemId);
        if (!addPartnerItem) throw new Error(`Cannot find addPartnerItem matching ${props.itemId}`);
        addPartnerItem.status = PCRItemStatus.Incomplete;
      })}
      onSave={(dto, link) => {
        stores.messages.clearMessages();
        stores.projectChangeRequests.updatePcrEditor(true, props.projectId, dto, undefined, () => navigate(link.path));
      }}
      onChange={dto => {
        stores.messages.clearMessages();
        stores.projectChangeRequests.updatePcrEditor(false, props.projectId, dto);
      }}
    />
  );
};

export const PCRSpendProfileCostsSummaryRoute = defineRoute<PcrSpendProfileCostSummaryParams>({
  routeName: "pcrSpendProfileCostsSummary",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/spendProfile/:costCategoryId",
  container: SpendProfileCostsSummaryContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
    costCategoryId: route.params.costCategoryId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrSpendProfileCostsSummary.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager),
});
