import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { ClaimTotalProjectPeriodsInfo } from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/NewForecastTable.logic";
import { ClaimStatusGroup } from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/getForecastHeaderContent";
import { useRoutes } from "@ui/context/routesProvider";

interface FinalClaimMessageProps {
  finalClaim: ClaimTotalProjectPeriodsInfo | null;
  finalClaimStatusGroup: ClaimStatusGroup | null;
  projectId: ProjectId;
  partnerId: PartnerId;
  isFc: boolean;
}

const FinalClaimMessage = ({
  finalClaim,
  projectId,
  partnerId,
  finalClaimStatusGroup,
  isFc,
}: FinalClaimMessageProps) => {
  const routes = useRoutes();

  if (!finalClaim) return null;
  if (!isFc) return null;

  switch (finalClaimStatusGroup) {
    case ClaimStatusGroup.EDITABLE_CLAIMING:
      return (
        <ValidationMessage
          qa="final-claim-message-FC"
          messageType="info"
          message={
            <Content
              value={x => x.forecastsMessages.projectFinalClaimNotSubmitted}
              components={[
                <Link
                  key="0"
                  route={routes.prepareClaim.getLink({
                    projectId,
                    partnerId,
                    periodId: finalClaim?.periodId,
                  })}
                  styling="Link"
                >
                  {" "}
                </Link>,
              ]}
            />
          }
        />
      );
    case ClaimStatusGroup.SUBMITTED_CLAIMING:
      return (
        <ValidationMessage
          qa="final-claim-message-FC"
          messageType="info"
          message={x => x.forecastsMessages.projectFinalClaimSubmitted}
        />
      );
    case ClaimStatusGroup.CLAIMED:
      return (
        <ValidationMessage
          qa="final-claim-message-FC"
          messageType="info"
          message={x => x.forecastsMessages.projectEnded}
        />
      );
    default:
      return null;
  }
};

export { FinalClaimMessage };
