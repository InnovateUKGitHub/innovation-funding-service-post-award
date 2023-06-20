import { useNavigate } from "react-router-dom";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { Pending } from "@shared/pending";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { BankCheckStatus, BankDetailsTaskStatus } from "@framework/constants/partner";
import { ProjectRole } from "@framework/constants/project";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Content } from "@ui/components/content";
import { createTypedForm, FormBuilder } from "@ui/components/form";
import { Page } from "@ui/components/layout/page";
import { Section } from "@ui/components/layout/section";
import { BackLink } from "@ui/components/links";
import { PageLoader } from "@ui/components/loading";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { Title } from "@ui/components/projects/title";

type BankCheckValidationError = {
  results: {
    bankCheckValidation: {
      isValid: boolean;
    };
  };
};

const isBankCheckValidationError = (e: unknown): e is BankCheckValidationError => {
  return (e as BankCheckValidationError)?.results?.bankCheckValidation?.isValid;
};

export interface ProjectSetupBankDetailsParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

interface Data {
  project: Pending<ProjectDto>;
  editor: Pending<IEditorStore<PartnerDto, PartnerDtoValidator>>;
}

interface Callbacks {
  onChange: (submit: boolean, dto: PartnerDto) => void;
}

const Form = createTypedForm<PartnerDto>();
class ProjectSetupBankDetailsComponent extends ContainerBase<ProjectSetupBankDetailsParams, Data, Callbacks> {
  public render() {
    const combined = Pending.combine({ project: this.props.project, editor: this.props.editor });
    return <PageLoader pending={combined} render={x => this.renderContents(x.project, x.editor)} />;
  }
  public renderContents(project: ProjectDto, editor: IEditorStore<PartnerDto, PartnerDtoValidator>) {
    return (
      <Page
        backLink={
          <BackLink
            route={this.props.routes.projectSetup.getLink({
              projectId: this.props.projectId,
              partnerId: this.props.partnerId,
            })}
          >
            <Content value={x => x.pages.projectSetupBankDetails.backLink} />
          </BackLink>
        }
        error={editor.error}
        validator={editor.validator}
        pageTitle={<Title {...project} />}
      >
        {this.renderGuidance()}
        <Section qa="bank-details-section">
          <Form.Form
            editor={editor}
            onChange={() => this.props.onChange(false, editor.data)}
            onSubmit={() => this.props.onChange(true, editor.data)}
            qa="bank-details-form"
          >
            <Form.Fieldset heading={x => x.pages.projectSetupBankDetails.fieldsetTitleOrganisationInfo}>
              <SimpleString bold>{editor.data.name}</SimpleString>
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
              <SimpleString qa={"billingAddressFieldsetGuidance"}>
                <Content value={x => x.pages.projectSetupBankDetails.fieldsetGuidanceBillingAddress} />
              </SimpleString>
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
                <Content value={x => x.pages.projectSetupBankDetails.submitButton} />
              </Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </Section>
      </Page>
    );
  }

  private renderGuidance() {
    return (
      <Section qa={"guidance"}>
        <Content markdown value={x => x.pages.projectSetupBankDetails.guidanceMessage} />
      </Section>
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
        value={({ formData }) => <SimpleString>{formData.bankDetails.sortCode}</SimpleString>}
        label={x => x.partnerLabels.sortCode}
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
        value={({ formData }) => <SimpleString>{formData.bankDetails.accountNumber}</SimpleString>}
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
            if (isBankCheckValidationError(e)) {
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
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectSetupBankDetails.title),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
