import React from "react";
import * as ACC from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { Pending } from "@shared/pending";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";

export interface ProjectSetupBankDetailsVerifyParams {
  projectId: string;
  partnerId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  editor: Pending<IEditorStore<PartnerDto, PartnerDtoValidator>>;
}

interface Callbacks {
  onChange: (submit: boolean, dto: PartnerDto) => void;
}

class ProjectSetupBankDetailsVerifyComponent extends ContainerBase<ProjectSetupBankDetailsVerifyParams, Data, Callbacks> {

  public render() {
    const combined = Pending.combine({ project: this.props.project, editor: this.props.editor });
    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.editor)} />;
  }
  public renderContents(project: ProjectDto, editor: IEditorStore<PartnerDto, PartnerDtoValidator>) {
    const Form = ACC.TypedForm<PartnerDto>();
    const { bankDetails } = editor.data;

    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={this.props.routes.projectSetup.getLink({ projectId: this.props.projectId, partnerId: this.props.partnerId })}>
            <ACC.Content value={(x) => x.projectSetupBankDetailsVerify.backLink()} />
          </ACC.BackLink>
        }
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title project={project} />}
      >
        {this.renderGuidance()}
        <ACC.Section>
          <ACC.SummaryList qa="bank-details-summary">
            <ACC.SummaryListItem labelContent={x => x.projectSetupBankDetailsVerify.partnerLabels.organisationName()} content={editor.data.name} qa={"organisationName"}/>
            <ACC.SummaryListItem labelContent={x => x.projectSetupBankDetailsVerify.partnerLabels.companyNumber()} content={bankDetails.companyNumber} qa={"companyNumber"}/>
            <ACC.SummaryListItem labelContent={x => x.projectSetupBankDetailsVerify.partnerLabels.sortCode()} content={bankDetails.sortCode} qa={"sortCode"}/>
            <ACC.SummaryListItem labelContent={x => x.projectSetupBankDetailsVerify.partnerLabels.accountNumber()} content={bankDetails.accountNumber} qa={"accountNumber"}/>
            <ACC.SummaryListItem labelContent={x => x.projectSetupBankDetailsVerify.partnerLabels.firstName()} content={bankDetails.firstName} qa={"firstName"}/>
            <ACC.SummaryListItem labelContent={x => x.projectSetupBankDetailsVerify.partnerLabels.lastName()} content={bankDetails.lastName} qa={"lastName"}/>
            <ACC.SummaryListItem labelContent={x => x.projectSetupBankDetailsVerify.partnerLabels.accountBuilding()} content={bankDetails.address.accountBuilding} qa={"accountBuilding"}/>
            <ACC.SummaryListItem labelContent={x => x.projectSetupBankDetailsVerify.partnerLabels.accountStreet()} content={bankDetails.address.accountStreet} qa={"accountStreet"}/>
            <ACC.SummaryListItem labelContent={x => x.projectSetupBankDetailsVerify.partnerLabels.accountLocality()} content={bankDetails.address.accountLocality} qa={"accountLocality"}/>
            <ACC.SummaryListItem labelContent={x => x.projectSetupBankDetailsVerify.partnerLabels.accountTownOrCity()} content={bankDetails.address.accountTownOrCity} qa={"accountTownOrCity"}/>
            <ACC.SummaryListItem labelContent={x => x.projectSetupBankDetailsVerify.partnerLabels.accountPostcode()} content={bankDetails.address.accountPostcode} qa={"accountPostcode"}/>
          </ACC.SummaryList>
        </ACC.Section>
        <ACC.Section qa="bank-details-verify-section" >
          <Form.Form
            editor={editor}
            onChange={() => this.props.onChange(false, editor.data)}
            onSubmit={() => this.props.onChange(true, editor.data)}
            qa="bank-details-form"
          >
            <Form.Fieldset>
              <Form.Submit><ACC.Content value={x => x.projectSetupBankDetailsVerify.submitButton()}/></Form.Submit>
              <ACC.Link styling="SecondaryButton" route={this.props.routes.projectSetupBankDetails.getLink({projectId: this.props.projectId, partnerId: this.props.partnerId})}>
                <ACC.Content value={x => x.projectSetupBankDetailsVerify.changeButton()}/>
              </ACC.Link>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderGuidance() {
    return (
      <ACC.Section qa={"guidance"}>
        <ACC.Content value={x => x.projectSetupBankDetailsVerify.guidanceMessage()}/>
      </ACC.Section>
    );
  }
}

const ProjectSetupBankDetailsVerifyContainer = (props: ProjectSetupBankDetailsVerifyParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <ProjectSetupBankDetailsVerifyComponent
        project={stores.projects.getById(props.projectId)}
        editor={stores.partners.getPartnerEditor(props.projectId, props.partnerId)}
        onChange={(submit, dto) => {
          stores.partners.updatePartner(submit, props.partnerId, dto, {onComplete: () =>
            stores.navigation.navigateTo(props.routes.projectSetup.getLink({ projectId: props.projectId, partnerId: props.partnerId }))});
        }}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const ProjectSetupBankDetailsVerifyRoute = defineRoute({
  routeName: "ProjectSetupBankDetailsVerify",
  routePath: "/projects/:projectId/setup/:partnerId/bank-details-verify",
  container: ProjectSetupBankDetailsVerifyContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
  }),
  getTitle: ({ content }) => content.projectSetupBankDetailsVerify.title(),
  accessControl: (auth, { projectId, partnerId }) => auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
