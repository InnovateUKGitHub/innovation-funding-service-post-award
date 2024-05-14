import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { getAuthRoles } from "@framework/types/authorisation";
import { roundCurrency } from "@framework/util/numberHelper";
import { zodResolver } from "@hookform/resolvers/zod";
import { capitalizeFirstWord } from "@shared/string-helpers";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { H3 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { Percentage } from "@ui/components/atomicDesign/atoms/Percentage/percentage";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { TableEmptyCell } from "@ui/components/atomicDesign/atoms/table/TableEmptyCell/TableEmptyCell";
import { TBody, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { AwardRateOverrideLabel } from "@ui/components/atomicDesign/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage";
import { AwardRateOverridesMessage } from "@ui/components/atomicDesign/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage.standalone";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/redux/routesProvider";
import { FormTypes } from "@ui/zod/FormTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePcrPartnerFinancialVirementData } from "../../PcrFinancialVirement.logic";
import {
  useMapOverwrittenFinancialVirements,
  useOnUpdateCostCategoryLevel,
} from "./CostCategoryLevelFinancialVirementEdit.logic";
import {
  CostCategoryLevelFinancialVirementEditSchemaType,
  costCategoryLevelFinancialVirementEditErrorMap,
  getCostCategoryLevelFinancialVirementEditSchema,
} from "./CostCategoryLevelFinancialVirementEdit.zod";

interface PartnerLevelFinancialVirementParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  pcrId: PcrId;
  itemId: PcrItemId;
}

/**
 * A page for editing Loans virements for a PCR.
 */
const EditPage = ({ projectId, pcrId, itemId, partnerId }: PartnerLevelFinancialVirementParams & BaseProps) => {
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
  } = usePcrPartnerFinancialVirementData({ projectId, partnerId, pcrId, itemId });

  const mapFinancialVirementProps = {
    financialVirementsForCosts,
    financialVirementsForParticipants,
    claimOverrideAwardRates,
    partners,
    pcrItemId: itemId,
  };

  const mapFinancialVirement = useMapOverwrittenFinancialVirements(mapFinancialVirementProps);

  const { register, watch, handleSubmit, setError, formState, getFieldState } = useForm<
    z.input<CostCategoryLevelFinancialVirementEditSchemaType>
  >({
    resolver: zodResolver(
      getCostCategoryLevelFinancialVirementEditSchema({
        mapFinancialVirementProps,
      }),
      {
        errorMap: costCategoryLevelFinancialVirementEditErrorMap,
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
          <Content value={x => x.financialVirementLabels.backToSummary} />
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
            data: data as unknown as z.output<CostCategoryLevelFinancialVirementEditSchemaType>,
          }),
        )}
      >
        <input type="hidden" value={FormTypes.PcrFinancialVirementsCostCategorySaveAndContinue} {...register("form")} />
        <input type="hidden" value={projectId} {...register("projectId")} />
        <input type="hidden" value={pcrId} {...register("pcrId")} />
        <input type="hidden" value={itemId} {...register("pcrItemId")} />
        <input type="hidden" value={partnerId} {...register("partnerId")} />

        <Section title={partner.name}>
          <Table data-qa="partnerVirements">
            <THead>
              <TR>
                <TH>{getContent(x => x.financialVirementLabels.costCategoryName)}</TH>
                <TH numeric>{getContent(x => x.financialVirementLabels.costCategoryOriginalEligibleCosts)}</TH>
                <TH numeric>{getContent(x => x.financialVirementLabels.costCategoryCostsClaimed)}</TH>
                <TH numeric>{getContent(x => x.financialVirementLabels.costCategoryNewEligibleCosts)}</TH>
                <TH numeric>{getContent(x => x.financialVirementLabels.costCategoryDifferenceCosts)}</TH>
                {project.isNonFec && (
                  <>
                    <TH numeric>{getContent(x => x.financialVirementLabels.costCategoryOriginalRemainingGrant)}</TH>
                    <TH numeric>{getContent(x => x.financialVirementLabels.costCategoryAwardRate)}</TH>
                    <TH numeric>{getContent(x => x.financialVirementLabels.costCategoryNewRemainingGrant)}</TH>
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
                <TD bold>{getContent(x => x.financialVirementLabels.partnerTotals)}</TD>
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
          <H3 as="h2">{getContent(x => x.pages.financialVirementEdit.summaryTitle)}</H3>
          <Table data-qa="summary-table">
            <THead>
              <TR>
                <TH numeric>{getContent(x => x.financialVirementLabels.projectOriginalEligibleCosts)}</TH>
                <TH numeric>{getContent(x => x.financialVirementLabels.projectNewEligibleCosts)}</TH>
                <TH numeric>{getContent(x => x.financialVirementLabels.projectDifferenceCosts)}</TH>
                <TH numeric>{getContent(x => x.financialVirementLabels.projectOriginalRemainingGrant)}</TH>
                <TH numeric>{getContent(x => x.financialVirementLabels.projectNewRemainingGrant)}</TH>
                <TH numeric>{getContent(x => x.financialVirementLabels.projectDifferenceGrant)}</TH>
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
            {getContent(x => x.pages.financialVirementEdit.saveButton)}
          </Button>
        </Fieldset>
      </Form>
    </Page>
  );
};

const PartnerLevelFinancialVirementRoute = defineRoute({
  // pm reallocates costs for participant at cost category level
  routeName: "partnerLevelFinancialVirementEdit",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/financial/:partnerId",
  container: EditPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    partnerId: route.params.partnerId as PartnerId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.financialVirementEdit.title),
});

export { PartnerLevelFinancialVirementParams, PartnerLevelFinancialVirementRoute };
