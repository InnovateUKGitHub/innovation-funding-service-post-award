import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormRegister, useForm } from "react-hook-form";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { BankCheckStatus } from "@framework/constants/partner";
import { ProjectRole } from "@framework/constants/project";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { Field } from "@ui/components/atomicDesign/molecules/form/Field/Field";
import { projectSetupBankDetailsSchema, projectSetupBankDetailsErrorMap } from "./projectSetupBankDetails.zod";
import {
  useOnUpdateProjectSetupBankDetails,
  useProjectSetupBankDetailsQuery,
  FormValues,
} from "./projectSetupBankDetails.logic";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { useContent } from "@ui/hooks/content.hook";

export interface ProjectSetupBankDetailsParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

const ProjectSetupBankDetailsPage = (props: BaseProps & ProjectSetupBankDetailsParams) => {
  const { getContent: c } = useContent();
  const { project, partner } = useProjectSetupBankDetailsQuery(props.projectId, props.partnerId);

  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      companyNumber: partner.bankDetails.companyNumber ?? "",
      sortCode: partner.bankDetails.sortCode ?? "",
      accountNumber: partner.bankDetails.accountNumber ?? "",
      accountBuilding: partner.bankDetails.address.accountBuilding ?? "",
      accountStreet: partner.bankDetails.address.accountStreet ?? "",
      accountLocality: partner.bankDetails.address.accountLocality ?? "",
      accountTownOrCity: partner.bankDetails.address.accountTownOrCity ?? "",
      accountPostcode: partner.bankDetails.address.accountPostcode ?? "",
    },
    resolver: zodResolver(projectSetupBankDetailsSchema, { errorMap: projectSetupBankDetailsErrorMap }),
  });

  const { onUpdate, apiError } = useOnUpdateProjectSetupBankDetails(props.projectId, props.partnerId, partner);

  const validationErrors = useRhfErrors<FormValues>(formState.errors);

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
      apiError={apiError}
      validationErrors={validationErrors}
      pageTitle={<Title title={project.title} projectNumber={project.projectNumber} />}
    >
      <Guidance />

      <Section qa="bank-details-section">
        <Form onSubmit={handleSubmit(data => onUpdate({ data }))} data-qa="bank-details-form">
          <Fieldset>
            <Legend>{c(x => x.pages.projectSetupBankDetails.fieldsetTitleOrganisationInfo)}</Legend>
            <P bold>{partner.name}</P>

            <FormGroup>
              <Label htmlFor="companyNumber">{c(x => x.partnerLabels.companyNumber)}</Label>
              <Hint id="hint-for-companyNumber">{c(x => x.partnerLabels.companyNumberHint)}</Hint>
              <TextInput inputWidth="one-third" {...register("companyNumber")} />
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <Legend>{c(x => x.pages.projectSetupBankDetails.fieldsetTitleAccountDetails)}</Legend>

            <SortCode partner={partner} register={register} error={validationErrors?.sortCode as RhfErrors} />

            <AccountNumber partner={partner} register={register} error={validationErrors?.accountNumber as RhfErrors} />
          </Fieldset>

          <Fieldset>
            <Legend>{c(x => x.pages.projectSetupBankDetails.fieldsetTitleBillingAddress)}</Legend>

            <P>{c(x => x.pages.projectSetupBankDetails.fieldsetGuidanceBillingAddress)}</P>

            <FormGroup>
              <Label htmlFor="accountBuilding">{c(x => x.partnerLabels.accountBuilding)}</Label>
              <TextInput inputWidth="one-third" {...register("accountBuilding")}></TextInput>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="accountStreet">{c(x => x.partnerLabels.accountStreet)}</Label>
              <TextInput inputWidth="one-third" {...register("accountStreet")}></TextInput>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="accountLocality">{c(x => x.partnerLabels.accountLocality)}</Label>
              <TextInput inputWidth="one-third" {...register("accountLocality")}></TextInput>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="accountTownOrCity">{c(x => x.partnerLabels.accountTownOrCity)}</Label>
              <TextInput inputWidth="one-third" {...register("accountTownOrCity")}></TextInput>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="accountPostcode">{c(x => x.partnerLabels.accountPostcode)}</Label>
              <TextInput inputWidth="one-third" {...register("accountPostcode")}></TextInput>
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <Button type="submit">{c(x => x.pages.projectSetupBankDetails.submitButton)}</Button>
          </Fieldset>
        </Form>
      </Section>
    </Page>
  );
};

const Guidance = () => {
  return (
    <Section qa="guidance">
      <Content markdown value={x => x.pages.projectSetupBankDetails.guidanceMessage} />
    </Section>
  );
};

const SortCode = ({
  partner,
  register,
  error,
}: {
  partner: Pick<PartnerDto, "bankCheckStatus" | "bankDetails">;
  register: UseFormRegister<FormValues>;
  error?: RhfErrors;
}) => {
  const { getContent: c } = useContent();
  if (partner.bankCheckStatus === BankCheckStatus.NotValidated) {
    return (
      <FormGroup hasError={!!error}>
        <Label htmlFor="sortCode">{c(x => x.partnerLabels.sortCode)}</Label>
        <Hint id="hint-for-sortCode">{c(x => x.partnerLabels.sortCodeHint)}</Hint>
        <ValidationError error={error} />
        <TextInput hasError={!!error} inputWidth="one-third" {...register("sortCode", { required: true })}></TextInput>
      </FormGroup>
    );
  }

  return (
    <FormGroup>
      <Label htmlFor="sortCode">{c(x => x.partnerLabels.sortCode)}</Label>
      <P>{partner.bankDetails.sortCode ?? ""}</P>
      <TextInput id="sortCode" name="sortCode" inputWidth="one-third"></TextInput>
    </FormGroup>
  );
};

const AccountNumber = ({
  partner,
  register,
  error,
}: {
  partner: Pick<PartnerDto, "bankCheckStatus" | "bankDetails">;
  register: UseFormRegister<FormValues>;
  error?: RhfErrors;
}) => {
  const { getContent: c } = useContent();
  if (partner.bankCheckStatus === BankCheckStatus.NotValidated) {
    return (
      <Field
        id="accountNumber"
        hint={c(x => x.partnerLabels.accountNumberHint)}
        label={c(x => x.partnerLabels.accountNumber)}
        error={error as RhfError}
      >
        <TextInput hasError={!!error} {...register("accountNumber", { required: true })} inputWidth="one-third" />
      </Field>
    );
  }
  return (
    <FormGroup>
      <Label htmlFor="accountNumber">{c(x => x.partnerLabels.accountNumber)}</Label>
      <P>{partner.bankDetails.accountNumber ?? ""}</P>
      <TextInput id="accountNumber" name="accountNumber" inputWidth="one-third"></TextInput>
    </FormGroup>
  );
};

export const ProjectSetupBankDetailsRoute = defineRoute({
  routeName: "projectSetupBankDetails",
  routePath: "/projects/:projectId/setup/:partnerId/bank-details",
  container: ProjectSetupBankDetailsPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectSetupBankDetails.title),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
