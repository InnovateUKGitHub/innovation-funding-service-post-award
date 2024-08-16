import { ProjectRole } from "@framework/constants/project";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { Content } from "@ui/components/molecules/Content/content";
import { EmailContent } from "@ui/components/atoms/EmailContent/emailContent";
import { Markdown } from "@ui/components/atoms/Markdown/markdown";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { useContent } from "@ui/hooks/content.hook";

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
      return <SimpleString>{defaultGuidanceMessage}</SimpleString>;
    }

    guidanceMessage = <Markdown trusted value={defaultGuidanceMessage} />;
  }

  return <ValidationMessage qa="guidance-message" messageType="info" message={guidanceMessage} />;
};
