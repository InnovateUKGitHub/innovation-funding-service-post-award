import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { getAuthRoles } from "@framework/types/authorisation";
import { roundCurrency } from "@framework/util/numberHelper";
import { zodResolver } from "@hookform/resolvers/zod";
import { capitalizeFirstWord } from "@shared/string-helpers";
import { Button } from "@ui/components/atoms/Button/Button";
import { Currency } from "@ui/components/atoms/Currency/currency";
import { H3 } from "@ui/components/atoms/Heading/Heading.variants";
import { BackLink } from "@ui/components/atoms/Links/links";
import { Percentage } from "@ui/components/atoms/Percentage/percentage";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { NumberInput } from "@ui/components/atoms/form/NumberInput/NumberInput";
import { useMounted } from "@ui/context/Mounted";
import { TableEmptyCell } from "@ui/components/atoms/table/TableEmptyCell/TableEmptyCell";
import { TBody, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atoms/table/tableComponents";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { Content } from "@ui/components/molecules/Content/content";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { AwardRateOverrideLabel } from "@ui/components/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage";
import { AwardRateOverridesMessage } from "@ui/components/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage.standalone";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/context/routesProvider";
import { FormTypes } from "@ui/zod/FormTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePcrPartnerReallocateCostsData } from "../../PcrReallocateCosts.logic";
import {
  useMapOverwrittenFinancialVirements,
  useOnUpdateCostCategoryLevel,
} from "./CostCategoryLevelReallocateCostsEdit.logic";
import {
  CostCategoryLevelReallocateCostsEditSchemaType,
  costCategoryLevelReallocateCostsEditErrorMap,
  getCostCategoryLevelReallocateCostsEditSchema,
} from "./CostCategoryLevelReallocateCostsEdit.zod";

interface PartnerLevelReallocateCostsParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  pcrId: PcrId;
  itemId: PcrItemId;
}

/**
 * A page for editing Loans virements for a PCR.
 */
