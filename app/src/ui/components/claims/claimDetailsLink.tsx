import React from "react";
import { ClaimDto, ClaimStatus, PartnerDto, ProjectDto, ProjectRole, ProjectStatus } from "@framework/types";
import { IRoutes } from "@ui/routing";
import { Link } from "../links";

interface Props {
  claim: ClaimDto;
  project: ProjectDto;
  partner: PartnerDto;
}

interface PropsWithRoutes extends Props {
  routes: IRoutes;
}

export const ClaimDetailsLink: React.SFC<PropsWithRoutes> = (props) => {
  const linkProps = { projectId: props.project.id, partnerId: props.partner.id, periodId: props.claim.periodId };

  switch (getClaimDetailsLinkType(props)) {
    case "edit":
      return <Link route={props.routes.prepareClaim.getLink(linkProps)}>Edit claim</Link>;

    case "review":
      return <Link route={props.routes.reviewClaim.getLink(linkProps)}>Review claim</Link>;

    case "view":
      return <Link route={props.routes.claimDetails.getLink(linkProps)}>View claim</Link>;

    default:
      return null;
  }
};

export const getClaimDetailsLinkType = (props: {claim: ClaimDto; project: ProjectDto; partner: PartnerDto;}): "edit" | "review" | "view" | "nothing" => {

  if (props.project.status === ProjectStatus.OnHold) return "view";

  switch (props.claim.status) {
    case ClaimStatus.DRAFT:
      if (props.partner.roles & ProjectRole.FinancialContact) {
        return "edit";
      }
      else {
        return "nothing";
      }
    case ClaimStatus.MO_QUERIED:
    case ClaimStatus.INNOVATE_QUERIED:
      if (props.partner.roles & ProjectRole.FinancialContact) {
        return "edit";
      }
      else {
        return "view";
      }
    case ClaimStatus.SUBMITTED:
      if (props.project.roles & ProjectRole.MonitoringOfficer) {
        return "review";
      }
  }
  return "view";
};
