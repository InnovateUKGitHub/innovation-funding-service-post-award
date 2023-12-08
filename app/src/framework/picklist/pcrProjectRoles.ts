import { PCRProjectRole } from "@framework/constants/pcrConstants";

export const pcrProjectRoles = [
  {
    value: PCRProjectRole.Collaborator,
    label: "Collaborator",
    id: "collaborator",
    active: true,
  },
  {
    value: PCRProjectRole.ProjectLead,
    label: "Project Lead",
    id: "project_lead",
    active: true,
  },
] as const;
