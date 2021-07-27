import { PartnerDto } from "@framework/dtos";
import { getAuthRoles, ProjectRole } from "@framework/types";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { useContent } from "@ui/hooks";

import * as Acc from "@ui/components";

export interface ClaimsDashboardGuidanceProps {
  overdueProject: PartnerDto["overdueProject"];
  competitionType?: PartnerDto["competitionType"];
  roles?: PartnerDto["roles"];
}

export function ClaimsDashboardGuidance({
  overdueProject,
  competitionType = "",
  roles = ProjectRole.Unknown,
}: ClaimsDashboardGuidanceProps) {
  const { getContent } = useContent();

  let guidenceMessage: React.ReactElement;

  if (overdueProject) {
    const overdueGuidanceMessage1 = getContent(x => x.claimsDashboard.messages.overdueGuidanceMessage1);
    const overdueGuidanceMessage2 = getContent(x => x.claimsDashboard.messages.overdueGuidanceMessage2);
    const overdueGuidanceMessage3 = getContent(x => x.claimsDashboard.messages.overdueGuidanceMessage3);
    const overdueGuidanceMessage4 = getContent(x => x.claimsDashboard.messages.overdueGuidanceMessage4);

    guidenceMessage = (
      <>
        {overdueGuidanceMessage1}
        {overdueGuidanceMessage2}
        <Acc.Renderers.Email>{overdueGuidanceMessage3}</Acc.Renderers.Email>
        {overdueGuidanceMessage4}
      </>
    );
  } else {
    const isPartnerFc = getAuthRoles(roles).isFc;
    const { isCombinationOfSBRI } = checkProjectCompetition(competitionType);

    const defaultGuidenceMessage = getContent(x => x.allClaimsDashboard.messages.guidanceMessage);

    const displaySbriGuidence = isPartnerFc && isCombinationOfSBRI;

    if (displaySbriGuidence) {
      return <Acc.Renderers.SimpleString>{defaultGuidenceMessage}</Acc.Renderers.SimpleString>;
    }

    guidenceMessage = <Acc.Renderers.Markdown value={defaultGuidenceMessage} />;
  }

  return <Acc.ValidationMessage qa="guidance-message" messageType="info" message={guidenceMessage} />;
}
