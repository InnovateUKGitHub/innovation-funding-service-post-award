import { LoadingStatus } from "@shared/pending";
import { useStores } from "@ui/redux";

export function useCompetitionType(projectId?: string): string | undefined {
  const { projects } = useStores();

  // Note: bail out as we can assume that were on a non-project specific page
  if (!projectId) return undefined;

  const { state, error, data: projectPayload } = projects.getById(projectId).then(x => x.competitionType);

  // Note: In first sever renders the payload as null (we bail out since it gets re-rendered)
  if (!projectPayload) return undefined;

  if (error || state === LoadingStatus.Failed) {
    throw new Error(`There was an error getting the competitionType from projectId - ${projectId}`);
  }

  return projectPayload;
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
