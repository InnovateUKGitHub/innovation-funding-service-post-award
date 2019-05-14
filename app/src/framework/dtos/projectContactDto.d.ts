interface ProjectContactDto {
    id: string;
    name: string;
    role: "Monitoring officer" | "Project Manager" | "Finance contact";
    roleName: string;
    email: string;
    accountId?: string;
    projectId: string;
}
