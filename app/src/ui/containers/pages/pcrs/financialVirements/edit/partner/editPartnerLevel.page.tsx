import { useEffect } from "react";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { AwardRateOverridesMessage } from "@ui/components/atomicDesign/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { Percentage } from "@ui/components/atomicDesign/atoms/Percentage/percentage";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { TBody, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useMapFinancialVirements } from "../../../utils/useMapFinancialVirements";
import { useForm } from "react-hook-form";
import { EditPartnerLevelSchema, editPartnerLevelSchema, errorMap } from "./editPartnerLevel.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { sumBy } from "lodash";
import { useOnUpdatePartnerLevel, getPayload } from "./editPartnerLevel.logic";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { usePcrFinancialVirementData } from "../../PcrFinancialVirement.logic";

/**
 * Hook returns content for edit partner view
 */
export function useEditPartnerLevelContent() {
  const { getContent } = useContent();

  return {
    saveButton: getContent(x => x.pages.financialVirementEditPartnerLevel.saveButton),
    remainingGrantInfoIntro: getContent(x => x.pages.financialVirementEditPartnerLevel.remainingGrantInfo.intro),
    remainingGrantInfoCheckRules: getContent(
      x => x.pages.financialVirementEditPartnerLevel.remainingGrantInfo.checkRules,
    ),
    remainingGrantInfoRemainingGrant: getContent(
      x => x.pages.financialVirementEditPartnerLevel.remainingGrantInfo.remainingGrant,
    ),
    remainingGrantInfoFundingLevel: getContent(
      x => x.pages.financialVirementEditPartnerLevel.remainingGrantInfo.fundingLevel,
    ),
    partnerName: getContent(x => x.financialVirementLabels.partnerName),
    partnerOriginalRemainingCosts: getContent(x => x.financialVirementLabels.partnerOriginalRemainingCosts),
    partnerOriginalRemainingGrant: getContent(x => x.financialVirementLabels.partnerOriginalRemainingGrant),
    originalFundingLevel: getContent(x => x.financialVirementLabels.originalFundingLevel),
    partnerNewRemainingCosts: getContent(x => x.financialVirementLabels.partnerNewRemainingCosts),
    partnerNewRemainingGrant: getContent(x => x.financialVirementLabels.partnerNewRemainingGrant),
    newFundingLevel: getContent(x => x.financialVirementLabels.newFundingLevel),
    projectTotals: getContent(x => x.financialVirementLabels.projectTotals),
    backToSummary: getContent(x => x.financialVirementLabels.backToSummary),
  };
}

export interface FinancialVirementParams {
  projectId: ProjectId;
  pcrId: PcrId;
  itemId: PcrItemId;
}

type EditPartnerLevelErrors = {
  virements: { newRemainingGrant: RhfError }[];
  newRemainingGrant: RhfError;
};

