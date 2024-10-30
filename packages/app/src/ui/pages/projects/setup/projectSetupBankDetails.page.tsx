import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { BankCheckStatus } from "@framework/constants/partner";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { TValidationError } from "@framework/mappers/mapRhfError";
import { zodResolver } from "@hookform/resolvers/zod";
import { BackLink } from "@ui/components/atoms/Links/links";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { Label } from "@ui/components/atoms/form/Label/Label";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { TextInput } from "@ui/components/atoms/form/TextInput/TextInput";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { Content } from "@ui/components/molecules/Content/content";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { Field } from "@ui/components/molecules/form/Field/Field";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { FormTypes } from "@ui/zod/FormTypes";
import { UseFormRegister, useForm } from "react-hook-form";
import { z } from "zod";
import { useOnUpdateProjectSetupBankDetails, useProjectSetupBankDetailsQuery } from "./projectSetupBankDetails.logic";
import {
  ProjectSetupBankDetailsSchemaType,
  getProjectSetupBankDetailsSchema,
  projectSetupBankDetailsErrorMap,
} from "./projectSetupBankDetails.zod";

export interface ProjectSetupBankDetailsParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

const ProjectSetupBankDetailsPage = (props: BaseProps & ProjectSetupBankDetailsParams) => {
  const { getContent: c } = useContent();
  const { partner, fragmentRef } = useProjectSetupBankDetailsQuery(props.projectId, props.partnerId);

  const defaults = useServerInput<z.output<ProjectSetupBankDetailsSchemaType>>();

  const { register, handleSubmit, formState, setError, getFieldState } = useForm<
    z.output<ProjectSetupBankDetailsSchemaType>
  >({
    resolver: zodResolver(getProjectSetupBankDetailsSchema(partner.bankCheckStatus), {
      errorMap: projectSetupBankDetailsErrorMap,
    }),
    reValidateMode: "onBlur",
  });

  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const allErrors = useZodErrors<z.output<ProjectSetupBankDetailsSchemaType>>(setError, formState.errors);

  const { onUpdate, apiError, isFetching } = useOnUpdateProjectSetupBankDetails(
    props.projectId,
    props.partnerId,
    partner,
    {
      setError,
    },
  );

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
      validationErrors={allErrors}
      fragmentRef={fragmentRef}
    >
      <Guidance />

      <Section qa="bank-details-section">
        <Form onSubmit={handleSubmit(data => onUpdate({ data }))} data-qa="bank-details-form">
          <input type="hidden" {...register("form")} value={FormTypes.ProjectSetupBankDetails} />
          <input type="hidden" {...register("projectId")} value={props.projectId} />
          <input type="hidden" {...register("partnerId")} value={props.partnerId} />

          <Fieldset>
            <Legend>{c(x => x.pages.projectSetupBankDetails.fieldsetTitleOrganisationInfo)}</Legend>
            <P bold>{partner.name}</P>

            <FormGroup hasError={!!getFieldState("companyNumber").error}>
              <Label htmlFor="companyNumber">{c(x => x.partnerLabels.companyNumber)}</Label>
              <Hint id="hint-for-companyNumber">{c(x => x.partnerLabels.companyNumberHint)}</Hint>
              <ValidationError error={getFieldState("companyNumber").error} />
              <TextInput
                disabled={isFetching}
                inputWidth="one-third"
                {...register("companyNumber")}
                defaultValue={defaults?.companyNumber ?? partner.bankDetails.companyNumber ?? undefined}
                hasError={!!getFieldState("companyNumber").error}
              />
            </FormGroup>
          </Fieldset>

          <Fieldset id="bankCheckValidation">
            <Legend>{c(x => x.pages.projectSetupBankDetails.fieldsetTitleAccountDetails)}</Legend>

            <SortCode
              partner={partner}
              disabled={isFetching}
              register={register}
              error={getFieldState("bankCheckValidation").error ?? getFieldState("sortCode").error}
              defaultValue={partner.bankDetails.sortCode ?? undefined}
            />

            <AccountNumber
              partner={partner}
              disabled={isFetching}
              register={register}
              error={getFieldState("bankCheckValidation").error ?? getFieldState("accountNumber").error}
              defaultValue={partner.bankDetails.accountNumber ?? undefined}
            />
          </Fieldset>

          <Fieldset>
            <Legend>{c(x => x.pages.projectSetupBankDetails.fieldsetTitleBillingAddress)}</Legend>

            <P>{c(x => x.pages.projectSetupBankDetails.fieldsetGuidanceBillingAddress)}</P>

            <FormGroup hasError={!!getFieldState("accountBuilding").error}>
              <Label htmlFor="accountBuilding">{c(x => x.partnerLabels.accountBuilding)}</Label>
              <ValidationError error={getFieldState("accountBuilding").error} />
              <TextInput
                disabled={isFetching}
                inputWidth="one-third"
                {...register("accountBuilding")}
                defaultValue={defaults?.accountBuilding ?? partner.bankDetails.address.accountBuilding ?? undefined}
                hasError={!!getFieldState("accountBuilding").error}
              />
            </FormGroup>

            <FormGroup hasError={!!getFieldState("accountStreet").error}>
              <Label htmlFor="accountStreet">{c(x => x.partnerLabels.accountStreet)}</Label>
              <ValidationError error={getFieldState("accountStreet").error} />
              <TextInput
                disabled={isFetching}
                inputWidth="one-third"
                {...register("accountStreet")}
                defaultValue={defaults?.accountStreet ?? partner.bankDetails.address.accountStreet ?? undefined}
                hasError={!!getFieldState("accountStreet").error}
              />
            </FormGroup>

            <FormGroup hasError={!!getFieldState("accountLocality").error}>
              <Label htmlFor="accountLocality">{c(x => x.partnerLabels.accountLocality)}</Label>
              <ValidationError error={getFieldState("accountLocality").error} />
              <TextInput
                disabled={isFetching}
                inputWidth="one-third"
                {...register("accountLocality")}
                defaultValue={defaults?.accountLocality ?? partner.bankDetails.address.accountLocality ?? undefined}
                hasError={!!getFieldState("accountLocality").error}
              />
            </FormGroup>

            <FormGroup hasError={!!getFieldState("accountTownOrCity").error}>
              <Label htmlFor="accountTownOrCity">{c(x => x.partnerLabels.accountTownOrCity)}</Label>
              <ValidationError error={getFieldState("accountTownOrCity").error} />
              <TextInput
                disabled={isFetching}
                inputWidth="one-third"
                {...register("accountTownOrCity")}
                defaultValue={defaults?.accountTownOrCity ?? partner.bankDetails.address.accountTownOrCity ?? undefined}
                hasError={!!getFieldState("accountTownOrCity").error}
              />
            </FormGroup>

            <FormGroup hasError={!!getFieldState("accountPostcode").error}>
              <Label htmlFor="accountPostcode">{c(x => x.partnerLabels.accountPostcode)}</Label>
              <ValidationError error={getFieldState("accountPostcode").error} />
              <TextInput
                disabled={isFetching}
                inputWidth="one-third"
                {...register("accountPostcode")}
                defaultValue={defaults?.accountPostcode ?? partner.bankDetails.address.accountPostcode ?? undefined}
              />
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <Button disabled={isFetching} type="submit">
              {c(x => x.pages.projectSetupBankDetails.submitButton)}
            </Button>
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
  disabled,
  defaultValue,
}: {
  partner: Pick<PartnerDto, "bankCheckStatus" | "bankDetails">;
  register: UseFormRegister<z.output<ProjectSetupBankDetailsSchemaType>>;
  error?: TValidationError;
  disabled: boolean;
  defaultValue?: string;
}) => {
  const { getContent: c } = useContent();
  if (partner.bankCheckStatus === BankCheckStatus.NotValidated) {
    return (
      <FormGroup hasError={!!error}>
        <Label htmlFor="sortCode">{c(x => x.partnerLabels.sortCode)}</Label>
        <Hint id="hint-for-sortCode">{c(x => x.partnerLabels.sortCodeHint)}</Hint>
        <ValidationError error={error} />
        <TextInput
          disabled={disabled}
          hasError={!!error}
          inputWidth="one-third"
          {...register("sortCode", { required: true })}
          defaultValue={defaultValue}
        ></TextInput>
      </FormGroup>
    );
  }

  return (
    <FormGroup>
      <Label htmlFor="sortCode">{c(x => x.partnerLabels.sortCode)}</Label>
      <P>{partner.bankDetails.sortCode}</P>
      <input type="hidden" id="sortCode" name="sortCode" />
    </FormGroup>
  );
};

const AccountNumber = ({
  partner,
  register,
  error,
  disabled,
  defaultValue,
}: {
  partner: Pick<PartnerDto, "bankCheckStatus" | "bankDetails">;
  register: UseFormRegister<z.output<ProjectSetupBankDetailsSchemaType>>;
  disabled: boolean;
  error?: TValidationError;
  defaultValue?: string;
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
        <TextInput
          disabled={disabled}
          hasError={!!error}
          {...register("accountNumber", { required: true })}
          inputWidth="one-third"
          defaultValue={defaultValue}
        />
      </Field>
    );
  }
  return (
    <FormGroup>
      <Label htmlFor="accountNumber">{c(x => x.partnerLabels.accountNumber)}</Label>
      <P>{partner.bankDetails.accountNumber}</P>
      <input type="hidden" id="accountNumber" name="accountNumber" />
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
    auth.forPartner(projectId, partnerId).hasRole(ProjectRolePermissionBits.FinancialContact),
});
