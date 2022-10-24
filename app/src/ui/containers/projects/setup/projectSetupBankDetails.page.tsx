import { useNavigate } from "react-router-dom";
import * as ACC from "@ui/components";
import { FormBuilder } from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { BankCheckStatus, BankDetailsTaskStatus, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { Pending } from "@shared/pending";
import { IEditorStore, useStores } from "@ui/redux";
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
          <ACC.BackLink
            route={this.props.routes.projectSetup.getLink({
              projectId: this.props.projectId,
              partnerId: this.props.partnerId,
            })}
          >
            <ACC.Content value={x => x.pages.projectSetupBankDetails.backLink} />
          </ACC.BackLink>
        }
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title {...project} />}
      >
        {this.renderGuidance()}
        <ACC.Section qa="bank-details-section">
          <Form.Form
            editor={editor}
            onChange={() => this.props.onChange(false, editor.data)}
            onSubmit={() => this.props.onChange(true, editor.data)}
            qa="bank-details-form"
          >
            <Form.Fieldset heading={x => x.pages.projectSetupBankDetails.fieldsetTitleOrganisationInfo}>
              <ACC.Renderers.SimpleString bold>{editor.data.name}</ACC.Renderers.SimpleString>
              <Form.String
                name="companyNumber"
                width={"one-third"}
                value={x => x.bankDetails.companyNumber}
                label={x => x.partnerLabels.companyNumber}
                hint={x => x.partnerLabels.companyNumberHint}
                update={(dto, val) => (dto.bankDetails.companyNumber = val)}
              />
            </Form.Fieldset>
            <Form.Fieldset heading={x => x.pages.projectSetupBankDetails.fieldsetTitleAccountDetails}>
              {this.renderSortCode(editor, Form)}
              {this.renderAccountNumber(editor, Form)}
            </Form.Fieldset>
            {/* TODO: Commenting out in the hope we get an answer from experian in the coming weeks */}
            {/* <Form.Fieldset heading={x => x.pages.projectSetupBankDetails.fieldsetTitleAccountHolder()}>
              <Form.String
                name="firstName"
                width={"one-third"}
                value={x => x.bankDetails.firstName}
                label={x => x.pages.projectSetupBankDetails.partnerLabels.firstName()}
                update={(dto, val) => dto.bankDetails.firstName = val}
              />
              <Form.String
                name="lastName"
                width={"one-third"}
                value={x => x.bankDetails.lastName}
                label={x => x.pages.projectSetupBankDetails.partnerLabels.lastName()}
                update={(dto, val) => dto.bankDetails.lastName = val}
              />
            </Form.Fieldset> */}
            <Form.Fieldset heading={x => x.pages.projectSetupBankDetails.fieldsetTitleBillingAddress}>
              <ACC.Renderers.SimpleString qa={"billingAddressFieldsetGuidance"}>
                <ACC.Content value={x => x.pages.projectSetupBankDetails.fieldsetGuidanceBillingAddress} />
              </ACC.Renderers.SimpleString>
              <Form.String
                name="accountBuilding"
                width={"one-third"}
                value={x => x.bankDetails.address.accountBuilding}
                label={x => x.partnerLabels.accountBuilding}
                update={(dto, val) => (dto.bankDetails.address.accountBuilding = val)}
              />
              <Form.String
                name="accountStreet"
                width={"one-third"}
                value={x => x.bankDetails.address.accountStreet}
                label={x => x.partnerLabels.accountStreet}
                update={(dto, val) => (dto.bankDetails.address.accountStreet = val)}
              />
              <Form.String
                name="accountLocality"
                width={"one-third"}
                value={x => x.bankDetails.address.accountLocality}
                label={x => x.partnerLabels.accountLocality}
                update={(dto, val) => (dto.bankDetails.address.accountLocality = val)}
              />
              <Form.String
                name="accountTownOrCity"
                width={"one-third"}
                value={x => x.bankDetails.address.accountTownOrCity}
                label={x => x.partnerLabels.accountTownOrCity}
                update={(dto, val) => (dto.bankDetails.address.accountTownOrCity = val)}
              />
              <Form.String
                name="accountPostcode"
                width={"one-third"}
                value={x => x.bankDetails.address.accountPostcode}
                label={x => x.partnerLabels.accountPostcode}
                update={(dto, val) => (dto.bankDetails.address.accountPostcode = val)}
              />
            </Form.Fieldset>
            <Form.Fieldset>
              <Form.Submit>
                <ACC.Content value={x => x.pages.projectSetupBankDetails.submitButton} />
              </Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderGuidance() {
    return (
      <ACC.Section qa={"guidance"}>
        <ACC.Content markdown value={x => x.pages.projectSetupBankDetails.guidanceMessage} />
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
          label={x => x.partnerLabels.sortCode}
          hint={x => x.partnerLabels.sortCodeHint}
          update={(dto, val) => (dto.bankDetails.sortCode = val)}
          validation={
            editor.validator.sortCode.isValid ? editor.validator.bankCheckValidation : editor.validator.sortCode
          }
        />
      );
    }
    return (
      <Form.Custom
        name="sortCode"
        value={x => <ACC.Renderers.SimpleString>{x.bankDetails.sortCode}</ACC.Renderers.SimpleString>}
        label={x => x.partnerLabels.sortCode}
        update={() => null}
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
          label={x => x.partnerLabels.accountNumber}
          hint={x => x.partnerLabels.accountNumberHint}
          update={(dto, val) => (dto.bankDetails.accountNumber = val)}
          validation={
            editor.validator.accountNumber.isValid
              ? editor.validator.bankCheckValidation
              : editor.validator.accountNumber
          }
        />
      );
    }
    return (
      <Form.Custom
        name="accountNumber"
        value={x => <ACC.Renderers.SimpleString>{x.bankDetails.accountNumber}</ACC.Renderers.SimpleString>}
        label={x => x.partnerLabels.accountNumber}
        update={() => null}
      />
    );
  }
}

const ProjectSetupBankDetailsContainer = (props: ProjectSetupBankDetailsParams & BaseProps) => {
  const stores = useStores();
  const navigate = useNavigate();
  return (
    <ProjectSetupBankDetailsComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      editor={stores.partners.getPartnerEditor(props.projectId, props.partnerId, dto => {
        dto.bankDetailsTaskStatus = BankDetailsTaskStatus.Incomplete;
      })}
      onChange={(submit, dto) => {
        stores.partners.updatePartner(submit, props.partnerId, dto, {
          validateBankDetails: submit,
          onComplete: resp => {
            if (resp.bankCheckStatus === BankCheckStatus.ValidationFailed) {
              navigate(
                props.routes.failedBankCheckConfirmation.getLink({
                  projectId: props.projectId,
                  partnerId: props.partnerId,
                }).path,
              );
            } else {
              navigate(
                props.routes.projectSetupBankDetailsVerify.getLink({
                  projectId: props.projectId,
                  partnerId: props.partnerId,
                }).path,
              );
            }
          },
          onError: e => {
            // TODO use correct type here
            if (e && e.results && e.results.bankCheckValidation && !e.results.bankCheckValidation.isValid) {
              dto.bankCheckRetryAttempts += 1;
            }
          },
        });
      }}
    />
  );
};

export const ProjectSetupBankDetailsRoute = defineRoute({
  routeName: "projectSetupBankDetails",
  routePath: "/projects/:projectId/setup/:partnerId/bank-details",
  container: ProjectSetupBankDetailsContainer,
  getParams: route => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectSetupBankDetails.title),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
