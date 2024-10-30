enum ProjectParticipantTypes {
  business = "Business",
  knowledgeBase = "Knowledge base",
  research = "Research",
  rto = "Research and Technology Organisation (RTO)",
  other = "Public sector, charity or non Je-S registered research organisation",

  // Deprecated values
  academic = "Academic",
  industrial = "Industrial",
}

const allProjectParticipantTypes = [
  ["business", ProjectParticipantTypes.business],
  ["knowledgeBase", ProjectParticipantTypes.knowledgeBase],
  ["research", ProjectParticipantTypes.research],
  ["rto", ProjectParticipantTypes.rto],
  ["other", ProjectParticipantTypes.other],
] as const;

export { allProjectParticipantTypes, ProjectParticipantTypes };
