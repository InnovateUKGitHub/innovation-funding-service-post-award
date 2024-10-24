import { useOnClaimLineItemsSubmit } from "@ui/pages/claims/claimLineItems/onClaimLineItemsSubmit";
import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { createRegisterButton } from "@framework/util/registerButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { BackLink } from "@ui/components/atoms/Links/links";
import { SubmitButton } from "@ui/components/atoms/form/Button/Button";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { Textarea } from "@ui/components/atoms/form/TextArea/Textarea";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { AwardRateOverridesMessage } from "@ui/components/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage.withFragment";
import { CharacterCount } from "@ui/components/atoms/CharacterCount/CharacterCount";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { FormTypes } from "@ui/zod/FormTypes";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getParams, useBackLink, useClaimLineItemsData } from "./ClaimLineItems.logic";
import type { ClaimLineItemsParams } from "./ClaimLineItems.logic";
import { EditClaimLineItemsTable } from "./ClaimLineItemsTable";
import { DeleteByEnteringZero, isNotAuthorOfLineItems } from "./DeleteByEnteringZero";
import { DocumentUploadLinkGuidance } from "./DocumentUploadLinkGuidance";
import { GuidanceSection } from "./GuidanceSection";
import { NegativeClaimWarning } from "./NegativeClaimWarning";
import { SupportingDocumentsSection } from "./SupportingDocumentsSection";
import {
  EditClaimLineItemsSchemaType,
  editClaimLineItemErrorMap,
  editClaimLineItemsSchema,
} from "./editClaimLineItems.zod";
import { useMapToInitialLineItems } from "./useMapToClaimLineItemTableDto";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";

type EditClaimLineItemsProps = ClaimLineItemsParams & {
  mode: "prepare";
};

const EditClaimLineItemsPage = ({
  projectId,
  partnerId,
  periodId,
  costCategoryId,
  mode,
}: BaseProps & EditClaimLineItemsProps) => {
  const { getContent } = useContent();
  const backLink = useBackLink({ projectId, partnerId, periodId }, mode);
  const { project, claimDetails, currentCostCategory, forecastDetail, documents, fragmentRef } = useClaimLineItemsData(
    projectId,
    partnerId,
    periodId,
    costCategoryId,
  );

  const previousInputs = useServerInput<z.output<EditClaimLineItemsSchemaType>>();
  const initialLineItems = useMapToInitialLineItems(previousInputs?.lineItems ?? claimDetails.lineItems ?? []);
  const formMethods = useForm<z.output<EditClaimLineItemsSchemaType>>({
    resolver: zodResolver(editClaimLineItemsSchema, { errorMap: editClaimLineItemErrorMap }),
    defaultValues: {
      lineItems: initialLineItems,
      comments: previousInputs?.comments ?? claimDetails.comments ?? "",
    },
  });
  const { register, handleSubmit, setValue, setError, formState, watch, getFieldState } = formMethods;
  const registerButton = createRegisterButton<z.output<EditClaimLineItemsSchemaType>>(setValue, "form");
  const { onUpdate, isFetching, apiError } = useOnClaimLineItemsSubmit();
  const onSubmitUpdate = (dto: z.output<EditClaimLineItemsSchemaType>) => {
    onUpdate({
      data: dto,
    });
  };

  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const allErrors = useZodErrors(setError, formState.errors);

  const pageTitleHeading = getContent(x =>
    x.pages.claimLineItems.htmlPrepareTitle({ title: currentCostCategory.name.toLowerCase() }),
  );

  return (
    <Page
      backLink={<BackLink route={backLink}>{getContent(x => x.pages.claimLineItems.backLink)}</BackLink>}
      fragmentRef={fragmentRef}
      validationErrors={allErrors}
      heading={currentCostCategory.name}
      apiError={apiError}
    >
      {/* Update the HTML title to include the costCategoryName*/}
      <Helmet>
        <title>{pageTitleHeading}</title>
      </Helmet>

      <AwardRateOverridesMessage currentCostCategoryId={costCategoryId} currentPeriod={periodId} />
      <NegativeClaimWarning claimDetails={claimDetails} />
      {isNotAuthorOfLineItems(claimDetails) && <DeleteByEnteringZero />}
      <GuidanceSection project={project} costCategory={currentCostCategory} />

      <Form onSubmit={handleSubmit(onSubmitUpdate)}>
        <input type="hidden" {...register("projectId")} value={projectId} />
        <input type="hidden" {...register("partnerId")} value={partnerId} />
        <input type="hidden" {...register("periodId")} value={periodId} />
        <input type="hidden" {...register("costCategoryId")} value={costCategoryId} />

        <Section>
          <EditClaimLineItemsTable
            formMethods={formMethods}
            lineItems={claimDetails.lineItems}
            forecastDetail={forecastDetail}
            disabled={isFetching}
            differenceRow={true}
            boldTotalCosts={false}
            caption={getContent(x => x.pages.editClaimLineItems.tableCaption)}
          />
        </Section>

        <Section title={getContent(x => x.pages.claimLineItems.supportingDocumentsTitle)}>
          <DocumentUploadLinkGuidance project={project} params={{ projectId, partnerId, periodId, costCategoryId }} />

          <SubmitButton
            styling="Secondary"
            disabled={isFetching}
            {...registerButton(FormTypes.ClaimLineItemSaveAndDocuments)}
          >
            {getContent(x => x.pages.editClaimLineItems.buttonUploadAndRemoveDocuments)}
          </SubmitButton>
        </Section>

        <SupportingDocumentsSection mode={mode} project={project} documents={documents} />

        <FormGroup hasError={!!getFieldState("comments").error}>
          <Legend>{getContent(x => x.pages.editClaimLineItems.headerAdditionalInformation)}</Legend>
          <Hint id="hint-for-explanation">{getContent(x => x.pages.editClaimLineItems.hintAdditionalInformation)}</Hint>
          <ValidationError error={getFieldState("comments").error} />
          <CharacterCount count={watch("comments")?.length ?? 0} type="descending" maxValue={32768}>
            <Textarea id="explanation" disabled={isFetching} {...register("comments")} />
          </CharacterCount>
        </FormGroup>

        <SubmitButton disabled={isFetching} {...registerButton(FormTypes.ClaimLineItemSaveAndQuit)}>
          {getContent(x => x.pages.editClaimLineItems.buttonSaveAndReturn)}
        </SubmitButton>
      </Form>
    </Page>
  );
};

const EditClaimLineItemsRoute = defineRoute<ClaimLineItemsParams>({
  allowRouteInActiveAccess: true,
  routeName: "claimLineItemEdit",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/costs/:costCategoryId",
  container: props => <EditClaimLineItemsPage {...props} mode="prepare" />,
  getParams: route => getParams(route),
  accessControl: (auth, params) =>
    auth.forPartner(params.projectId, params.partnerId).hasRole(ProjectRolePermissionBits.FinancialContact),
});

export { ClaimLineItemsParams, EditClaimLineItemsRoute };
