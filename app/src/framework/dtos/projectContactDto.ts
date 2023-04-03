export interface ProjectContactDto {
  accountId?: string;
  email: string;
  id: string;
  name: string;
  projectId: ProjectId;
  role: "Monitoring officer" | "Project Manager" | "Finance contact" | "Innovation lead" | "IPM";
  roleName: string;
}
