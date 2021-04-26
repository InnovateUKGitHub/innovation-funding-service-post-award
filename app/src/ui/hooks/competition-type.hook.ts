import { LoadingStatus } from "@shared/pending";
import { useStores } from "@ui/redux";

export type useCompetitionTypeArgs = Record<string, any>;

export function useCompetitionType(params: useCompetitionTypeArgs): string | undefined {
  const { projects } = useStores();

  // TODO: Throw error when projectID is not available - content solution requires param.projectId some containers call this param.id
  const selectedProjectId: string | undefined = params.projectId || params.id;

  if (!selectedProjectId) {
    // Note: Some pages have no projectId param to derive from
    return undefined;
  }

  const projectPayload = projects.getById(selectedProjectId);

  if (projectPayload.error || projectPayload.state === LoadingStatus.Failed) {
    throw new Error(
      `There was an error fetching your project using id '${selectedProjectId}', a competition type could not be used.`,
    );
  }

  return projectPayload?.data?.competitionType;
}

export function projectCompetition(competition: string) {
  const isCRandD: boolean = competition === "CR&D";
  const isContracts: boolean = competition === "CONTRACTS";
  const isKTP: boolean = competition === "KTP";
  const isCatapults: boolean = competition === "CATAPULTS";
  const isLoans: boolean = competition === "LOANS";

  const isSBRI: boolean = competition === "SBRI";
  const isSBRI_IFS: boolean = competition === "SBRI IFS";
  const isCombinationOfSBRI: boolean = isSBRI || isSBRI_IFS;

  return {
    isCRandD,
    isContracts,
    isSBRI,
    isSBRI_IFS,
    isCombinationOfSBRI,
    isKTP,
    isCatapults,
    isLoans,
  };
}
