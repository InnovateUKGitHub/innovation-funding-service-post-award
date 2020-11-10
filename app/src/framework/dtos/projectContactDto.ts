export interface ProjectContactDto {
    id: string;
    name: string;
    role: "Monitoring officer" | "Project Manager" | "Finance contact" | "Innovation lead" | "IPM";
    roleName: string;
    email: string;
    accountId?: string;
    projectId: string;
}
