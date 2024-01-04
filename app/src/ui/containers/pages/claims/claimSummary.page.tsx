import { useContent } from "@ui/hooks/content.hook";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { claimCommentsMaxLength } from "@ui/validation/validators/claimDtoValidator";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { ProjectRole } from "@framework/constants/project";
import { ClaimDto } from "@framework/dtos/claimDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { roundCurrency } from "@framework/util/numberHelper";
import { AwardRateOverridesMessage } from "@ui/components/atomicDesign/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage.withFragment";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentsUnavailable } from "@ui/components/atomicDesign/organisms/documents/DocumentsUnavailable/DocumentsUnavailable";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title.withFragment";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { Percentage } from "@ui/components/atomicDesign/atoms/Percentage/percentage";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { ClaimPeriodDate } from "@ui/components/atomicDesign/organisms/claims/ClaimPeriodDate/claimPeriodDate";
import { checkPcfNotSubmittedForFinalClaim } from "@ui/helpers/checkPcfNotSubmittedForFinalClaim";
import { useClaimSummaryData, useOnUpdateClaimSummary } from "./claimSummary.logic";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { useForm } from "react-hook-form";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { TextAreaField } from "@ui/components/atomicDesign/molecules/form/TextFieldArea/TextAreaField";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClaimSummarySchema, claimSummaryErrorMap, getClaimSummarySchema } from "./claimSummary.zod";
import { createRegisterButton } from "@framework/util/registerButton";
import { DocumentView } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";

export interface ClaimSummaryParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}

type LinkProps = ClaimSummaryParams;

