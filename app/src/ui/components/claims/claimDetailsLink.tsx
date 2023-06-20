import { IRoutes } from "@ui/routing/routeConfig";
import { Link } from "@ui/components/links";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { PartnerStatus } from "@framework/constants/partner";
import { ClaimDto } from "@framework/dtos/claimDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { useContent } from "@ui/hooks/content.hook";
import { useProjectStatus } from "@ui/hooks/project-status.hook";

interface ClaimDetailsBaseProps {
  claim: Pick<ClaimDto, "status" | "periodId">;
  project: Pick<ProjectDto, "id" | "status" | "roles">;
  partner: Pick<PartnerDto, "id" | "roles" | "partnerStatus" | "isWithdrawn">;
}

export interface ClaimDetailsLinkRoutes extends ClaimDetailsBaseProps {
  routes: IRoutes;
}

export const ClaimDetailsLink = ({ claim, partner, project, routes }: ClaimDetailsLinkRoutes) => {
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
      children: getContent(x => x.components.claimDetailsLinkContent.editClaim),
    },
    review: {
      route: routes.reviewClaim.getLink(linkProps),
      children: getContent(x => x.components.claimDetailsLinkContent.reviewClaim),
    },
    view: {
      route: routes.claimDetails.getLink(linkProps),
      children: getContent(x => x.components.claimDetailsLinkContent.viewClaim),
    },
  };

  return (
    <div className="claim-details-link-wrapper">
      <Link {...linkTypeOptions[linkType]} />
    </div>
  );
};

export const getClaimDetailsLinkType = ({
  project,
  partner,
  claim,
}: ClaimDetailsBaseProps): "edit" | "review" | "view" | null => {
  if (partner.partnerStatus === PartnerStatus.OnHold || partner.isWithdrawn) {
    return "view";
  }

  const { isMo: isProjectMo, isPmOrMo: isProjectPmOrMo } = getAuthRoles(project.roles);
  const isPartnerFc = getAuthRoles(partner.roles).isFc;

  switch (claim.status) {
    case ClaimStatus.DRAFT:
    case ClaimStatus.AWAITING_IAR: {
      if (isPartnerFc) return "edit";
      if (isProjectPmOrMo) return "view";

      return null;
    }

    case ClaimStatus.MO_QUERIED:
    case ClaimStatus.INNOVATE_QUERIED:
      return isPartnerFc ? "edit" : "view";

    case ClaimStatus.SUBMITTED:
      if (isProjectMo) return "review";

    default:
      return "view";
  }
};
