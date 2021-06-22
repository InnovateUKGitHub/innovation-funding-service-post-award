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

export interface ClaimDetailsBaseProps {
  claim: Pick<ClaimDto, "status" | "periodId">;
  project: Pick<ProjectDto, "id" | "status" | "roles">;
  partner: Pick<PartnerDto, "id" | "roles" | "partnerStatus">;
}

interface ClaimDetailsLinkRoutes extends ClaimDetailsBaseProps {
  routes: IRoutes;
}

export function ClaimDetailsLink(props: ClaimDetailsLinkRoutes) {
  const { getContent } = useContent();

  const linkProps = {
    projectId: props.project.id,
    partnerId: props.partner.id,
    periodId: props.claim.periodId,
  };

  const linkType = getClaimDetailsLinkType(props);

  if (!linkType) return null;

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

type LinkTypeResponse = "edit" | "review" | "view" | null;

export function getClaimDetailsLinkType({ project, partner, claim }: ClaimDetailsBaseProps): LinkTypeResponse {
  if (project.status === ProjectStatus.OnHold) return "view";
  if (partner.partnerStatus === PartnerStatus.OnHold) return "view";

  const isProjectMo = getAuthRoles(project.roles).isMo;
  const isPartnerFc = getAuthRoles(partner.roles).isFc;

  switch (claim.status) {
    case ClaimStatus.DRAFT:
      if (isPartnerFc) return "edit";
      if (isProjectMo) return "view";

      return null;
    case ClaimStatus.MO_QUERIED:

    case ClaimStatus.INNOVATE_QUERIED:
      if (isPartnerFc) return "edit";

      return "view";
    case ClaimStatus.SUBMITTED:
      if (isProjectMo) return "review";

    default:
      return "view";
  }
}
