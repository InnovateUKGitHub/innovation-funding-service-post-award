import { useNavigate } from "react-router-dom";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { EditorStatus } from "@ui/redux/constants/enums";
import { Pending } from "@shared/pending";
import { PCRDto, PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { PcrWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { AddPartnerStepNames } from "@ui/containers/pages/pcrs/addPartner/addPartnerWorkflow";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import classNames from "classnames";
import { PCRSpendProfileCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCRItemType, PCRStepId, PCRItemStatus } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { ProjectDto } from "@framework/dtos/projectDto";
import { CostCategoryList, CostCategoryItem } from "@framework/types/CostCategory";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { Info } from "@ui/components/atomicDesign/atoms/Details/Details";

export interface PcrSpendProfileCostSummaryParams {
  projectId: ProjectId;
  pcrId: PcrId;
  itemId: PcrItemId;
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

const Form = createTypedForm<PCRDto>();
const Table = createTypedTable<PCRSpendProfileCostDto>();

class SpendProfileCostsSummaryComponent extends ContainerBase<PcrSpendProfileCostSummaryParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      editor: this.props.editor,
      costCategory: this.props.costCategory,
    });

    return <PageLoader pending={combined} render={x => this.renderContents(x.project, x.editor, x.costCategory)} />;
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
      <Page
        backLink={
          <BackLink route={stepRoute}>
            <Content value={x => x.pages.pcrSpendProfileCostsSummary.backLink} />
          </BackLink>
        }
        pageTitle={<Title {...project} />}
        project={project}
        validator={editor.validator}
        error={editor.error}
      >
        <Messages messages={this.props.messages} />
        <Section
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
                <Content value={x => x.pages.pcrSpendProfileCostsSummary.buttonSubmit} />
              </Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </Section>
      </Page>
    );
  }

  private renderPreGuidanceWarning(costCategory: CostCategoryItem) {
    if (costCategory.showPreGuidanceWarning) {
      return <ValidationMessage markdown messageType="info" message={costCategory.preGuidanceWarningMessageKey} />;
    }

    return null;
  }

  private renderGuidance(costCategory: CostCategoryItem) {
    if (costCategory.showGuidance) {
      return (
        <Info
          summary={
            <Content
              value={x => x.pages.pcrSpendProfileCostsSummary.guidanceTitle({ costCategoryName: costCategory.name })}
            />
          }
        >
          <Content markdown value={costCategory.guidanceMessageKey} />
        </Info>
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
          <Link
            route={this.props.routes.pcrPrepareSpendProfileAddCost.getLink({
              itemId: this.props.itemId,
              pcrId: this.props.pcrId,
              projectId: this.props.projectId,
              costCategoryId: this.props.costCategoryId,
            })}
          >
            <Content value={x => x.pages.pcrSpendProfileCostsSummary.buttonAddCost} />
          </Link>
        </td>
      </tr>,
      this.renderFooterRow({
        key: "2",
        title: <Content value={x => x.pcrSpendProfileLabels.totalCosts({ costCategoryName: costCategory.name })} />,
        qa: "total-costs",
        isBold: false,
        value: <Currency value={total} />,
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

  private renderLinks(itemId: PcrItemId, costId: string, costCategoryId: string, projectId: ProjectId, pcrId: PcrId) {
    const links: { route: ILinkInfo; text: React.ReactNode; qa: string }[] = [];
    links.push({
      route: this.props.routes.pcrPrepareSpendProfileEditCost.getLink({
        itemId,
        costId,
        costCategoryId,
        projectId,
        pcrId,
      }),
      text: <Content value={x => x.pages.pcrSpendProfileCostsSummary.buttonEditCost} />,
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
      text: <Content value={x => x.pages.pcrSpendProfileCostsSummary.buttonRemoveCost} />,
      qa: "remove",
    });

    return links.map((x, i) => (
      <div key={i} data-qa={x.qa}>
        <Link route={x.route}>{x.text}</Link>
      </div>
    ));
  }

  private getWorkflow(addPartnerItem: PCRItemForPartnerAdditionDto) {
    // You need to have a workflow to find a step number by name
    // so getting a workflow with undefined step first
    // allowing me to find the step name and get the workflow with the correct step
    const summaryWorkflow = PcrWorkflow.getWorkflow(addPartnerItem, undefined);
    if (!summaryWorkflow) return null;
    const stepName: AddPartnerStepNames = PCRStepId.spendProfileStep;
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
        stores.projectChangeRequests.updatePcrEditor({
          saving: true,
          projectId: props.projectId,
          pcrStepId: PCRStepId.spendProfileStep,
          dto,
          message: undefined,
          onComplete: () => navigate(link.path),
        });
      }}
      onChange={dto => {
        stores.messages.clearMessages();
        stores.projectChangeRequests.updatePcrEditor({
          saving: false,
          projectId: props.projectId,
          pcrStepId: PCRStepId.spendProfileStep,
          dto,
        });
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
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    costCategoryId: route.params.costCategoryId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrSpendProfileCostsSummary.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager),
});
