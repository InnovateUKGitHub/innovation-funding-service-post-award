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
  async resolve(input, args, ctx: GraphQLContext, info) {
    const isSalesforceSystemUser = ctx.email === configuration.salesforceServiceUser.serviceUsername;

    const { node: project } = await ctx.projectRolesDataLoader.load(input.Id);

    const permissions: ExternalProjectRoles = {
      isMo: isSalesforceSystemUser,
      isFc: isSalesforceSystemUser,
      isPm: isSalesforceSystemUser,
      isSalesforceSystemUser,
      partnerRoles: [],
    };

    for (const { node: projectContactLink } of project.Project_Contact_Links__r.edges) {
      if (ctx.email === projectContactLink?.Acc_ContactId__r?.Email__c?.value) {
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

        if (projectContactLink.Acc_AccountId__c.value === projectParticipant.Acc_AccountId__c.value) {
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
