import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { EditorStatus, IEditorStore, StoresConsumer } from "@ui/redux";
import { Pending } from "@shared/pending";
import * as ACC from "@ui/components";
import { ProjectDto } from "@framework/dtos";
import { FinancialVirementDtoValidator } from "@ui/validators";
import { PCRPrepareItemRoute } from "../pcrItemWorkflow";

interface Params {
  projectId: string;
  partnerId: string;
  pcrId: string;
  itemId: string;
}

interface Props {
  project: Pending<ProjectDto>;
  editor: Pending<IEditorStore<FinancialVirementDto, FinancialVirementDtoValidator>>;
  onChange: (saving: boolean, dto: FinancialVirementDto) => void;
}

class Component extends ContainerBase<Params, Props, {}> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={data => this.renderPage(data.project, data.editor)} />;
  }

  private renderPage(project: ProjectDto, editor: IEditorStore<FinancialVirementDto, FinancialVirementDtoValidator>) {
    const VirementTable = ACC.TypedTable<VirementDto>();
    const VirementForm = ACC.TypedForm<FinancialVirementDto>();
    const partnerVirements = editor.data.partners.find(x => x.partnerId === this.props.partnerId)!;

    return (
      <ACC.Page
        backLink={this.getBackLink()}
        pageTitle={<ACC.Projects.Title project={project} />}
        error={editor.error}
        validator={editor.validator}
      >
        <VirementForm.Form editor={editor} onChange={(dto) => this.props.onChange(false, dto)} onSubmit={() => this.props.onChange(true, editor.data)}>
          <VirementForm.Fieldset>
            <VirementTable.Table qa="partnerVirements" data={partnerVirements.virements}>
              <VirementTable.String header="Cost category" qa="costCategory" value={x => x.costCategoryName} footer="Total" />
              <VirementTable.Currency header="Original" qa="original" value={x => x.originalAmount} footer={<ACC.Renderers.Currency value={partnerVirements.originalTotal} />} />
              <VirementTable.Custom header="New" qa="new" value={x => this.renderInput(x, editor.status === EditorStatus.Saving)} footer={<ACC.Renderers.Currency value={partnerVirements.newTotal} />} classSuffix={"numeric"} />
            </VirementTable.Table>
          </VirementForm.Fieldset>
          <VirementForm.Fieldset>
            <VirementForm.Submit>Save and return</VirementForm.Submit>
          </VirementForm.Fieldset>
        </VirementForm.Form>
      </ACC.Page>
    );
  }

  private renderInput(virement: VirementDto, disabled: boolean) {
    return <ACC.Inputs.NumberInput name={virement.costCategoryId} value={virement.newAmount} onChange={(val) => this.updateValue(virement.costCategoryId, val)} width={4} ariaLabel={virement.costCategoryName} disabled={disabled} />;
  }

  private updateValue(costCategoryId: string, value: number | null) {
    const dto = this.props.editor.data!.data;

    const partner = dto.partners.find(x => x.partnerId === this.props.partnerId)!;

    const partnerVirement = partner.virements
      .find(x => x.costCategoryId === costCategoryId)!;

    partnerVirement.newAmount = value!;

    partner.newTotal = partner.virements.filter(x => !!x.newAmount).reduce((total, x) => total + x.newAmount, 0);

    dto.newTotal = dto.partners.filter(x => !!x.newTotal).reduce((total, x) => total + x.newTotal, 0);

    this.props.onChange(false, dto);
  }

  private getBackLink() {
    const params = {
      projectId: this.props.projectId,
      pcrId: this.props.pcrId,
      itemId: this.props.itemId
    };

    return <ACC.BackLink route={this.props.routes.pcrPrepareItem.getLink(params)} replace={true}>Back to summary</ACC.BackLink>;
  }
}

const Container = (props: Params & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <Component
          project={stores.projects.getById(props.projectId)}
          editor={stores.financialVirements.getFiniancialVirementEditor(props.projectId, props.pcrId, props.itemId)}
          onChange={(saving, dto) => stores.financialVirements.updateFiniancialVirementEditor(saving, props.projectId, props.pcrId, props.itemId, dto, () => stores.navigation.navigateTo(PCRPrepareItemRoute.getLink({ projectId: props.projectId, pcrId: props.pcrId, itemId: props.itemId }), true))}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const FinancialVirementEditRoute = defineRoute({
  routeName: "financial-virement-edit",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/financial/:partnerId",
  container: Container,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
    partnerId: route.params.partnerId,
  }),
  getTitle: () => ({
    htmlTitle: "Financial Virement Edit Partner Details",
    displayTitle: "Financial Virement Edit Partner Details"
  }),
});
