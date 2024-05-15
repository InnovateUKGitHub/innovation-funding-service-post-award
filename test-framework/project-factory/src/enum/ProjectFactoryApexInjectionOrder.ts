enum ProjectFactoryApexInjectionOrder {
  // Doesn't matter
  ACCOUNT_LOAD,
  COMPETITION_LOAD,

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

  // Needs contacts/pcls loaded in project first
  ACC_PROJECT_POSTLOAD,
}

export { ProjectFactoryApexInjectionOrder };
