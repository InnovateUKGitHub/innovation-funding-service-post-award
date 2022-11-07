import { PartnerDto } from "@framework/dtos";
import { getAuthRoles, ProjectRole } from "@framework/types";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { useContent } from "@ui/hooks";

import * as Acc from "@ui/components";
import { Content, EmailContent } from "@ui/components";

export interface ClaimsDashboardGuidanceProps {
  overdueProject: PartnerDto["overdueProject"];
  competitionType?: PartnerDto["competitionType"];
  roles?: PartnerDto["roles"];
}

export const ClaimsDashboardGuidance = ({
  overdueProject,
  competitionType = "",
  roles = ProjectRole.Unknown,
}: ClaimsDashboardGuidanceProps) => {
  const { getContent } = useContent();

  let guidanceMessage: React.ReactElement;

  if (overdueProject) {
    guidanceMessage = (
      <Content
        value={x => x.claimsMessages.overdueGuidanceMessage.message}
        components={[<EmailContent key="email" value={x => x.claimsMessages.overdueGuidanceMessage.email} />]}
      />
    );
  } else {
    const isPartnerFc = getAuthRoles(roles).isFc;
    const { isCombinationOfSBRI } = checkProjectCompetition(competitionType);

    const defaultGuidanceMessage = getContent(x => x.claimsMessages.guidanceMessage);

    const displaySbriGuidance = isPartnerFc && isCombinationOfSBRI;

    if (displaySbriGuidance) {
      return <Acc.Renderers.SimpleString>{defaultGuidanceMessage}</Acc.Renderers.SimpleString>;
    }

    guidanceMessage = <Acc.Renderers.Markdown trusted value={defaultGuidanceMessage} />;
  }

  return <Acc.ValidationMessage qa="guidance-message" messageType="info" message={guidanceMessage} />;
};
