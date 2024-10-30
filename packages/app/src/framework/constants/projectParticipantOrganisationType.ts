enum ProjectParticipantOrganisationTypes {
  academic = "Academic",
  industrial = "Industrial",
}

const allProjectParticipantOrganisationTypes = [
  ["academic", ProjectParticipantOrganisationTypes.academic],
  ["industrial", ProjectParticipantOrganisationTypes.industrial],
] as const;

export { allProjectParticipantOrganisationTypes, ProjectParticipantOrganisationTypes };
