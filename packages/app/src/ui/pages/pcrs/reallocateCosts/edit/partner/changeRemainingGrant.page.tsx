import { useEffect } from "react";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { AwardRateOverridesMessage } from "@ui/components/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage";
import { BackLink } from "@ui/components/atoms/Links/links";
import { Currency } from "@ui/components/atoms/Currency/currency";
import { Percentage } from "@ui/components/atoms/Percentage/percentage";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/atoms/Section/Section";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { TBody, TCaption, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atoms/table/tableComponents";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { useForm } from "react-hook-form";
import { ChangeRemainingGrantSchema, changeRemainingGrantSchema, errorMap } from "./changeRemainingGrant.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumberInput } from "@ui/components/atoms/form/NumberInput/NumberInput";
import { sumBy } from "lodash";
import { useChangeRemainingGrantData, useOnUpdateChangeRemainingGrant } from "./changeRemainingGrant.logic";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { parseCurrency } from "@framework/util/numberHelper";
import { useFetchKey } from "@ui/context/FetchKeyProvider";

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
    partnerName: getContent(x => x.reallocateCostsLabels.partnerName),
    partnerOriginalRemainingCosts: getContent(x => x.reallocateCostsLabels.partnerOriginalRemainingCosts),
    partnerOriginalRemainingGrant: getContent(x => x.reallocateCostsLabels.partnerOriginalRemainingGrant),
    originalFundingLevel: getContent(x => x.reallocateCostsLabels.originalFundingLevel),
    partnerNewRemainingCosts: getContent(x => x.reallocateCostsLabels.partnerNewRemainingCosts),
    partnerNewRemainingGrant: getContent(x => x.reallocateCostsLabels.partnerNewRemainingGrant),
    newFundingLevel: getContent(x => x.reallocateCostsLabels.newFundingLevel),
    projectTotals: getContent(x => x.reallocateCostsLabels.projectTotals),
    backToSummary: getContent(x => x.reallocateCostsLabels.backToSummary),
    gbp: getContent(x => x.forms.prefix.gbp),
    tableCaption: getContent(x => x.reallocateCostsLabels.tableCaption),
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
  const [fetchKey] = useFetchKey();

  const {
    partnerData,
    project,
    fragmentRef,
    originalRemainingGrant,
    originalFundingLevel,
    newRemainingGrant,
    originalRemainingCosts,
    newRemainingCosts,
  } = useChangeRemainingGrantData({
    projectId: props.projectId,
    pcrItemId: props.itemId,
    fetchKey,
  });

  const content = useChangeRemainingGrantContent();

  const { register, watch, setError, formState, handleSubmit, getFieldState, setValue } =
    useForm<ChangeRemainingGrantSchema>({
      defaultValues: {
        form: FormTypes.PcrReallocateCostsChangeRemainingGrant,
        partners: partnerData.map(x => ({
          partnerId: x.partnerId,
          virementParticipantId: x.id,
          newRemainingGrant: String(x.newRemainingGrant ?? 0),
          newRemainingCosts: x.newRemainingCosts,
          newFundingLevel: x.newFundingLevel,
          originalFundingLevel: x.originalFundingLevel,
          originalRemainingCosts: x.originalRemainingCosts,
          originalRemainingGrant: x.originalRemainingGrant,
          initialNewRemainingGrant: x.newRemainingGrant ?? 0,
        })),
        originalRemainingGrant,
        newRemainingGrant,
        newRemainingCosts,
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
    if (partnerData[index].newRemainingCosts === 0) {
      return partnerData[index].newFundingLevel;
    }
    const value = parseCurrency(watch(`partners.${index}.newRemainingGrant`));
    return (value / partnerData[index].newRemainingCosts) * 100;
  };

  const newRemainingGrantTotal = sumBy(watch("partners"), x => parseCurrency(x.newRemainingGrant) || 0);

  useEffect(() => {
    setValue("newRemainingGrant", newRemainingGrantTotal, { shouldValidate: formState.isSubmitted });
  }, [newRemainingGrantTotal, setValue, formState.isSubmitted]);
  const newFundingLevelTotal = (newRemainingGrantTotal / newRemainingCosts) * 100;

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
              data,
            }),
          )}
        >
          <input type="hidden" value={FormTypes.PcrReallocateCostsChangeRemainingGrant} {...register("form")} />
          <input type="hidden" value={originalRemainingGrant} {...register("originalRemainingGrant")} />
          <input type="hidden" value={newRemainingGrant} {...register("newRemainingGrant")} />
          <input type="hidden" value={newRemainingCosts} {...register("newRemainingCosts")} />
          <Table data-qa="partner-virements">
            <TCaption hidden>{content.tableCaption}</TCaption>
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
              {partnerData.map((x, i) => (
                <TR key={x.partnerId}>
                  <TD dividerRight>
                    <input type="hidden" value={x.partnerId} {...register(`partners.${i}.partnerId`)} />
                    <input type="hidden" value={x.id} {...register(`partners.${i}.virementParticipantId`)} />
                    {x.name}
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
                    <input type="hidden" value={x.newRemainingGrant} name={`partners.${i}.initialNewRemainingGrant`} />
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
                  <Currency value={originalRemainingCosts} />
                </TH>
                <TH numeric>
                  <Currency value={originalRemainingGrant} />
                </TH>
                <TH numeric dividerRight>
                  <Percentage value={originalFundingLevel} />
                </TH>
                <TH numeric>
                  <Currency value={newRemainingCosts} />
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