const EditPartnerLevelPage = (props: BaseProps & FinancialVirementParams) => {
  const { project, financialVirementsForParticipants, financialVirementsForCosts, claimOverrideAwardRates, partners } =
    usePcrFinancialVirementData({
      projectId: props.projectId,
      pcrId: props.pcrId,
      itemId: props.itemId,
    });
  const content = useEditPartnerLevelContent();

  const { virementData } = useMapFinancialVirements({
    financialVirementsForCosts,
    financialVirementsForParticipants,
    claimOverrideAwardRates,
    partners,
    pcrItemId: props.itemId,
  });

  const { register, watch, formState, handleSubmit, getFieldState, setValue } = useForm<EditPartnerLevelSchema>({
    defaultValues: {
      partners: virementData.partners.map(x => ({
        partnerId: x.partnerId,
        newRemainingGrant: String(x.newRemainingGrant ?? 0),
        newRemainingCosts: x.newRemainingCosts,
      })),
      originalRemainingGrant: virementData.originalRemainingGrant,
      newRemainingGrant: virementData.newRemainingGrant,
      newRemainingCosts: virementData.newRemainingCosts,
    },
    resolver: zodResolver(editPartnerLevelSchema, {
      errorMap,
    }),
  });

  const navigateTo = props.routes.pcrPrepareItem.getLink({
    projectId: props.projectId,
    pcrId: props.pcrId,
    itemId: props.itemId,
  }).path;

  const { isFetching, onUpdate, apiError } = useOnUpdatePartnerLevel(
    props.projectId,
    props.pcrId,
    props.itemId,
    navigateTo,
  );

  const validationErrors = useRhfErrors(formState?.errors) as EditPartnerLevelErrors;

  const getNewFundingLevel = (index: number) => {
    const value = Number(watch(`partners.${index}.newRemainingGrant`));
    return (value / virementData.partners[index].newRemainingCosts) * 100;
  };

  const newRemainingGrantTotal = sumBy(watch("partners"), x => Number(x.newRemainingGrant.replace("£", "")) || 0);

  useEffect(() => {
    setValue("newRemainingGrant", newRemainingGrantTotal, { shouldValidate: formState.isSubmitted });
  }, [newRemainingGrantTotal, setValue, formState.isSubmitted]);
  const newFundingLevelTotal = (newRemainingGrantTotal / virementData.newRemainingCosts) * 100;

  return (
    <Page
      validationErrors={validationErrors}
      backLink={
        <BackLink
          route={props.routes.pcrPrepareItem.getLink({
            projectId: props.projectId,
            pcrId: props.pcrId,
            itemId: props.itemId,
          })}
        >
          {content.backToSummary}
        </BackLink>
      }
      pageTitle={<Title title={project.title} projectNumber={project.projectNumber} />}
      apiError={apiError}
    >
      <Section>
        <AwardRateOverridesMessage isNonFec={project.isNonFec} />
        <P>{content.remainingGrantInfoIntro}</P>
        <P>{content.remainingGrantInfoCheckRules}</P>
        <P>{content.remainingGrantInfoRemainingGrant}</P>
        <P>{content.remainingGrantInfoFundingLevel}</P>
      </Section>

      <Section>
        <Form
          onSubmit={handleSubmit(data =>
            onUpdate({
              data: getPayload(data, virementData, props.itemId),
            }),
          )}
        >
          <Table data-qa="partner-virements">
            <THead>
              <TR>
                <TH dividerRight>{content.partnerName}</TH>
                <TH numeric>{content.partnerOriginalRemainingCosts}</TH>
                <TH numeric>{content.partnerOriginalRemainingGrant}</TH>
                <TH numeric dividerRight>
                  {content.originalFundingLevel}
                </TH>
                <TH numeric>{content.partnerNewRemainingCosts}</TH>
                <TH numeric>{content.partnerNewRemainingGrant}</TH>
                <TH numeric>{content.newFundingLevel}</TH>
              </TR>
            </THead>
            <TBody>
              {virementData.partners.map((x, i) => (
                <TR key={x.partnerId}>
                  <TD dividerRight>{partners.find(p => p.id === x.partnerId)?.name}</TD>
                  <TD numeric>
                    <Currency value={x.originalRemainingCosts} />
                  </TD>
                  <TD numeric>
                    <Currency value={x.originalRemainingGrant} />
                  </TD>
                  <TD numeric dividerRight>
                    <Percentage defaultIfInfinite={0} value={x.originalFundingLevel} />
                  </TD>
                  <TD numeric>
                    <Currency value={x.newRemainingCosts} />
                  </TD>
                  <TD numeric>
                    <ValidationError error={getFieldState(`partners.${i}.newRemainingGrant`).error} />
                    <NumberInput
                      inputWidth={10}
                      aria-label={`${x.name} new remaining grant`}
                      id={`partners_${i}_newRemainingGrant`}
                      hasError={!!validationErrors?.virements?.[i]?.newRemainingGrant}
                      {...register(`partners.${i}.newRemainingGrant`)}
                      disabled={isFetching}
                    />
                  </TD>
                  <TD numeric>
                    <Percentage defaultIfInfinite={0} value={getNewFundingLevel(i)} />
                  </TD>
                </TR>
              ))}
            </TBody>
            <TFoot>
              <TR>
                <TH dividerRight>{content.projectTotals}</TH>
                <TH numeric>
                  <Currency value={virementData.originalRemainingCosts} />
                </TH>
                <TH numeric>
                  <Currency value={virementData.originalRemainingGrant} />
                </TH>
                <TH numeric dividerRight>
                  <Percentage value={virementData.originalFundingLevel} />
                </TH>
                <TH numeric>
                  <Currency value={virementData.newRemainingCosts} />
                </TH>
                <TH id="newRemainingGrant" numeric>
                  <ValidationError error={getFieldState("newRemainingGrant").error} />
                  <Currency value={newRemainingGrantTotal} />
                </TH>
                <TH numeric>
                  <Percentage value={newFundingLevelTotal} />
                </TH>
              </TR>
            </TFoot>
          </Table>

          <input type="hidden" {...register("originalRemainingGrant")} />
          <Section>
            <Fieldset>
              <Button type="submit" disabled={isFetching}>
                {content.saveButton}
              </Button>
            </Fieldset>
          </Section>
        </Form>
      </Section>
    </Page>
  );
};

export const FinancialVirementEditPartnerLevelRoute = defineRoute({
  routeName: "financial-virement-edit-partner-level",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/partner",
  container: EditPartnerLevelPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.financialVirementEditPartnerLevel.title),
});
