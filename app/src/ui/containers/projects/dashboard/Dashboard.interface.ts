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
