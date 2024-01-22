export type ProjectRoleName =
  | "Monitoring officer"
  | "Project Manager"
  | "Finance contact"
  | "Innovation lead"
  | "IPM"
  | "Associate";

export interface ProjectContactDto {
  accountId?: string;
  email: string;
  id: string;
  name: string;
  projectId: ProjectId;
  role: ProjectRoleName;
  roleName: string;
}
