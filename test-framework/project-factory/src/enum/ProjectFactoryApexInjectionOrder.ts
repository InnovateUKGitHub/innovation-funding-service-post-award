enum ProjectFactoryApexInjectionOrder {
  // Doesn't matter
  ACCOUNT_LOAD,
  COMPETITION_LOAD,
  COST_CATEGORIES_LOAD,

  // Depends on User
  CONTACT_LOAD,

  // Depends on Contact
  USER_LOAD,

  // Depends on competition
  ACC_PROJECT_LOAD,

  // Depends on account
  ACC_PROJECT_PARTICIPANT_LOAD,

  // Depends on Project, Contact, User and Account
  ACC_PROJECT_CONTACT_LINK_LOAD,

  // Profiles
  ACC_CLAIMS_AND_PROFILE_FETCH,
  ACC_PROFILE_DETAIL,
  ACC_PROFILE_TOTAL_COST_CATEGORY,
  ACC_CLAIM_TOTAL_PROJECT_PERIOD,
  ACC_CLAIMS_AND_PROFILE_LOAD,

  // PCRs
  ACC_PROJECT_CHANGE_REQUEST_REQUEST_HEADER,
  ACC_PROJECT_CHANGE_REQUEST_REMOVE_PROJECT_PARTICIPANT,

  // Needs contacts/pcls loaded in project first
  ACC_PROJECT_POSTLOAD,
}

export { ProjectFactoryApexInjectionOrder };
