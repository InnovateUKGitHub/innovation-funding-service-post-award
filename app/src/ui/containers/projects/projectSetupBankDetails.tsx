import React from "react";
import * as ACC from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { BankCheckStatus, BankDetailsTaskStatus, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { Pending } from "@shared/pending";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";

export interface ProjectSetupBankDetailsParams {
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

class ProjectSetupBankDetailsComponent extends ContainerBase<ProjectSetupBankDetailsParams, Data, Callbacks> {

  public render() {
    const combined = Pending.combine({ project: this.props.project, editor: this.props.editor });
    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.editor)} />;
  }
  public renderContents(project: ProjectDto, editor: IEditorStore<PartnerDto, PartnerDtoValidator>) {

    const Form = ACC.TypedForm<PartnerDto>();
    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={this.props.routes.projectSetup.getLink({ projectId: this.props.projectId, partnerId: this.props.partnerId })}>
            <ACC.Content value={(x) => x.projectSetupBankDetails.backLink()} />
          </ACC.BackLink>
        }
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title project={project} />}
      >
        {this.renderGuidance()}
        <ACC.Section qa="bank-details-section" >
          <Form.Form
            editor={editor}
            onChange={() => this.props.onChange(false, editor.data)}
            onSubmit={() => this.props.onChange(true, editor.data)}
            qa="bank-details-form"
          >
            <Form.Fieldset headingContent={x => x.projectSetupBankDetails.organisationInfoFieldsetTitle()}>
              <ACC.Renderers.SimpleString bold={true}>{editor.data.name}</ACC.Renderers.SimpleString>
              <Form.String
                name="companyNumber"
                width={"one-third"}
                value={x => x.companyNumber}
                labelContent={x => x.projectSetupBankDetails.partnerLabels.companyNumber()}
                hintContent={x => x.projectSetupBankDetails.partnerLabels.companyNumberHint()}
                update={(dto, val) => dto.companyNumber = val}
                // validation={editor.validator.companyNumber}
              />
            </Form.Fieldset>
            <Form.Fieldset headingContent={x => x.projectSetupBankDetails.accountDetailsFieldsetTitle()}>
              <Form.String
                name="sortCode"
                width={"one-third"}
                value={x => x.sortCode}
                labelContent={x => x.projectSetupBankDetails.partnerLabels.sortCode()}
                hintContent={x => x.projectSetupBankDetails.partnerLabels.sortCodeHint()}
                update={(dto, val) => dto.sortCode = val}
                // validation={editor.validator.sortCode}
              />
              <Form.String
                name="accountNumber"
                width={"one-third"}
                value={x => x.accountNumber}
                labelContent={x => x.projectSetupBankDetails.partnerLabels.accountNumber()}
                hintContent={x => x.projectSetupBankDetails.partnerLabels.accountNumberHint()}
                update={(dto, val) => dto.accountNumber = val}
                // validation={editor.validator.accountNumber}
              />
            </Form.Fieldset>
            <Form.Fieldset headingContent={x => x.projectSetupBankDetails.accountHolderFieldsetTitle()}>
              <Form.String
                name="firstName"
                width={"one-third"}
                value={x => x.firstName}
                labelContent={x => x.projectSetupBankDetails.partnerLabels.firstName()}
                update={(dto, val) => dto.firstName = val}
                // validation={editor.validator.firstName}
              />
              <Form.String
                name="lastName"
                width={"one-third"}
                value={x => x.lastName}
                labelContent={x => x.projectSetupBankDetails.partnerLabels.lastName()}
                update={(dto, val) => dto.lastName = val}
                // validation={editor.validator.lastName}
              />
            </Form.Fieldset>
            <Form.Fieldset headingContent={x => x.projectSetupBankDetails.billingAddressFieldsetTitle()}>
              <ACC.Renderers.SimpleString qa={"billingAddressFieldsetGuidance"}>
                <ACC.Content value={x => x.projectSetupBankDetails.billingAddressFieldsetGuidance()}/>
              </ACC.Renderers.SimpleString>
              <Form.String
                name="accountBuildingAndStreet"
                width={"one-third"}
                value={x => x.accountBuildingAndStreet}
                labelContent={x => x.projectSetupBankDetails.partnerLabels.accountBuildingAndStreet()}
                update={(dto, val) => dto.accountBuildingAndStreet = val}
                // validation={editor.validator.accountBuildingAndStreet}
              />
              <Form.String
                name="accountTownOrCity"
                width={"one-third"}
                value={x => x.accountTownOrCity}
                labelContent={x => x.projectSetupBankDetails.partnerLabels.accountTownOrCity()}
                update={(dto, val) => dto.accountTownOrCity = val}
                // validation={editor.validator.accountTownOrCity}
              />
              <Form.String
                name="accountPostcode"
                width={"one-third"}
                value={x => x.accountPostcode}
                labelContent={x => x.projectSetupBankDetails.partnerLabels.accountPostcode()}
                update={(dto, val) => dto.accountPostcode = val}
                // validation={editor.validator.accountPostcode}
              />
            </Form.Fieldset>
            <Form.Fieldset>
              <Form.Submit><ACC.Content value={x => x.projectSetupBankDetails.submitButton()}/></Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderGuidance() {
    return (
      <ACC.Section qa={"guidance"}>
        <ACC.Content value={x => x.projectSetupBankDetails.guidanceMessage()}/>
      </ACC.Section>
    );
  }
}

const ProjectSetupBankDetailsContainer = (props: ProjectSetupBankDetailsParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <ProjectSetupBankDetailsComponent
        project={stores.projects.getById(props.projectId)}
        editor={stores.partners.getPartnerEditor(props.projectId, props.partnerId, dto => {
          dto.bankDetailsTaskStatus = BankDetailsTaskStatus.Incomplete;
        })}
        onChange={(submit, dto) => {
          stores.partners.updatePartner(submit, props.partnerId, dto,
            {
              onComplete: (resp) => {
                if (resp.bankCheckStatus === BankCheckStatus.ValidationFailed) {
                  stores.navigation.navigateTo(props.routes.failedBankCheckConfirmation.getLink({
                    projectId: props.projectId,
                    partnerId: props.partnerId
                  }));
                } else {
                  stores.navigation.navigateTo(props.routes.projectSetupBankDetailsVerify.getLink({
                    projectId: props.projectId,
                    partnerId: props.partnerId
                  }));
                }
              },
              onError: (e) => {
                // TODO add bank details validation to Partner Validator and use correct type here
                if (e && e.results && e.results.bankDetails && !e.results.bankDetails.isValid) {
                  dto.bankCheckValidationAttempts += 1;
                }
              }
            }
          );
        }}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const ProjectSetupBankDetailsRoute = defineRoute({
  routeName: "projectSetupBankDetails",
  routePath: "/projects/:projectId/setup/:partnerId/bank-details",
  container: ProjectSetupBankDetailsContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
  }),
  getTitle: ({ content }) => content.projectSetupBankDetails.title(),
  accessControl: (auth, { projectId, partnerId }) => auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
