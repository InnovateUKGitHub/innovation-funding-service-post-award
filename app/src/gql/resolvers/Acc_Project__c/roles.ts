import { GraphQLContext } from "@gql/GraphQLContext";
import type { IFieldResolverOptions } from "@graphql-tools/utils";
import { configuration } from "@server/features/common/config";

interface ExternalRoles {
  isMo: boolean;
  isFc: boolean;
  isPm: boolean;
  isAssociate: boolean;
  isSalesforceSystemUser: boolean;
}

interface ExternalPartnerRoles extends ExternalRoles {
  partnerId: string;
  accountId: string;
}

interface ExternalProjectRoles extends ExternalRoles {
  partnerRoles: ExternalPartnerRoles[];
}

const rolesResolver: IFieldResolverOptions = {
  selectionSet: `{ Id }`,
  async resolve(input, args, ctx: GraphQLContext): Promise<ExternalProjectRoles> {
    const isSalesforceSystemUser = ctx.email === configuration.salesforceServiceUser.serviceUsername;
    const [userData, roleData] = await Promise.all([
      ctx.userContactDataLoader.load(ctx.email),
      ctx.projectRolesDataLoader.load(input.Id),
    ]);

    // Initialise an empty list of permissions.
    const permissions: ExternalProjectRoles = {
      isMo: isSalesforceSystemUser,
      isFc: isSalesforceSystemUser,
      isPm: isSalesforceSystemUser,
      isAssociate: false,
      isSalesforceSystemUser,
      partnerRoles: [],
    };

    // Make sure our role data and contact data exists first.
    // If it doesn't, return the empty list of permissions.
    if (!(roleData && userData)) return permissions;

    // Grab the Contact ID that is related to the current logged in user.
    // In the event the contactId is undefined, for example, incorrectly setup Salesforce,
    // none of the following checks will set a role properly.
    const contactId = userData?.Contact?.Id;
    const project = roleData.node;

    for (const { node: projectContactLink } of project.Project_Contact_Links__r.edges) {
      // console.log("roles.ts > rolesResolver > projectContactLink > Acc_Role__c", projectContactLink.Acc_Role__c.value);
      // If the user's Contact ID is the same as the Contact ID for the PCL, then apply the role for the PCL.
      if (projectContactLink?.Acc_ContactId__r?.Id === contactId) {
        if (projectContactLink.Acc_Role__c.value === "Monitoring officer") permissions.isMo = true;
        if (projectContactLink.Acc_Role__c.value === "Finance contact") permissions.isFc = true;
        if (projectContactLink.Acc_Role__c.value === "Project Manager") permissions.isPm = true;
        if (projectContactLink.Acc_Role__c.value === "Associate") permissions.isAssociate = true;
      }

      for (const { node: projectParticipant } of project.Acc_ProjectParticipantsProject__r.edges) {
        const existingPartnerPermissions = permissions.partnerRoles.find(x => x.partnerId === projectParticipant.Id);
        const partnerPermissions = existingPartnerPermissions ?? {
          isMo: isSalesforceSystemUser,
          isFc: isSalesforceSystemUser,
          isPm: isSalesforceSystemUser,
          isAssociate: false,
          isSalesforceSystemUser: ctx.email === configuration.salesforceServiceUser.serviceUsername,
          accountId: projectParticipant.Acc_AccountId__c.value,
          partnerId: projectParticipant.Id,
        };

        if (
          projectContactLink?.Acc_ContactId__r?.Id === contactId &&
          projectContactLink.Acc_AccountId__c.value === projectParticipant.Acc_AccountId__c.value
        ) {
          if (permissions.isFc) partnerPermissions.isFc = true;
          if (permissions.isPm && projectParticipant.Acc_ProjectRole__c.value === "Lead")
            partnerPermissions.isPm = true;

          // TODO: find rules for partner permissions
        }

        if (!existingPartnerPermissions) permissions.partnerRoles.push(partnerPermissions);
      }
    }

    return permissions;
  },
};

export { rolesResolver };
