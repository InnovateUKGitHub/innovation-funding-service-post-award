import { PartnerStatus } from "@framework/constants/partner";
import { ProjectStatus } from "@framework/constants/project";
import { PartnerDtoGql } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { useContent } from "@ui/hooks/content.hook";

export interface ProjectSuspensionMessageWithFragmentProps {
  projectId: ProjectId;
  partnerId?: PartnerId;
}

interface ProjectSuspensionMessageProps extends ProjectSuspensionMessageWithFragmentProps {
  project: Pick<ProjectDto, "status" | "roles">;
  partners: Pick<PartnerDtoGql, "id" | "partnerStatus" | "isFlagged">[];
}

const ProjectSuspensionMessage = ({ project, partners, partnerId }: ProjectSuspensionMessageProps) => {
  const { getContent } = useContent();
  const { isMo } = getAuthRoles(project.roles);

  const specificPartner = partners.find(x => x.id === partnerId);

  // If the currently viewed partner is on hold and flagged,
  // or if not viewing a specific partner, any partner is on hold and flagged,
  // show a project suspension message to the MO
  // https://ukri.atlassian.net/browse/ACC-10698
  if (
    isMo &&
    ((!specificPartner && partners.some(x => x.partnerStatus === PartnerStatus.OnHold && x.isFlagged)) ||
      (specificPartner?.partnerStatus === PartnerStatus.OnHold && specificPartner.isFlagged))
  ) {
    return (
      <ValidationMessage
        messageType="alert"
        message="Please note this project is currently under suspension"
        subMessage="Some project participants will not be able to submit any claims or project change requests. Please email askoperations@iuk.ukri.org for further information."
        markdown
      />
    );
  }

  if (project.status === ProjectStatus.OnHold) {
    return (
      <ValidationMessage
        messageType="info"
        message={getContent(x => x.components.projectInactiveContent.projectOnHoldMessage)}
      />
    );
  }

  switch (partners.find(x => x.id === partnerId)?.partnerStatus) {
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
    default:
      return null;
  }
};

export { ProjectSuspensionMessage };
