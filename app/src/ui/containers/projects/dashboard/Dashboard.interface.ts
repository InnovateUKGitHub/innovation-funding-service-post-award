import { BaseProps } from "@ui/containers/containerBase";
import { PartnerDtoGql, ProjectDtoGql } from "@framework/dtos";

export type Section = "archived" | "open" | "awaiting" | "upcoming" | "pending";

export type CuratedSections = Exclude<Section, "awaiting">;
export type CuratedSection<T> = { [key in CuratedSections]: T };
export type Project = Pick<
  ProjectDtoGql,
  | "claimsOverdue"
  | "claimsToReview"
  | "endDate"
  | "id"
  | "isPastEndDate"
  | "leadPartnerId"
  | "leadPartnerName"
  | "numberOfOpenClaims"
  | "numberOfPeriods"
  | "partnerRoles"
  | "pcrsQueried"
  | "pcrsToReview"
  | "periodEndDate"
  | "periodId"
  | "periodStartDate"
  | "projectNumber"
  | "roles"
  | "startDate"
  | "status"
  | "statusName"
  | "title"
> & { partners: Partner[] };
export type Partner = Pick<
  PartnerDtoGql,
  "id" | "claimStatus" | "partnerStatus" | "newForecastNeeded" | "name" | "isWithdrawn" | "isLead" | "projectId"
>;

export interface ProjectProps {
  section: Section;
  project: Project;
  partner?: Partner;
}

export interface DashboardProjectProps extends ProjectProps {
  routes: BaseProps["routes"];
}

export type DashboardProjectAttr = Pick<DashboardProjectProps, "partner" | "routes" | "section">;

export interface ProjectData {
  project: Project;
  partner?: Partner;
  curatedSection: Section;
}

export type FilterOptions =
  | "CLAIMS_TO_REVIEW"
  | "CLAIMS_TO_SUBMIT"
  | "CLAIMS_TO_UPLOAD_REPORT"
  | "CLAIMS_TO_RESPOND"
  | "PCRS_TO_REVIEW"
  | "PCRS_QUERIED"
  | "SETUP_REQUIRED";
