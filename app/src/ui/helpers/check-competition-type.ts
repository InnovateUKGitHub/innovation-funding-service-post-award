export function checkProjectCompetition(competition: string) {
  const isCRandD: boolean = competition === "CR&D";
  const isContracts: boolean = competition === "CONTRACTS";
  const isKTP: boolean = competition === "KTP";
  const isCatapults: boolean = competition === "CATAPULTS";
  const isLoans: boolean = competition === "LOANS";

  const isSBRI: boolean = competition === "SBRI";
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const isSBRI_IFS: boolean = competition === "SBRI IFS"; // Note: this is a valid exception due to how hard it would be to read two i's in a row
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
