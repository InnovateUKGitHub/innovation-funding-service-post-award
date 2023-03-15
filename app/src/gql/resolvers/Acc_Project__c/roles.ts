import { GraphQLContext } from "@gql/GraphQLContext";
import type { IFieldResolverOptions } from "@graphql-tools/utils";
import { configuration } from "@server/features/common";

interface ExternalRoles {
  isMo: boolean;
  isFc: boolean;
  isPm: boolean;
  isSalesforceSystemUser: boolean;
}

interface ExternalPartnerRoles extends ExternalRoles {
  partnerId: string;
}

interface ExternalProjectRoles extends ExternalRoles {
  partnerRoles: ExternalPartnerRoles[];
}

const rolesResolver: IFieldResolverOptions = {
  selectionSet: `{ Id }`,
  async resolve(input, args, ctx: GraphQLContext): Promise<ExternalProjectRoles> {
    const isSalesforceSystemUser = ctx.email === configuration.salesforceServiceUser.serviceUsername;

    const contactData = await ctx.userContactDataLoader.load(ctx.email);
    const roleData = await ctx.projectRolesDataLoader.load(input.Id);

    // Initialise an empty list of permissions.
    const permissions: ExternalProjectRoles = {
      isMo: isSalesforceSystemUser,
      isFc: isSalesforceSystemUser,
      isPm: isSalesforceSystemUser,
      isSalesforceSystemUser,
      partnerRoles: [],
    };

    // Make sure our role data and contact data exists first.
    // If it doesn't, return the empty list of permissions.
    if (!(roleData && contactData)) return permissions;

    // Grab the Contact ID that is related to the current logged in user.
    // In the event the contactId is undefined, for example, incorrectly setup Salesforce,
    // none of the following checks will set a role properly.
    const contactId = contactData.node?.ContactId?.value;
    const project = roleData.node;

    for (const { node: projectContactLink } of project.Project_Contact_Links__r.edges) {
      // If the user's Contact ID is the same as the Contact ID for the PCL, then apply the role for the PCL.
      if (projectContactLink?.Acc_ContactId__r?.Id === contactId) {
        if (projectContactLink.Acc_Role__c.value === "Monitoring officer") permissions.isMo = true;
        if (projectContactLink.Acc_Role__c.value === "Finance contact") permissions.isFc = true;
        if (projectContactLink.Acc_Role__c.value === "Project Manager") permissions.isPm = true;
      }

      for (const { node: projectParticipant } of project.Acc_ProjectParticipantsProject__r.edges) {
        const existingPartnerPermissions = permissions.partnerRoles.find(
          x => x.partnerId === projectParticipant.Acc_AccountId__c.value,
        );
        const partnerPermissions = existingPartnerPermissions ?? {
          isMo: isSalesforceSystemUser,
          isFc: isSalesforceSystemUser,
          isPm: isSalesforceSystemUser,
          isSalesforceSystemUser: ctx.email === configuration.salesforceServiceUser.serviceUsername,
          partnerId: projectParticipant.Acc_AccountId__c.value,
        };

        if (
          projectContactLink?.Acc_ContactId__r?.Id === contactId &&
          projectContactLink.Acc_AccountId__c.value === projectParticipant.Acc_AccountId__c.value
        ) {
          if (permissions.isFc) partnerPermissions.isFc = true;
          if (permissions.isPm && projectParticipant.Acc_ProjectRole__c.value === "Lead")
            partnerPermissions.isPm = true;
        }

        if (!existingPartnerPermissions) permissions.partnerRoles.push(partnerPermissions);
      }
    }

    return permissions;
  },
};

export { rolesResolver };
