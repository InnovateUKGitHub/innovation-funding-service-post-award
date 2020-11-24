import React from "react";
import { ClaimDto, ClaimStatus, PartnerDto, PartnerStatus, ProjectDto, ProjectRole, ProjectStatus } from "@framework/types";
import { IRoutes } from "@ui/routing";
import { Link } from "../links";
import { useContent } from "@ui/hooks";

export interface ClaimDetailsLinkProps {
  claim: ClaimDto;
  project: ProjectDto;
  partner: PartnerDto;
}

interface ClaimDetailsLinkRoutes extends ClaimDetailsLinkProps {
  routes: IRoutes;
}

export const ClaimDetailsLink: React.FunctionComponent<ClaimDetailsLinkRoutes> = (props) => {
  const linkProps = { projectId: props.project.id, partnerId: props.partner.id, periodId: props.claim.periodId };
  const { getContent } = useContent();

  switch (getClaimDetailsLinkType(props)) {
    case "edit":
      return <Link route={props.routes.prepareClaim.getLink(linkProps)}>{getContent(x => x.components.claimDetailsLinkContent.editClaimText)}</Link>;

    case "review":
      return <Link route={props.routes.reviewClaim.getLink(linkProps)}>{getContent(x => x.components.claimDetailsLinkContent.reviewClaimText)}</Link>;

    case "view":
      return <Link route={props.routes.claimDetails.getLink(linkProps)}>{getContent(x => x.components.claimDetailsLinkContent.viewClaimText)}</Link>;

    default:
      return null;
  }
};

export const getClaimDetailsLinkType = (props: {claim: ClaimDto; project: ProjectDto; partner: PartnerDto;}): "edit" | "review" | "view" | "nothing" => {

  if (props.project.status === ProjectStatus.OnHold) return "view";
  if (props.partner.partnerStatus === PartnerStatus.OnHold) return "view";
  switch (props.claim.status) {
    case ClaimStatus.DRAFT:
      if (props.partner.roles & ProjectRole.FinancialContact) {
        return "edit";
      }
      else if (props.project.roles & ProjectRole.MonitoringOfficer) {
        return "view";
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
