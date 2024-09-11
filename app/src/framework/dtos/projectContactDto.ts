export enum ProjectRoleName {
  MonitoringOfficer = "Monitoring officer",
  ProjectManager = "Project Manager",
  FinanceContact = "Finance contact",
  InnovationLead = "Innovation lead",
  IPM = "IPM",
  Associate = "Associate",
  MainCompanyContact = "Main Company Contact",
  KBAdmin = "KB Admin",
}

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
  firstName: string;
  lastName: string;
  associateStartDate: Date | null;
  inactive: boolean;
  newTeamMember: boolean;
  sendInvitation: boolean;
  edited: boolean;
}
