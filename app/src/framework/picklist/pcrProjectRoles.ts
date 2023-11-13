import { PCRProjectRole } from "@framework/constants/pcrConstants";
import { Option } from "@framework/dtos/option";

export const pcrProjectRoles = [
  {
    value: PCRProjectRole.Collaborator,
    label: "Collaborator",
    active: true,
  },
  {
    value: PCRProjectRole.ProjectLead,
    label: "Project Lead",
    active: true,
  },
] as Option<PCRProjectRole>[];
