enum AccOrder {
  // Doesn't matter
  ACCOUNT_LOAD,
  COMPETITION_LOAD,

  // Depends on User
  CONTACT_LOAD,

  // Depends on Contact
  USER_LOAD,

  // Depends on competition
  ACC_PROJECT_LOAD,

  // Needs contacts/pcls loaded in project first
  ACC_PROJECT_POSTLOAD,
}

export { AccOrder };
