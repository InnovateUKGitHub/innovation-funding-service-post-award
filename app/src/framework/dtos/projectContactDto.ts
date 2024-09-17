export enum ProjectRole {
  PROJECT_MANAGER = "projectManagers",
  FINANCE_CONTACT = "financeContacts",
  MAIN_COMPANY_CONTACT = "mainCompanyContacts",
  ASSOCIATE = "associates",
  KNOWLEDGE_BASE_ADMINISTRATOR = "knowledgeBaseAdministrators",
}

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
  contactId: ContactId | undefined;
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
  replaced: boolean;
}
