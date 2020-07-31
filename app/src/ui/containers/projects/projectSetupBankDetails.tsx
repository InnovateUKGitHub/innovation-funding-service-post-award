import React from "react";
import * as ACC from "@ui/components";
import { FormBuilder } from "@ui/components";
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
                value={x => x.bankDetails.companyNumber}
                labelContent={x => x.projectSetupBankDetails.partnerLabels.companyNumber()}
                hintContent={x => x.projectSetupBankDetails.partnerLabels.companyNumberHint()}
                update={(dto, val) => dto.bankDetails.companyNumber = val}
                validation={editor.validator.companyNumber}
              />
            </Form.Fieldset>
            <Form.Fieldset headingContent={x => x.projectSetupBankDetails.accountDetailsFieldsetTitle()}>
              { this.renderSortCode(editor, Form) }
              { this.renderAccountNumber(editor, Form) }
            </Form.Fieldset>
            <Form.Fieldset headingContent={x => x.projectSetupBankDetails.accountHolderFieldsetTitle()}>
              <Form.String
                name="firstName"
                width={"one-third"}
                value={x => x.bankDetails.firstName}
                labelContent={x => x.projectSetupBankDetails.partnerLabels.firstName()}
                update={(dto, val) => dto.bankDetails.firstName = val}
                validation={editor.validator.firstName}
              />
              <Form.String
                name="lastName"
                width={"one-third"}
                value={x => x.bankDetails.lastName}
                labelContent={x => x.projectSetupBankDetails.partnerLabels.lastName()}
                update={(dto, val) => dto.bankDetails.lastName = val}
                validation={editor.validator.lastName}
              />
            </Form.Fieldset>
            <Form.Fieldset headingContent={x => x.projectSetupBankDetails.billingAddressFieldsetTitle()}>
              <ACC.Renderers.SimpleString qa={"billingAddressFieldsetGuidance"}>
                <ACC.Content value={x => x.projectSetupBankDetails.billingAddressFieldsetGuidance()}/>
              </ACC.Renderers.SimpleString>
              <Form.String
                name="accountBuilding"
                width={"one-third"}
                value={x => x.bankDetails.address.accountBuilding}
                labelContent={x => x.projectSetupBankDetails.partnerLabels.accountBuilding()}
                update={(dto, val) => dto.bankDetails.address.accountBuilding = val}
                validation={editor.validator.accountBuilding}
              />
              <Form.String
                name="accountStreet"
                width={"one-third"}
                value={x => x.bankDetails.address.accountStreet}
                labelContent={x => x.projectSetupBankDetails.partnerLabels.accountStreet()}
                update={(dto, val) => dto.bankDetails.address.accountStreet = val}
                validation={editor.validator.accountStreet}
              />
              <Form.String
                name="accountLocality"
                width={"one-third"}
                value={x => x.bankDetails.address.accountLocality}
                labelContent={x => x.projectSetupBankDetails.partnerLabels.accountLocality()}
                update={(dto, val) => dto.bankDetails.address.accountLocality = val}
                validation={editor.validator.accountLocality}
              />
              <Form.String
                name="accountTownOrCity"
                width={"one-third"}
                value={x => x.bankDetails.address.accountTownOrCity}
                labelContent={x => x.projectSetupBankDetails.partnerLabels.accountTownOrCity()}
                update={(dto, val) => dto.bankDetails.address.accountTownOrCity = val}
                validation={editor.validator.accountTownOrCity}
              />
              <Form.String
                name="accountPostcode"
                width={"one-third"}
                value={x => x.bankDetails.address.accountPostcode}
                labelContent={x => x.projectSetupBankDetails.partnerLabels.accountPostcode()}
                update={(dto, val) => dto.bankDetails.address.accountPostcode = val}
                validation={editor.validator.accountPostcode}
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

  private renderSortCode(editor: IEditorStore<PartnerDto, PartnerDtoValidator>, Form: FormBuilder<PartnerDto>) {
    if (editor.data.bankCheckStatus === BankCheckStatus.NotValidated) {
      return (
          <Form.String
            name="sortCode"
            width={"one-third"}
            value={x => x.bankDetails.sortCode}
            labelContent={x => x.projectSetupBankDetails.partnerLabels.sortCode()}
            hintContent={x => x.projectSetupBankDetails.partnerLabels.sortCodeHint()}
            update={(dto, val) => dto.bankDetails.sortCode = val}
            validation={editor.validator.sortCode.isValid ? editor.validator.bankCheckValidation : editor.validator.sortCode}
          />
      );
    }
    return (
      <Form.Custom
        name="sortCode"
        value={x => <ACC.Renderers.SimpleString>{x.bankDetails.sortCode}</ACC.Renderers.SimpleString>}
        labelContent={x => x.projectSetupBankDetails.partnerLabels.sortCode()}
        update={_ => null}
      />
    );
  }

  private renderAccountNumber(editor: IEditorStore<PartnerDto, PartnerDtoValidator>, Form: FormBuilder<PartnerDto>) {
    if (editor.data.bankCheckStatus === BankCheckStatus.NotValidated) {
      return (
          <Form.String
            name="accountNumber"
            width={"one-third"}
            value={x => x.bankDetails.accountNumber}
            labelContent={x => x.projectSetupBankDetails.partnerLabels.accountNumber()}
            hintContent={x => x.projectSetupBankDetails.partnerLabels.accountNumberHint()}
            update={(dto, val) => dto.bankDetails.accountNumber = val}
            validation={editor.validator.accountNumber.isValid ? editor.validator.bankCheckValidation : editor.validator.accountNumber}
          />
      );
    }
    return (
        <Form.Custom
          name="accountNumber"
          value={x => <ACC.Renderers.SimpleString>{x.bankDetails.accountNumber}</ACC.Renderers.SimpleString>}
          labelContent={x => x.projectSetupBankDetails.partnerLabels.accountNumber()}
          update={_ => null}
        />
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
              validateBankDetails: submit,
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
                // TODO use correct type here
                if (e && e.results && e.results.bankCheckValidation && !e.results.bankCheckValidation.isValid) {
                  dto.bankCheckValidationAttempts += 1;
                }
              },
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
