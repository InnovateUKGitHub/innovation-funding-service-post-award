import { useNavigate } from "react-router-dom";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { Pending } from "@shared/pending";
import { PartnerDtoValidator } from "@ui/validation/validators/partnerValidator";
import { BankCheckStatus, BankDetailsTaskStatus } from "@framework/constants/partner";
import { ProjectRole } from "@framework/constants/project";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { useProjectSetupBankDetailsQuery } from "./projectSetupBankDetails.logic";

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
  editor: IEditorStore<PartnerDto, PartnerDtoValidator>;
}

interface Callbacks {
  onChange: (submit: boolean, dto: PartnerDto) => void;
}

const Form = createTypedForm<PartnerDto>();

const ProjectSetupBankDetailsComponent = (props: BaseProps & ProjectSetupBankDetailsParams & Data & Callbacks) => {
  const { editor }: { editor: IEditorStore<PartnerDto, PartnerDtoValidator> } = props;
  const { project } = useProjectSetupBankDetailsQuery(props.projectId);
  return (
    <Page
      backLink={
        <BackLink
          route={props.routes.projectSetup.getLink({
            projectId: props.projectId,
            partnerId: props.partnerId,
          })}
        >
          <Content value={x => x.pages.projectSetupBankDetails.backLink} />
        </BackLink>
      }
      error={editor.error}
      validator={editor.validator}
      pageTitle={<Title title={project.title} projectNumber={project.projectNumber} />}
    >
      <Guidance />
      <Section qa="bank-details-section">
        <Form.Form
          editor={editor}
          onChange={() => props.onChange(false, editor.data)}
          onSubmit={() => props.onChange(true, editor.data)}
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
            <SortCode editor={editor} />

            <AccountNumber editor={editor} />
          </Form.Fieldset>

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
};

const Guidance = () => {
  return (
    <Section qa={"guidance"}>
      <Content markdown value={x => x.pages.projectSetupBankDetails.guidanceMessage} />
    </Section>
  );
};

const SortCode = ({ editor }: { editor: IEditorStore<PartnerDto, PartnerDtoValidator> }) => {
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
};

const AccountNumber = ({ editor }: { editor: IEditorStore<PartnerDto, PartnerDtoValidator> }) => {
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
          editor.validator.accountNumber.isValid ? editor.validator.bankCheckValidation : editor.validator.accountNumber
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
};

const ProjectSetupBankDetailsContainer = (props: ProjectSetupBankDetailsParams & BaseProps) => {
  const stores = useStores();
  const navigate = useNavigate();

  const combined = Pending.combine({
    editor: stores.partners.getPartnerEditor(props.projectId, props.partnerId, dto => {
      dto.bankDetailsTaskStatus = BankDetailsTaskStatus.Incomplete;
    }),
  });

  const onChange = (submit: boolean, dto: PartnerDto) => {
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
  };

  return (
    <PageLoader
      pending={combined}
      render={x => <ProjectSetupBankDetailsComponent {...props} onChange={onChange} {...x} />}
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
