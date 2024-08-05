import { DocumentDescription } from "@framework/constants/documentDescription";
import { ProjectRole } from "@framework/constants/project";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEdit } from "@ui/components/atomicDesign/organisms/documents/DocumentView/ProjectDocumentView.withFragment";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { useForm } from "react-hook-form";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { FileInput } from "@ui/components/atomicDesign/atoms/form/FileInput/FileInput";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { projectSetupBankStatementQuery } from "./ProjectSetupBankStatement.query";
import { FormTypes } from "@ui/zod/FormTypes";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useSetupBankStatementActions, useSetupBankStatementData } from "./projectSetupBankStatement.logic";
import { z } from "zod";
import {
  UploadBankStatementSchemaType,
  documentsErrorMap,
  getBankStatementUpload,
} from "@ui/zod/documentValidators.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClientConfig } from "@ui/context/ClientConfigProvider";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { useClearMessagesOnBlurOrChange } from "@framework/api-helpers/useClearMessagesOnBlurOrChange";

export interface ProjectSetupBankStatementParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

const ProjectSetupBankStatementComponent = (props: BaseProps & ProjectSetupBankStatementParams) => {
  const projectSetupParams = { projectId: props.projectId, partnerId: props.partnerId };
  const projectSetupRoute = props.routes.projectSetup.getLink(projectSetupParams);

  const config = useClientConfig();

  const { projectId, partnerId } = props;
  const [refreshedQueryOptions, refresh] = useRefreshQuery(projectSetupBankStatementQuery, {
    projectId,
    partnerId,
  });

  const onBlurOrChange = useClearMessagesOnBlurOrChange();

  const { fragmentRef } = useSetupBankStatementData(projectId, partnerId, refreshedQueryOptions);

  const { register, reset, getFieldState, handleSubmit, setError, formState } = useForm<
    z.output<UploadBankStatementSchemaType>
  >({
    resolver: zodResolver(getBankStatementUpload(config.options), {
      errorMap: documentsErrorMap,
    }),
  });

  const { isFetching, apiError, onChange, onDelete } = useSetupBankStatementActions(refresh, reset, projectId);

  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const allErrors = useZodErrors<z.output<UploadBankStatementSchemaType>>(setError, formState.errors);

  return (
    <Page
      backLink={
        <BackLink route={projectSetupRoute} disabled={isFetching}>
          <Content value={x => x.pages.projectSetupBankStatement.backLink} />
        </BackLink>
      }
      apiError={apiError}
      validationErrors={allErrors}
      fragmentRef={fragmentRef}
    >
      <Messages messages={props.messages} />

      <Section qa="guidance">
        <Content markdown value={x => x.pages.projectSetupBankStatement.guidanceMessage} />
      </Section>

      <Section>
        <Form
          encType="multipart/form-data"
          onBlur={onBlurOrChange}
          onChange={onBlurOrChange}
          onSubmit={handleSubmit(onChange)}
          aria-disabled={isFetching}
        >
          <Fieldset>
            {/* Discriminate between upload button/delete button */}
            <input type="hidden" value={FormTypes.ProjectLevelUpload} {...register("form")} />
            <input type="hidden" value={projectId} {...register("projectId")} />
            <input type="hidden" value={partnerId} {...register("partnerId")} />
            <input type="hidden" {...register("description")} value={DocumentDescription.BankStatement} />
            <DocumentGuidance />

            <FormGroup hasError={!!getFieldState("files").error}>
              <ValidationError error={getFieldState("files").error} />
              <FileInput
                disabled={isFetching}
                id="attachment"
                hasError={!!getFieldState("files").error}
                multiple
                {...register("files")}
              />
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <Button type="submit" name="button_default" secondary disabled={isFetching}>
              <Content value={x => x.documentMessages.uploadTitle} />
            </Button>
          </Fieldset>
        </Form>
      </Section>

      <Section>
        <DocumentEdit
          hideHeader
          hideSubtitle
          qa="setup-bank-statement-documents"
          onRemove={onDelete}
          formType={FormTypes.ProjectLevelDelete}
          disabled={isFetching}
        />
      </Section>

      <Section qa="submit-bank-statement">
        <Form data-qa="submit-bank-statement-form">
          <Fieldset>
            <Button type="submit" disabled={isFetching}>
              <Content value={x => x.pages.projectSetupBankStatement.buttonSubmit} />
            </Button>
            <Link
              disabled={isFetching}
              styling="SecondaryButton"
              route={props.routes.projectSetup.getLink({
                projectId: props.projectId,
                partnerId: props.partnerId,
              })}
            >
              <Content value={x => x.pages.projectSetupBankStatement.buttonReturn} />
            </Link>
          </Fieldset>
        </Form>
      </Section>
    </Page>
  );
};

export const ProjectSetupBankStatementRoute = defineRoute<ProjectSetupBankStatementParams>({
  routeName: "projectSetupBankStatement",
  routePath: "/projects/:projectId/setup/:partnerId/bank-statement",
  container: ProjectSetupBankStatementComponent,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
  }),
  getTitle: x => x.content.getTitleCopy(x => x.pages.projectSetupBankStatement.title),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
