import { BaseProps } from "@ui/containers/containerBase";
import { PartnerDto, ProjectDto } from "@framework/dtos";

export type Section = "archived" | "open" | "awaiting" | "upcoming" | "pending";

export type CuratedSections = Exclude<Section, "awaiting">;
export type CuratedSection<T> = { [key in CuratedSections]: T };

export interface ProjectProps {
  section: Section;
  project: ProjectDto;
  partner?: PartnerDto;
}

export interface DashboardProjectProps extends ProjectProps {
  routes: BaseProps["routes"];
}

export type DashboardProjectAttr = Pick<DashboardProjectProps, "partner" | "routes" | "section">;

export interface ProjectData {
  project: ProjectDto;
  partner?: PartnerDto;
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
