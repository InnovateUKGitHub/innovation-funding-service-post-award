import { ClaimDto, ClaimStatus, getAuthRoles, PartnerDto, PartnerStatus, ProjectDto } from "@framework/types";
import { IRoutes } from "@ui/routing";
import { useContent, useProjectStatus } from "@ui/hooks";
import { Link } from "../links";

interface ClaimDetailsBaseProps {
  claim: Pick<ClaimDto, "status" | "periodId">;
  project: Pick<ProjectDto, "id" | "status" | "roles">;
  partner: Pick<PartnerDto, "id" | "roles" | "partnerStatus" | "isWithdrawn">;
}

export interface ClaimDetailsLinkRoutes extends ClaimDetailsBaseProps {
  routes: IRoutes;
}

export function ClaimDetailsLink({ claim, partner, project, routes }: ClaimDetailsLinkRoutes) {
  const { getContent } = useContent();
  const { isActive: isProjectActive } = useProjectStatus();

  const linkType = isProjectActive ? getClaimDetailsLinkType({ claim, partner, project }) : "view";

  if (!linkType) return null;

  const linkProps = {
    projectId: project.id,
    partnerId: partner.id,
    periodId: claim.periodId,
  };

  const linkTypeOptions = {
    edit: {
      route: routes.prepareClaim.getLink(linkProps),
      children: getContent(x => x.components.claimDetailsLinkContent.editClaimText),
    },
    review: {
      route: routes.reviewClaim.getLink(linkProps),
      children: getContent(x => x.components.claimDetailsLinkContent.reviewClaimText),
    },
    view: {
      route: routes.claimDetails.getLink(linkProps),
      children: getContent(x => x.components.claimDetailsLinkContent.viewClaimText),
    },
  };

  return (
    <div className="claim-details-link-wrapper">
      <Link {...linkTypeOptions[linkType]} />
    </div>
  );
}

export function getClaimDetailsLinkType({
  project,
  partner,
  claim,
}: ClaimDetailsBaseProps): "edit" | "review" | "view" | null {
  if (partner.partnerStatus === PartnerStatus.OnHold || partner.isWithdrawn) {
    return "view";
  }

  const { isMo: isProjectMo, isPm: isProjectPm, isPmOrMo: isProjectPmOrMo } = getAuthRoles(project.roles);
  const isPartnerFc = getAuthRoles(partner.roles).isFc;

  switch (claim.status) {
    case ClaimStatus.DRAFT:
    case ClaimStatus.AWAITING_IAR: {
      if (isPartnerFc) return "edit";
      if (isProjectPmOrMo) return "view";

      return null;
    }

    case ClaimStatus.MO_QUERIED:
      return isProjectMo && !isProjectPm ? "view" : "edit";

    case ClaimStatus.INNOVATE_QUERIED:
      return isPartnerFc ? "edit" : "view";

    case ClaimStatus.SUBMITTED:
      if (isProjectMo) return "review";

    default:
      return "view";
  }
}
