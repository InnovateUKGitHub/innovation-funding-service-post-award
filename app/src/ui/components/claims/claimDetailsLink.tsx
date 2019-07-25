import React from "react";
import { ClaimDto, ClaimStatus, PartnerDto, ProjectDto, ProjectRole, ProjectStatus } from "@framework/types";
import { Link } from "..";
import { ClaimsDetailsRoute, PrepareClaimRoute, ReviewClaimRoute } from "../../containers";

interface Props {
  claim: ClaimDto;
  project: ProjectDto;
  partner: PartnerDto;
}

export const ClaimDetailsLink: React.SFC<Props> = (props) => {
  const linkProps = { projectId: props.project.id, partnerId: props.partner.id, periodId: props.claim.periodId };

  switch (getClaimDetailsLinkType(props)) {
    case "edit":
      return <Link route={PrepareClaimRoute.getLink(linkProps)}>Edit claim</Link>;

    case "review":
      return <Link route={ReviewClaimRoute.getLink(linkProps)}>Review claim</Link>;

    case "view":
      return <Link route={ClaimsDetailsRoute.getLink(linkProps)}>View claim</Link>;

    default:
      return null;
  }
};

export const getClaimDetailsLinkType = (props: Props): "edit" | "review" | "view" | "nothing" => {

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