const EditPage = ({ projectId, pcrId, itemId, partnerId }: PartnerLevelReallocateCostsParams & BaseProps) => {
  const routes = useRoutes();
  const { getContent } = useContent();
  const { isServer } = useMounted();

  const {
    project,
    partner,
    financialVirementsForCosts,
    financialVirementsForParticipants,
    claimOverrideAwardRates,
    partners,
    fragmentRef,
  } = usePcrPartnerReallocateCostsData({ projectId, partnerId, pcrId, itemId });

  const mapReallocateCostsProps = {
    financialVirementsForCosts,
    financialVirementsForParticipants,
    claimOverrideAwardRates,
    partners,
    pcrItemId: itemId,
  };

  const mapFinancialVirement = useMapOverwrittenFinancialVirements(mapReallocateCostsProps);

  const { register, watch, handleSubmit, setError, formState, getFieldState } = useForm<
    z.input<CostCategoryLevelReallocateCostsEditSchemaType>
  >({
    resolver: zodResolver(
      getCostCategoryLevelReallocateCostsEditSchema({
        mapReallocateCostsProps,
      }),
      {
        errorMap: costCategoryLevelReallocateCostsEditErrorMap,
      },
    ),
  });

  const defaults = useServerInput();
  const validationErrors = useZodErrors(setError, formState.errors);

  const { virementData } = mapFinancialVirement(isServer ? defaults?.virements : watch("virements"));

  const { onUpdate, isProcessing, apiError } = useOnUpdateCostCategoryLevel({
    mapFinancialVirement,
  });

  const partnerVirement = virementData.partners.find(x => x.partnerId === partnerId)!;

  const { isPm } = getAuthRoles(project.roles);
  const { isKTP } = checkProjectCompetition(project.competitionType);
  const displayIntroMessage: boolean = isKTP && isPm;

  return (
    <Page
      backLink={
        <BackLink
          route={routes.pcrPrepareItem.getLink({
            projectId: projectId,
            pcrId: pcrId,
            itemId: itemId,
          })}
        >
          <Content value={x => x.reallocateCostsLabels.backToSummary} />
        </BackLink>
      }
      validationErrors={validationErrors}
      fragmentRef={fragmentRef}
      apiError={apiError}
    >
      <AwardRateOverridesMessage
        projectId={projectId}
        partnerId={partnerId}
        overrideLabel={AwardRateOverrideLabel.PROJECT}
      />
      {displayIntroMessage && (
        <>
          <SimpleString>{getContent(x => x.pages.financialVirementEdit.editPageMessage.intro)}</SimpleString>
          <SimpleString>{getContent(x => x.pages.financialVirementEdit.editPageMessage.virements)}</SimpleString>
          <SimpleString>{getContent(x => x.pages.financialVirementEdit.editPageMessage.requests)}</SimpleString>
        </>
      )}

      <Form
        onSubmit={handleSubmit(data =>
          onUpdate({
            // RHF reports the type as the input type,
            // but it has already been transformed to the output type.
            data: data as unknown as z.output<CostCategoryLevelReallocateCostsEditSchemaType>,
          }),
        )}
      >
        <input type="hidden" value={FormTypes.PcrReallocateCostsCostCategorySaveAndContinue} {...register("form")} />
        <input type="hidden" value={projectId} {...register("projectId")} />
        <input type="hidden" value={pcrId} {...register("pcrId")} />
        <input type="hidden" value={itemId} {...register("pcrItemId")} />
        <input type="hidden" value={partnerId} {...register("partnerId")} />

        <Section title={partner.name}>
          <Table data-qa="partnerVirements">
            <THead>
              <TR>
                <TH>{getContent(x => x.reallocateCostsLabels.costCategoryName)}</TH>
                <TH numeric>{getContent(x => x.reallocateCostsLabels.costCategoryOriginalEligibleCosts)}</TH>
                <TH numeric>{getContent(x => x.reallocateCostsLabels.costCategoryCostsClaimed)}</TH>
                <TH numeric>{getContent(x => x.reallocateCostsLabels.costCategoryNewEligibleCosts)}</TH>
                <TH numeric>{getContent(x => x.reallocateCostsLabels.costCategoryDifferenceCosts)}</TH>
                {project.isNonFec && (
                  <>
                    <TH numeric>{getContent(x => x.reallocateCostsLabels.costCategoryOriginalRemainingGrant)}</TH>
                    <TH numeric>{getContent(x => x.reallocateCostsLabels.costCategoryAwardRate)}</TH>
                    <TH numeric>{getContent(x => x.reallocateCostsLabels.costCategoryNewRemainingGrant)}</TH>
                  </>
                )}
              </TR>
            </THead>
            <TBody>
              {partnerVirement.virements.map((x, i) => {
                const defaultValue = defaults?.virements?.[i]?.newEligibleCosts ?? x.newEligibleCosts;

                return (
                  <TR key={x.costCategoryId} hasError={!!getFieldState(`virements.${i}`).error}>
                    <TD>{capitalizeFirstWord(x.costCategoryName ?? "")}</TD>
                    <TD numeric>
                      <Currency value={x.originalEligibleCosts} />
                    </TD>
                    <TD numeric>
                      <Currency value={x.costsClaimedToDate} />
                    </TD>
                    <TD numeric>
                      <input type="hidden" value={x.virementCostId} {...register(`virements.${i}.virementCostId`)} />
                      <Fieldset>
                        <ValidationError error={getFieldState(`virements.${i}.newEligibleCosts`).error} />
                        <NumberInput
                          {...register(`virements.${i}.newEligibleCosts`)}
                          id={`virements_${i}_newEligibleCosts`}
                          disabled={isProcessing}
                          hasError={!!getFieldState(`virements.${i}.newEligibleCosts`).error}
                          defaultValue={isNaN(defaultValue) ? undefined : defaultValue}
                          aria-label={x.costCategoryName}
                          prefix={getContent(x => x.forms.prefix.gbp)}
                        />
                      </Fieldset>
                    </TD>
                    <TD numeric>
                      <Currency value={roundCurrency(x.newEligibleCosts - x.originalEligibleCosts)} />
                    </TD>
                    {project.isNonFec && (
                      <>
                        <TD numeric>
                          <Currency value={x.originalRemainingGrant} />
                        </TD>
                        <TD numeric>
                          <Percentage value={x.originalFundingLevel} />
                        </TD>
                        <TD numeric>
                          <Currency value={x.newRemainingGrant} />
                        </TD>
                      </>
                    )}
                  </TR>
                );
              })}
            </TBody>
            <TFoot>
              <TR>
                <TD bold>{getContent(x => x.reallocateCostsLabels.partnerTotals)}</TD>
                <TD bold numeric>
                  <Currency value={partnerVirement.originalEligibleCosts} />
                </TD>
                <TD bold numeric>
                  <Currency value={partnerVirement.costsClaimedToDate} />
                </TD>
                <TD bold numeric>
                  <Currency value={partnerVirement.newEligibleCosts} />
                </TD>
                <TD bold numeric>
                  <Currency
                    value={roundCurrency(partnerVirement.newEligibleCosts - partnerVirement.originalEligibleCosts)}
                  />
                </TD>
                {project.isNonFec && (
                  <>
                    <TD bold numeric>
                      <Currency value={partnerVirement.originalRemainingGrant} />
                    </TD>
                    <TD bold numeric>
                      <TableEmptyCell />
                    </TD>
                    <TD bold numeric>
                      <Currency value={partnerVirement.newRemainingGrant} />
                    </TD>
                  </>
                )}
              </TR>
            </TFoot>
          </Table>
        </Section>
        <Section>
          <H3 as="h2">{getContent(x => x.pages.reallocateCostsEdit.summaryTitle)}</H3>
          <Table data-qa="summary-table">
            <THead>
              <TR>
                <TH numeric>{getContent(x => x.reallocateCostsLabels.projectOriginalEligibleCosts)}</TH>
                <TH numeric>{getContent(x => x.reallocateCostsLabels.projectNewEligibleCosts)}</TH>
                <TH numeric>{getContent(x => x.reallocateCostsLabels.projectDifferenceCosts)}</TH>
                <TH numeric>{getContent(x => x.reallocateCostsLabels.projectOriginalRemainingGrant)}</TH>
                <TH numeric>{getContent(x => x.reallocateCostsLabels.projectNewRemainingGrant)}</TH>
                <TH numeric>{getContent(x => x.reallocateCostsLabels.projectDifferenceGrant)}</TH>
              </TR>
            </THead>
            <TBody>
              <TR>
                <TD numeric>
                  <Currency value={virementData.originalEligibleCosts} />
                </TD>
                <TD numeric>
                  <Currency value={virementData.newEligibleCosts} />
                </TD>
                <TD numeric>
                  <Currency value={virementData.costDifference} />
                </TD>
                <TD numeric>
                  <Currency value={virementData.originalRemainingGrant} />
                </TD>
                <TD numeric>
                  <Currency value={virementData.newRemainingGrant} />
                </TD>
                <TD numeric>
                  <Currency value={virementData.grantDifference} />
                </TD>
              </TR>
            </TBody>
          </Table>
        </Section>

        <Fieldset>
          <Button type="submit" styling="Primary" disabled={isProcessing}>
            {getContent(x => x.pages.reallocateCostsEdit.saveButton)}
          </Button>
        </Fieldset>
      </Form>
    </Page>
  );
};

const PartnerLevelReallocateCostsRoute = defineRoute({
  // pm reallocates costs for participant at cost category level
  routeName: "partnerLevelReallocateCostsEdit",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/financial/:partnerId",
  container: EditPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    partnerId: route.params.partnerId as PartnerId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.reallocateCostsEdit.title),
});

export { PartnerLevelReallocateCostsParams, PartnerLevelReallocateCostsRoute };
