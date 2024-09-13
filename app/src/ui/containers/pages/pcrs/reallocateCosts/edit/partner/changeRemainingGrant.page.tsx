import { useEffect } from "react";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { AwardRateOverridesMessage } from "@ui/components/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage";
import { BackLink } from "@ui/components/atoms/Links/links";
import { Currency } from "@ui/components/atoms/Currency/currency";
import { Percentage } from "@ui/components/atoms/Percentage/percentage";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/atoms/Section/Section";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { TBody, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atoms/table/tableComponents";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { useMapFinancialVirements } from "../../../utils/useMapFinancialVirements";
import { useForm } from "react-hook-form";
import { ChangeRemainingGrantSchema, changeRemainingGrantSchema, errorMap } from "./changeRemainingGrant.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumberInput } from "@ui/components/atoms/form/NumberInput/NumberInput";
import { sumBy } from "lodash";
import { useOnUpdateChangeRemainingGrant, getPayload } from "./changeRemainingGrant.logic";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { usePcrFinancialVirementData } from "../../PcrFinancialVirement.logic";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { parseCurrency } from "@framework/util/numberHelper";

/**
 * Hook returns content for edit partner view
 */
export function useChangeRemainingGrantContent() {
  const { getContent } = useContent();

  return {
    saveButton: getContent(x => x.pages.changeRemainingGrant.saveButton),
    remainingGrantInfoIntro: getContent(x => x.pages.changeRemainingGrant.remainingGrantInfo.intro),
    remainingGrantInfoCheckRules: getContent(x => x.pages.changeRemainingGrant.remainingGrantInfo.checkRules),
    remainingGrantInfoRemainingGrant: getContent(x => x.pages.changeRemainingGrant.remainingGrantInfo.remainingGrant),
    remainingGrantInfoFundingLevel: getContent(x => x.pages.changeRemainingGrant.remainingGrantInfo.fundingLevel),
    partnerName: getContent(x => x.financialVirementLabels.partnerName),
    partnerOriginalRemainingCosts: getContent(x => x.financialVirementLabels.partnerOriginalRemainingCosts),
    partnerOriginalRemainingGrant: getContent(x => x.financialVirementLabels.partnerOriginalRemainingGrant),
    originalFundingLevel: getContent(x => x.financialVirementLabels.originalFundingLevel),
    partnerNewRemainingCosts: getContent(x => x.financialVirementLabels.partnerNewRemainingCosts),
    partnerNewRemainingGrant: getContent(x => x.financialVirementLabels.partnerNewRemainingGrant),
    newFundingLevel: getContent(x => x.financialVirementLabels.newFundingLevel),
    projectTotals: getContent(x => x.financialVirementLabels.projectTotals),
    backToSummary: getContent(x => x.financialVirementLabels.backToSummary),
    gbp: getContent(x => x.forms.prefix.gbp),
  };
}

export interface FinancialVirementParams {
  projectId: ProjectId;
  pcrId: PcrId;
  itemId: PcrItemId;
}

type ChangeRemainingGrantErrors = {
  virements: { newRemainingGrant: RhfError }[];
  newRemainingGrant: RhfError;
};

