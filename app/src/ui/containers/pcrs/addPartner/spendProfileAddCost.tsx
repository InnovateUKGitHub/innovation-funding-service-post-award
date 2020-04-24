import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../../containerBase";
import {
  ILinkInfo,
  PCRItemForPartnerAdditionDto,
  PCRItemStatus,
  PCRItemType,
  ProjectDto,
  ProjectRole
} from "@framework/types";
import * as ACC from "../../../components";
import { Pending } from "@shared/pending";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { EditorStatus, IEditorStore, StoresConsumer } from "@ui/redux";
import {
  MultipleDocumentUpdloadDtoValidator,
  PCRDtoValidator,
  PCRPartnerAdditionItemDtoValidator,
} from "@ui/validators";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { PcrSpendProfileDto, PCRSpendProfileLabourCostDto } from "../../../../framework/dtos/pcrSpendProfileDto";
import { CostCategoryType } from "../../../../framework/entities";
import { CostCategoryDto } from "../../../../framework/dtos/costCategoryDto";
import { PCRLabourCostDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";

export interface PcrAddSpendProfileCostParams {
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

class Component extends ContainerBase<PcrAddSpendProfileCostParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      costCategory: this.props.costCategory,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.editor, x.costCategory)} />;
  }

  private renderContents(project: ProjectDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, costCategory: CostCategoryDto) {
    const addPartnerItem = editor.data.items.find(x => x.id === this.props.itemId && x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.pcrPrepareSpendProfileCosts.getLink({itemId: this.props.itemId, pcrId: this.props.pcrId, projectId: this.props.projectId, costCategoryId: this.props.costCategoryId})}>Back to costs</ACC.BackLink>} // TODO customise for cost category
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        validator={this.getValidator(editor, addPartnerItem)}
        error={editor.error}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        <ACC.Section title={"New labour cost"}>
          {this.renderForm(costCategory, editor, addPartnerItem)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private onSave(dto: PCRDto) {
    const item = dto.items.find(x => x.id === this.props.itemId)!;
    // If submitting from a step set the status to incomplete
    item.status = PCRItemStatus.Incomplete;
    return this.props.onSave(dto, this.props.routes.pcrPrepareSpendProfileCosts.getLink({
      projectId: this.props.projectId,
      pcrId: this.props.pcrId,
      itemId: this.props.itemId,
      costCategoryId: this.props.costCategoryId
    }));
  }

  private renderForm(costCategory: CostCategoryDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, addPartnerItem: PCRItemForPartnerAdditionDto) {
    // tslint:disable-next-line:no-small-switch
    switch(costCategory.type) {
      case CostCategoryType.Labour: return this.renderLabourForm(addPartnerItem, editor);
      default: return null;
    }
  }

  private renderLabourForm(addPartnerItem: PCRItemForPartnerAdditionDto, editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    const data = this.getInitialLabourCost(addPartnerItem.spendProfile);
    if (!data) return null;
    const Form = ACC.TypedForm<PCRSpendProfileLabourCostDto>();
    const onChange = (dto: PCRSpendProfileLabourCostDto) => {
      dto.value = dto.daysSpentOnProject && dto.ratePerDay ? dto.daysSpentOnProject * dto.ratePerDay : 0;
      this.props.onChange(editor.data);
    };
    const validator = this.getValidator(editor, addPartnerItem) as PCRLabourCostDtoValidator;
    return (
      <Form.Form
        qa="addPartnerForm"
        data={data}
        isSaving={editor.status === EditorStatus.Saving}
        onSubmit={() => this.onSave(editor.data)}
        onChange={dto => onChange(dto)}
      >
        <Form.Fieldset qa="labour-costs">
          <Form.String
            label="Role within project"
            width={"one-third"}
            name="role"
            value={dto => dto.role}
            update={(x, val) => x.role = val}
            validation={validator && validator.role}
          />
          <Form.Numeric
            label={"Gross employee cost"}
            name="grossCostOfRole"
            width={"one-third"}
            value={dto => dto.grossCostOfRole }
            update={(dto, val) => dto.grossCostOfRole = val}
            validation={validator && validator.grossCostOfRole}
          />
          <Form.Numeric
            label={"Rate (£/day)"}
            hint={"This should be calculated from the number of working days for this role per year."}
            name="ratePerDay"
            width={"one-third"}
            value={dto => dto.ratePerDay }
            update={(dto, val) => dto.ratePerDay = val}
            validation={validator && validator.ratePerDay}
          />
          <Form.Numeric
            label={"Days to be spent by all staff with this role"}
            name="daysSpentOnProject"
            width={"one-third"}
            value={dto => dto.daysSpentOnProject }
            update={(dto, val) => dto.daysSpentOnProject = val}
            validation={validator && validator.daysSpentOnProject}
          />
          {this.props.isClient && <Form.Custom
            label={"Total cost:"}
            labelBold={true}
            hint={"Total cost will update when saved."}
            name="totalCost"
            validation={validator && validator.value}
            value={dto => <ACC.Renderers.SimpleString><ACC.Renderers.Currency value={dto.value} /></ACC.Renderers.SimpleString>}
            update={() => null}
          />}
        </Form.Fieldset>
        <Form.Fieldset qa="save">
          <Form.Submit>Save and return to labour costs</Form.Submit>
        </Form.Fieldset>
      </Form.Form>
    );
  }

  private getInitialLabourCost(spendProfile: PcrSpendProfileDto): PCRSpendProfileLabourCostDto | undefined {
    const costs = spendProfile.costs.filter(x => x.costCategory === CostCategoryType.Labour) as PCRSpendProfileLabourCostDto[];
    return costs.find(x => x.id === null);
  }

  private getValidator(editor: IEditorStore<PCRDto, PCRDtoValidator>, addPartnerItem: PCRItemForPartnerAdditionDto) {
    const partnerAdditionValidator = editor.validator.items.results.find(x => x.model.id === addPartnerItem.id) as PCRPartnerAdditionItemDtoValidator;
    return partnerAdditionValidator.spendProfile.results[0].costs.results.find(x => x.model.id === null && x.model.costCategoryId === this.props.costCategoryId);
  }
}

const Container = (props: PcrAddSpendProfileCostParams & BaseProps) => (
  <StoresConsumer>
    {stores => {
      const costCategoryPending = stores.costCategories.get(props.costCategoryId);
      return (
        <Component
          project={stores.projects.getById(props.projectId)}
          costCategory={stores.costCategories.get(props.costCategoryId)}
          editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId, (dto) => {
            if (!costCategoryPending.data) return;
            const addPartner = dto.items.find(x => x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
            const costs = addPartner.spendProfile.costs;
            costs.push(stores.projectChangeRequests.getInitialSpendProfileCost(costCategoryPending.data));
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
      );
    }}
  </StoresConsumer>
);

export const PCRSpendProfileAddCostRoute = defineRoute<PcrAddSpendProfileCostParams>({
  routeName: "pcrPrepareSpendProfileAddCost",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/spendProfile/:costCategoryId/cost",
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
