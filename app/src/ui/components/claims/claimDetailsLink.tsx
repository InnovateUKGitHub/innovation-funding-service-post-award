import {
  ClaimDto,
  ClaimStatus,
  getAuthRoles,
  PartnerDto,
  PartnerStatus,
  ProjectDto,
  ProjectStatus,
} from "@framework/types";
import { IRoutes } from "@ui/routing";
import { useContent } from "@ui/hooks";
import { Link } from "../links";

interface ClaimDetailsBaseProps {
  claim: Pick<ClaimDto, "status" | "periodId">;
  project: Pick<ProjectDto, "id" | "status" | "roles">;
  partner: Pick<PartnerDto, "id" | "roles" | "partnerStatus">;
}

export interface ClaimDetailsLinkRoutes extends ClaimDetailsBaseProps {
  routes: IRoutes;
}

export function ClaimDetailsLink(props: ClaimDetailsLinkRoutes) {
  const { getContent } = useContent();

  const linkType = getClaimDetailsLinkType(props);

  if (!linkType) return null;

  const linkProps = {
    projectId: props.project.id,
    partnerId: props.partner.id,
    periodId: props.claim.periodId,
  };

  const linkTypeOptions = {
    edit: {
      route: props.routes.prepareClaim.getLink(linkProps),
      children: getContent(x => x.components.claimDetailsLinkContent.editClaimText),
    },
    review: {
      route: props.routes.reviewClaim.getLink(linkProps),
      children: getContent(x => x.components.claimDetailsLinkContent.reviewClaimText),
    },
    view: {
      route: props.routes.claimDetails.getLink(linkProps),
      children: getContent(x => x.components.claimDetailsLinkContent.viewClaimText),
    },
  };

  return <Link {...linkTypeOptions[linkType]} />;
}

export function getClaimDetailsLinkType({
  project,
  partner,
  claim,
}: ClaimDetailsBaseProps): "edit" | "review" | "view" | null {
  if (project.status === ProjectStatus.OnHold) return "view";
  if (partner.partnerStatus === PartnerStatus.OnHold) return "view";

  const { isMo: isProjectMo, isPm: isProjectPm } = getAuthRoles(project.roles);
  const isPartnerFc = getAuthRoles(partner.roles).isFc;

  switch (claim.status) {
    case ClaimStatus.DRAFT:
      if (isPartnerFc) return "edit";
      if (isProjectMo) return "view";

      return null;
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