const ChangeRemainingGrantPage = (props: BaseProps & FinancialVirementParams) => {
  const {
    project,
    financialVirementsForParticipants,
    financialVirementsForCosts,
    claimOverrideAwardRates,
    partners,
    fragmentRef,
  } = usePcrFinancialVirementData({
    projectId: props.projectId,
    pcrId: props.pcrId,
    itemId: props.itemId,
  });
  const content = useChangeRemainingGrantContent();

  const { virementData } = useMapFinancialVirements({
    financialVirementsForCosts,
    financialVirementsForParticipants,
    claimOverrideAwardRates,
    partners,
    pcrItemId: props.itemId,
  });

  const { register, watch, setError, formState, handleSubmit, getFieldState, setValue } =
    useForm<ChangeRemainingGrantSchema>({
      defaultValues: {
        form: FormTypes.PcrReallocateCostsChangeRemainingGrant,
        partners: virementData.partners.map(x => ({
          partnerId: x.partnerId,
          newRemainingGrant: String(x.newRemainingGrant ?? 0),
          newRemainingCosts: x.newRemainingCosts,
          newFundingLevel: x.newFundingLevel,
          originalFundingLevel: x.originalFundingLevel,
          originalRemainingCosts: x.originalRemainingCosts,
          originalRemainingGrant: x.originalRemainingGrant,
        })),
        originalRemainingGrant: virementData.originalRemainingGrant,
        newRemainingGrant: virementData.newRemainingGrant,
        newRemainingCosts: virementData.newRemainingCosts,
      },
      resolver: zodResolver(changeRemainingGrantSchema, {
        errorMap,
      }),
    });

  const navigateTo = props.routes.pcrPrepareItem.getLink({
    projectId: props.projectId,
    pcrId: props.pcrId,
    itemId: props.itemId,
  }).path;

  const { isFetching, onUpdate, apiError } = useOnUpdateChangeRemainingGrant(
    props.projectId,
    props.pcrId,
    props.itemId,
    navigateTo,
  );

  const validationErrors = useZodErrors(setError, formState?.errors) as ChangeRemainingGrantErrors;

  const getNewFundingLevel = (index: number) => {
    if (virementData.partners[index].newRemainingCosts === 0) {
      return virementData.partners[index].newFundingLevel;
    }
    const value = parseCurrency(watch(`partners.${index}.newRemainingGrant`));
    return (value / virementData.partners[index].newRemainingCosts) * 100;
  };

  const newRemainingGrantTotal = sumBy(watch("partners"), x => parseCurrency(x.newRemainingGrant) || 0);

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
      apiError={apiError}
      fragmentRef={fragmentRef}
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
          <input type="hidden" value={FormTypes.PcrReallocateCostsChangeRemainingGrant} {...register("form")} />
          <input type="hidden" value={virementData.originalRemainingGrant} {...register("originalRemainingGrant")} />
          <input type="hidden" value={virementData.newRemainingGrant} {...register("newRemainingGrant")} />
          <input type="hidden" value={virementData.newRemainingCosts} {...register("newRemainingCosts")} />
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
                  <TD dividerRight>
                    <input type="hidden" value={x.partnerId} {...register(`partners.${i}.partnerId`)} />
                    {partners.find(p => p.id === x.partnerId)?.name}
                  </TD>
                  <TD numeric>
                    <input
                      type="hidden"
                      value={x.originalRemainingCosts}
                      {...register(`partners.${i}.originalRemainingCosts`)}
                    />
                    <Currency value={x.originalRemainingCosts} />
                  </TD>
                  <TD numeric>
                    <input
                      type="hidden"
                      value={x.originalRemainingGrant}
                      {...register(`partners.${i}.originalRemainingGrant`)}
                    />
                    <Currency value={x.originalRemainingGrant} />
                  </TD>
                  <TD numeric dividerRight>
                    <input
                      type="hidden"
                      value={x.originalFundingLevel}
                      {...register(`partners.${i}.originalFundingLevel`)}
                    />
                    <Percentage defaultIfInfinite={0} value={x.originalFundingLevel} />
                  </TD>
                  <TD numeric>
                    <input type="hidden" value={x.newRemainingCosts} {...register(`partners.${i}.newRemainingCosts`)} />
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
                      defaultValue={String(x.newRemainingGrant ?? 0)}
                      prefix={content.gbp}
                    />
                  </TD>
                  <TD numeric>
                    <input type="hidden" value={x.newFundingLevel} {...register(`partners.${i}.newFundingLevel`)} />
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

export const ChangeRemainingGrantRoute = defineRoute({
  routeName: "change-remaining-grant",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/partner",
  container: ChangeRemainingGrantPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.changeRemainingGrant.title),
});
