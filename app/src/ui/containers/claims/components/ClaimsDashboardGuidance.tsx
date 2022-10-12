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

  let guidanceMessage: React.ReactElement;

  if (overdueProject) {
    const overdueGuidanceMessage1 = getContent(x => x.claimsDashboard.messages.overdueGuidanceMessage1);
    const overdueGuidanceMessage2 = getContent(x => x.claimsDashboard.messages.overdueGuidanceMessage2);
    const overdueGuidanceMessage3 = getContent(x => x.claimsDashboard.messages.overdueGuidanceMessage3);
    const overdueGuidanceMessage4 = getContent(x => x.claimsDashboard.messages.overdueGuidanceMessage4);

    guidanceMessage = (
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

    const defaultGuidanceMessage = getContent(x => x.allClaimsDashboard.messages.guidanceMessage);

    const displaySbriGuidance = isPartnerFc && isCombinationOfSBRI;

    if (displaySbriGuidance) {
      return <Acc.Renderers.SimpleString>{defaultGuidanceMessage}</Acc.Renderers.SimpleString>;
    }

    guidanceMessage = <Acc.Renderers.Markdown trusted value={defaultGuidanceMessage} />;
  }

  return <Acc.ValidationMessage qa="guidance-message" messageType="info" message={guidanceMessage} />;
}
