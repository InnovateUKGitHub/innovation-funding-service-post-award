import { useStores } from "@ui/redux";
import { Params } from "router5";

export function useCompetitionType(params: Params): string | undefined {
  const { projects } = useStores();

  // TODO: This content solution requires param.projectId some containers call this param.id - need to address!
  const selectedProjectId: string = params.projectId || params.id;
  const selectedProject = (selectedProjectId && projects.getById(selectedProjectId).data) || undefined;

  return selectedProject && selectedProject.competitionType;
}

// type ICompetitions = "CR&D" | "KTP";

// TODO: Implement string literal type - { [key: `${is}ICompetitions`]: boolean }
export function projectCompetition(competition: string) {
  const isCRandD: boolean = competition === "CR&D";
  const isKTP: boolean = competition === "KTP";

  return {
    isKTP,
    isCRandD,
  };
}
