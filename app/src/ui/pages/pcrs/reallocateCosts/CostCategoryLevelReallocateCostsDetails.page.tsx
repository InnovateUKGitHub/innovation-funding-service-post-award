import { roundCurrency } from "@framework/util/numberHelper";
import { Currency } from "@ui/components/atoms/Currency/currency";
import { BackLink } from "@ui/components/atoms/Links/links";
import { TBody, TCaption, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atoms/table/tableComponents";
import { Content } from "@ui/components/molecules/Content/content";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { AwardRateOverrideLabel } from "@ui/components/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage";
import { AwardRateOverridesMessage } from "@ui/components/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage.standalone";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/context/routesProvider";
import { mapVirements } from "../utils/useMapFinancialVirements";
import { usePcrPartnerReallocateCostsData } from "./PcrReallocateCosts.logic";
import { getAuthRoles } from "@framework/types/authorisation";
import { Info } from "@ui/components/atoms/Details/Details";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";

type Mode = "review" | "details";

interface PartnerLevelReallocateCostsDetailsParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  pcrId: PcrId;
  itemId: PcrItemId;
  mode: Mode;
}

/**
 * A page for editing Loans virements for a PCR.
 */
const EditPage = ({
  projectId,
  pcrId,
  itemId,
  partnerId,
  mode,
}: PartnerLevelReallocateCostsDetailsParams & BaseProps) => {
  const routes = useRoutes();
  const { getContent } = useContent();

  const {
    project,
    partner,
    financialVirementsForCosts,
    financialVirementsForParticipants,
    claimOverrideAwardRates,
    partners,
    pcr,
    fragmentRef,
  } = usePcrPartnerReallocateCostsData({ projectId, partnerId, pcrId, itemId });

  const { virementData } = mapVirements({
    financialVirementsForCosts,
    financialVirementsForParticipants,
    claimOverrideAwardRates,
    partners,
    pcrItemId: itemId,
  });

  const partnerVirement = virementData.partners.find(x => x.partnerId === partnerId)!;

  const { isMo } = getAuthRoles(project.roles);

  return (
    <Page
      fragmentRef={fragmentRef}
      backLink={
        <BackLink
          route={
            mode === "review"
              ? routes.pcrReviewItem.getLink({
                  projectId,
                  pcrId,
                  itemId,
                })
              : routes.pcrViewItem.getLink({
                  projectId,
                  pcrId,
                  itemId,
                })
          }
        >
          <Content value={x => x.reallocateCostsLabels.backToSummary} />
        </BackLink>
      }
    >
      <AwardRateOverridesMessage
        projectId={projectId}
        partnerId={partnerId}
        overrideLabel={AwardRateOverrideLabel.PROJECT}
      />

      <Section title={partner.name}>
        {isMo && pcr.reasoningComments && (
          <Info summary={getContent(x => x.reallocateCostsLabels.reasoningComments)}>
            <SimpleString multiline>{pcr.reasoningComments}</SimpleString>
          </Info>
        )}
        <Table>
          <TCaption hidden>{getContent(x => x.reallocateCostsLabels.tableCaption)}</TCaption>
          <THead>
            <TR>
              <TH>{getContent(x => x.reallocateCostsLabels.costCategoryName)}</TH>
              <TH numeric>{getContent(x => x.reallocateCostsLabels.costCategoryOriginalEligibleCosts)}</TH>
              <TH numeric>{getContent(x => x.reallocateCostsLabels.costCategoryNewEligibleCosts)}</TH>
              <TH numeric>{getContent(x => x.reallocateCostsLabels.costCategoryDifferenceCosts)}</TH>
            </TR>
          </THead>
          <TBody>
            {partnerVirement.virements.map(x => (
              <TR key={x.costCategoryId}>
                <TD>{x.costCategoryName}</TD>
                <TD numeric>
                  <Currency value={x.originalEligibleCosts} />
                </TD>
                <TD numeric>
                  <Currency value={x.newEligibleCosts} />
                </TD>
                <TD numeric>
                  <Currency value={roundCurrency(x.newEligibleCosts - x.originalEligibleCosts)} />
                </TD>
              </TR>
            ))}
          </TBody>
          <TFoot>
            <TR>
              <TD bold>{getContent(x => x.reallocateCostsLabels.partnerTotals)}</TD>
              <TD bold numeric>
                <Currency value={partnerVirement.originalEligibleCosts} />
              </TD>
              <TD bold numeric>
                <Currency value={partnerVirement.newEligibleCosts} />
              </TD>
              <TD bold numeric>
                <Currency
                  value={roundCurrency(partnerVirement.newEligibleCosts - partnerVirement.originalEligibleCosts)}
                />
              </TD>
            </TR>
          </TFoot>
        </Table>
      </Section>
    </Page>
  );
};

const PartnerLevelReallocateCostsDetailsRoute = defineRoute({
  // pm reallocates costs for participant at cost category level
  routeName: "partnerLevelReallocateCostsDetails",
  routePath: "/projects/:projectId/pcrs/:pcrId/:mode/item/:itemId/financial/:partnerId",
  container: EditPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    partnerId: route.params.partnerId as PartnerId,
    mode: route.params.mode as Mode,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.reallocateCostsEdit.title),
});

export { PartnerLevelReallocateCostsDetailsParams, PartnerLevelReallocateCostsDetailsRoute };
