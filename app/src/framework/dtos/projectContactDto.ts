export type ProjectRoleName =
  | "Monitoring officer"
  | "Project Manager"
  | "Finance contact"
  | "Innovation lead"
  | "IPM"
  | "Associate";

export interface ProjectContactDto {
  accountId: AccountId | undefined;
  email: string;
  id: ContactId;
  name: string;
  projectId: ProjectId;
  role: ProjectRoleName;
  roleName: string;
  startDate: Date | null;
  endDate: Date | null;
  associateStartDate: Date | null;
}