const ClaimSummaryPage = (props: BaseProps & ClaimSummaryParams) => {
  const data = useClaimSummaryData(props.projectId, props.partnerId, props.periodId);
  const { isLoans } = checkProjectCompetition(data.project.competitionType);

  const { getContent } = useContent();

  const linkProps: LinkProps = {
    projectId: props.projectId,
    partnerId: props.partnerId,
    periodId: props.periodId,
  };

  const { isMo } = getAuthRoles(data.project.roles);

  // Disable completing the form if impact management and not received PCF
  const { checkForFileOnSubmit, imDisabled } = checkPcfNotSubmittedForFinalClaim(data.claim);

  const { isPmOrMo } = getAuthRoles(data.project.roles);

  const updateLink = isPmOrMo
    ? props.routes.allClaimsDashboard.getLink({ projectId: props.projectId })
    : props.routes.claimsDashboard.getLink({ projectId: props.projectId, partnerId: props.partnerId });

  const { onUpdate, apiError, isFetching } = useOnUpdateClaimSummary(
    props.partnerId,
    props.projectId,
    props.periodId,
    updateLink.path,
    data.claim,
    data.project.monitoringLevel,
  );

  const { register, formState, handleSubmit, watch, setValue } = useForm<ClaimSummarySchema>({
    defaultValues: {
      status: data.claim.status,
      comments: data.claim.comments ?? "",
      button_submit: "submit",
      documents: data.documents,
    },
    resolver: zodResolver(
      getClaimSummarySchema({
        iarRequired: data.claim.isIarRequired,
        pcfRequired: checkForFileOnSubmit,
      }),
      { errorMap: claimSummaryErrorMap },
    ),
  });

  const registerButton = createRegisterButton(setValue, "button_submit");

  const validationErrors = useRhfErrors(formState.errors);
  const commentsCharacterCount = watch("comments").length;

  const disabled = imDisabled || isFetching;

  return (
    <Page
      backLink={
        data.claim.isFinalClaim ? (
          <BackLink route={props.routes.claimDocuments.getLink(linkProps)}>
            <Content value={x => x.pages.claimPrepareSummary.backToDocuments} />
          </BackLink>
        ) : (
          <BackLink route={props.routes.claimForecast.getLink(linkProps)}>
            <Content value={x => x.pages.claimPrepareSummary.backToForecast} />
          </BackLink>
        )
      }
      apiError={apiError}
      pageTitle={<Title />}
      validationErrors={validationErrors}
      fragmentRef={data.fragmentRef}
    >
      {data.totalCosts.totalCostsClaimed < 0 && (
        <ValidationMessage
          qa="summary-warning"
          messageType="info"
          message={x => x.claimsMessages.claimSummaryWarning}
        />
      )}

      <Section qa="claimSummaryForm" title={<ClaimPeriodDate claim={data.claim} />}>
        {imDisabled &&
          (isMo ? (
            <ValidationMessage
              messageType="info"
              message={<Content value={x => x.claimsMessages.moIarPcfMissingFinalClaim} markdown />}
            />
          ) : (
            <ValidationMessage
              messageType="info"
              message={<Content value={x => x.claimsMessages.applicantIarPcfMissingFinalClaim} markdown />}
            />
          ))}
        {data.claim.isFinalClaim && (
          <ValidationMessage messageType="info" message={<Content value={x => x.claimsMessages.finalClaim} />} />
        )}

        <Section
          title={<Content value={x => x.pages.claimPrepareSummary.costsTitle} />}
          qa="costs-to-be-claimed-summary"
        >
          <AwardRateOverridesMessage currentPeriod={props.periodId} />

          <SummaryList qa="costs-to-be-claimed-summary-list">
            <SummaryListItem
              label={x => x.pages.claimPrepareSummary.costsClaimedLabel}
              content={<Currency value={data.totalCosts.totalCostsClaimed} />}
              qa="totalCostsClaimed"
            />

            <SummaryListItem
              label={x => x.pages.claimPrepareSummary.fundingLevelLabel}
              content={<Percentage value={data.partner.awardRate} />}
              qa="fundingLevel"
            />

            {!isLoans && (
              <SummaryListItem
                label={x => x.pages.claimPrepareSummary.costsToBePaidLabel}
                content={<Currency value={data.totalCosts.totalCostsPaid} />}
                qa="totalCostsPaid"
              />
            )}
          </SummaryList>

          <P>
            <Link id="editCostsToBeClaimedLink" route={props.routes.prepareClaim.getLink(linkProps)}>
              <Content value={x => x.pages.claimPrepareSummary.editCostsMessage} />
            </Link>
          </P>
        </Section>

        <Section
          title={<Content value={x => x.pages.claimPrepareSummary.claimDocumentsTitle} />}
          qa="claim-documents-summary"
        >
          <DocumentValidation {...props} {...data} linkProps={linkProps} />
        </Section>

        {!data.claim.isFinalClaim && <ForecastSummary linkProps={linkProps} {...props} {...data} />}

        <Form data-qa="summary-form" onSubmit={handleSubmit(data => onUpdate({ data, context: { updateLink } }))}>
          <Fieldset>
            <Legend>{getContent(x => x.pages.claimPrepareSummary.addCommentsHeading)}</Legend>

            <TextAreaField
              {...register("comments")}
              id="comments"
              hint={getContent(x => x.pages.claimPrepareSummary.addCommentsHint)}
              characterCount={commentsCharacterCount}
              characterCountMax={claimCommentsMaxLength}
              defaultValue={data.claim.comments ?? ""}
              disabled={disabled}
            />
          </Fieldset>

          <Fieldset>
            <P>{getContent(x => x.claimsMessages.submitClaimConfirmation)}</P>

            <Button disabled={disabled} type="submit" {...registerButton("submit")}>
              {getContent(x => x.pages.claimPrepareSummary.submitClaimMessage)}
            </Button>

            <Button disabled={disabled} type="submit" secondary {...registerButton("saveAndReturnToClaims")}>
              {getContent(x => x.pages.claimPrepareSummary.saveAndReturnMessage)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </Page>
  );
};

const DocumentValidation = (
  props: { claim: Pick<ClaimDto, "isIarRequired">; documents: DocumentSummaryDto[] } & {
    linkProps: LinkProps;
    routes: BaseProps["routes"];
  },
) => {
  const displayDocumentError = props.claim.isIarRequired && !props.documents.length;

  const editDocumentLink = (
    <SimpleString>
      <Link id="claimDocumentsLink" route={props.routes.claimDocuments.getLink(props.linkProps)}>
        <Content value={x => x.pages.claimPrepareSummary.editClaimDocuments} />
      </Link>
    </SimpleString>
  );

  return displayDocumentError ? (
    <ValidationMessage
      messageType="error"
      message={
        <>
          <SimpleString>
            <Content value={x => x.pages.claimPrepareSummary.finalClaimSupportingDocumentMessage} />
          </SimpleString>

          {editDocumentLink}
        </>
      }
    />
  ) : (
    <>
      {props.documents.length ? (
        <Section qa="supporting-documents-section">
          <DocumentView hideHeader qa="claim-documents-list" documents={props.documents} />
        </Section>
      ) : (
        <DocumentsUnavailable />
      )}

      {editDocumentLink}
    </>
  );
};

const ForecastSummary = ({
  linkProps,
  partner,
  claim,
  routes,
}: {
  linkProps: LinkProps;
  claim: Pick<ClaimDto, "totalCost">;
  routes: BaseProps["routes"];
  partner: Pick<
    PartnerDto,
    "totalParticipantGrant" | "totalFutureForecastsForParticipants" | "totalParticipantCostsClaimed"
  >;
}) => {
  const totalEligibleCosts = partner.totalParticipantGrant || 0;
  const totalForecastsAndCosts =
    (partner.totalFutureForecastsForParticipants || 0) +
    (partner.totalParticipantCostsClaimed || 0) +
    (claim.totalCost || 0);

  const difference = roundCurrency(totalEligibleCosts - totalForecastsAndCosts);
  const differencePercentage = totalEligibleCosts > 0 ? (difference * 100) / totalEligibleCosts : 0;
  const editForecastMessage = <Content value={x => x.pages.claimPrepareSummary.editForecastMessage} />;
  const forecastTitle = <Content value={x => x.pages.claimPrepareSummary.forecastTitle} />;

  return (
    <Section title={forecastTitle} qa="forecast-summary">
      <SummaryList qa="forecast-summary-list">
        <SummaryListItem
          label={x => x.pages.claimPrepareSummary.eligibleCostsLabel}
          content={<Currency value={totalEligibleCosts} />}
          qa="totalEligibleCosts"
        />

        <SummaryListItem
          label={x => x.pages.claimPrepareSummary.forecastLabel}
          content={<Currency value={totalForecastsAndCosts} />}
          qa="totalForecastsAndCosts"
        />

        <SummaryListItem
          label={x => x.pages.claimPrepareSummary.differenceLabel}
          content={
            <>
              <Currency value={difference} /> (<Percentage value={differencePercentage} />)
            </>
          }
          qa="differenceEligibleAndForecast"
        />
      </SummaryList>

      <SimpleString>
        <Link id="editForecastLink" route={routes.claimForecast.getLink(linkProps)}>
          {editForecastMessage}
        </Link>
      </SimpleString>
    </Section>
  );
};

export const ClaimSummaryRoute = defineRoute({
  routeName: "claimSummary",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/summary",
  container: ClaimSummaryPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
    periodId: parseInt(route.params.periodId, 10) as PeriodId,
  }),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.claimSummary.title),
});
