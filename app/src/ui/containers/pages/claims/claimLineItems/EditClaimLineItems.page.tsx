import { useOnClaimLineItemsSubmit } from "@framework/api-helpers/onClaimLineItemsSubmit";
import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { ProjectRole } from "@framework/constants/project";
import { createRegisterButton } from "@framework/util/registerButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { SubmitButton } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { Textarea } from "@ui/components/atomicDesign/atoms/form/TextArea/Textarea";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { AwardRateOverridesMessage } from "@ui/components/atomicDesign/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage.withFragment";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { CharacterCount } from "@ui/components/bjss/inputs/CharacterCount";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { FormTypes } from "@ui/zod/FormTypes";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ClaimLineItemsParams, getParams, useBackLink, useClaimLineItemsData } from "./ClaimLineItems.logic";
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
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";

interface EditClaimLineItemsProps extends ClaimLineItemsParams {
  mode: "prepare";
}

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

  const defaults = useServerInput<z.output<EditClaimLineItemsSchemaType>>();
  const initialLineItems = useMapToInitialLineItems(defaults?.lineItems ?? claimDetails.lineItems);
  const formMethods = useForm<z.output<EditClaimLineItemsSchemaType>>({
    resolver: zodResolver(editClaimLineItemsSchema, { errorMap: editClaimLineItemErrorMap }),
    defaultValues: {
      lineItems: initialLineItems,
      comments: defaults?.comments,
    },
  });
  const { register, handleSubmit, setValue, setError, formState, watch } = formMethods;
  const registerButton = createRegisterButton<z.output<EditClaimLineItemsSchemaType>>(setValue, "form");
  const { onUpdate, isFetching } = useOnClaimLineItemsSubmit();
  const onSubmitUpdate = (dto: z.output<EditClaimLineItemsSchemaType>) => {
    onUpdate({
      data: dto,
    });
  };

  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const allErrors = useZodErrors(setError, formState.errors);

  return (
    <Page
      backLink={<BackLink route={backLink}>{getContent(x => x.pages.claimLineItems.backLink)}</BackLink>}
      pageTitle={
        <Title title={project.title} projectNumber={project.projectNumber} heading={currentCostCategory.name} />
      }
      fragmentRef={fragmentRef}
      validationErrors={allErrors}
    >
      {/* Update the HTML title to include the costCategoryName */}
      <Helmet>
        <title>{getContent(x => x.pages.claimLineItems.htmlPrepareTitle({ title: currentCostCategory.name }))}</title>
      </Helmet>

      <AwardRateOverridesMessage />
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

        <FormGroup>
          <Legend>{getContent(x => x.pages.editClaimLineItems.headerAdditionalInformation)}</Legend>
          <Hint id="hint-for-explaination">
            {getContent(x => x.pages.editClaimLineItems.hintAdditionalInformation)}
          </Hint>
          <CharacterCount count={watch("comments")?.length ?? 0} type="descending" maxValue={32768}>
            <Textarea id="explaination" disabled={isFetching} {...register("comments")} />
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
    auth.forPartner(params.projectId, params.partnerId).hasRole(ProjectRole.FinancialContact),
});

export { ClaimLineItemsParams, EditClaimLineItemsRoute };
