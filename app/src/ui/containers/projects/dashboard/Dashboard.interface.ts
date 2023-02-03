import { BaseProps } from "@ui/containers/containerBase";
import { PartnerDto, ProjectDto } from "@framework/dtos";
import { DashboardProjectDashboardQuery$data } from "./__generated__/DashboardProjectDashboardQuery.graphql";
import { getPartnerOnProject, getProjectSection } from "./DashboardProject";

export type Section = "archived" | "open" | "awaiting" | "upcoming" | "pending";

export type CuratedSections = Exclude<Section, "awaiting">;
export type CuratedSection<T> = { [key in CuratedSections]: T };

export type IProject = NonNullable<
  NonNullable<
    UnwrapArray<
      NonNullable<
        NonNullable<DashboardProjectDashboardQuery$data["salesforce"]["uiapi"]["query"]["Acc_Project__c"]>["edges"]
      >
    >
  >["node"]
>;
export type IPartner = NonNullable<
  NonNullable<UnwrapArray<NonNullable<IProject["Acc_ProjectParticipantsProject__r"]>["edges"]>>["node"]
>;
export interface ProjectProps {
  section: Section;
  project: IProject;
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

export interface IDashboardProjectData {
  project: IProject;
  partner: ReturnType<typeof getPartnerOnProject>;
  projectSection: ReturnType<typeof getProjectSection>;
}

export type FilterOptions =
  | "CLAIMS_TO_REVIEW"
  | "CLAIMS_TO_SUBMIT"
  | "CLAIMS_TO_UPLOAD_REPORT"
  | "CLAIMS_TO_RESPOND"
  | "PCRS_TO_REVIEW"
  | "PCRS_QUERIED"
  | "SETUP_REQUIRED";
