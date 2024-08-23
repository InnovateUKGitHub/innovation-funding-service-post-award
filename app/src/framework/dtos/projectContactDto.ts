export type ProjectRoleName =
  | "Monitoring officer"
  | "Project Manager"
  | "Finance contact"
  | "Innovation lead"
  | "IPM"
  | "Associate"
  | "Main Company Contact"
  | "KB Admin";

export interface ProjectContactDto {
  accountId: AccountId | undefined;
  contactId: ContactId;
  email: string;
  id: ProjectContactLinkId;
  name: string;
  projectId: ProjectId;
  role: ProjectRoleName;
  roleName: string;
  startDate: Date | null;
  endDate: Date | null;
  associateStartDate: Date | null;
}
