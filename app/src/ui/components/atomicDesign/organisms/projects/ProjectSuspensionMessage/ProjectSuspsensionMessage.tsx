import { PartnerStatus } from "@framework/constants/partner";
import { ProjectStatus } from "@framework/constants/project";
import { getAuthRoles } from "@framework/types/authorisation";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { useContent } from "@ui/hooks/content.hook";
import { ProjectSuspensionMessageProps } from "./ProjectSuspensionMessage.logic";

const ProjectSuspensionMessage = ({ project, partners, partnerId }: ProjectSuspensionMessageProps) => {
  const { getContent } = useContent();
  const { isMo } = getAuthRoles(project.roles);

  const specificPartner = partners.find(x => x.id === partnerId);

  // If the currently viewed partner is on hold and flagged,
  // or if not viewing a specific partner, any partner is on hold and flagged,
  // show a project suspension message to the MO
  // https://ukri.atlassian.net/browse/ACC-10698
  if (isMo) {
    if (
      (!specificPartner && partners.some(x => x.partnerStatus === PartnerStatus.OnHold && x.isFlagged)) ||
      (specificPartner?.partnerStatus === PartnerStatus.OnHold && specificPartner.isFlagged)
    ) {
      return (
        <ValidationMessage
          messageType="alert"
          message="Please note this project is currently under suspension"
          subMessage="Some project participants will not be able to submit any claims or project change requests. Please email askoperations@iuk.ukri.org for further information."
          markdown
        />
      );
    } else if (specificPartner?.partnerStatus === PartnerStatus.OnHold && !specificPartner.isFlagged) {
      // "Partner is on hold" should NOT appear for the MO when the partner is 'on hold' and the watched flag is NOT SET
      return null;
    }
  }

  if (project.status === ProjectStatus.OnHold) {
    return (
      <ValidationMessage
        messageType="info"
        message={getContent(x => x.components.projectInactiveContent.projectOnHoldMessage)}
      />
    );
  }

  const partner =
    specificPartner ?? // If a specific partner is selected, use that partner
    partners.find(x => project.partnerRoles.find(y => y.partnerId === x.id)?.isPm); // Otherwise, find a partner where the user is PM

  switch (partner?.partnerStatus) {
    case PartnerStatus.OnHold:
      return (
        <ValidationMessage
          messageType="info"
          message={getContent(x => x.components.projectInactiveContent.partnerOnHoldMessage)}
        />
      );
    case PartnerStatus.InvoluntaryWithdrawal:
    case PartnerStatus.MigratedWithdrawn:
    case PartnerStatus.VoluntaryWithdrawal:
      return (
        <ValidationMessage
          messageType="info"
          message={getContent(x => x.components.projectInactiveContent.partnerWithdrawal)}
        />
      );
  }

  return null;
};

export { ProjectSuspensionMessage };
