/**
 * simply maps out partner roles to get rid of the annoying readonly tags
 */
export const getPartnerRoles = (
  rolesNode: Readonly<{ partnerRoles?: Readonly<Readonly<SfPartnerRoles>[]> } | null>,
) => {
  return (
    rolesNode?.partnerRoles?.map(x => ({
      isFc: x?.isFc ?? false,
      isPm: x?.isPm ?? false,
      isMo: x?.isMo ?? false,
      partnerId: x?.partnerId ?? "unknown partner id",
    })) ?? []
  );
};
