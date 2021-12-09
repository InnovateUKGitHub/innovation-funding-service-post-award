import { ProjectStatusDto } from "@framework/dtos";
import { createContext } from "react";

export interface ProjectStatusContext extends ProjectStatusDto {
  overrideAccess: boolean;
}

/* eslint-disable @typescript-eslint/naming-convention */
export const ProjectActiveContext = createContext<ProjectStatusContext | undefined>(undefined);

/* eslint-disable @typescript-eslint/naming-convention */
export const ProjectStatusProvider = ProjectActiveContext.Provider;
