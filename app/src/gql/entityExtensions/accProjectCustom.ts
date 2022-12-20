import { ResolverContext } from "@gql/sfdc-graphql-endpoint/src/graphql/resolvers";
import { AdditionalEntity } from "@gql/sfdc-graphql-endpoint/src/sfdc/schema";
import { SOQLComparisonOperator, SOQLConditionExprType, SOQLFieldType } from "@gql/sfdc-graphql-endpoint/src/sfdc/soql";
import { SOQLRecord, SOQLResult } from "@gql/sfdc-graphql-endpoint/src/sfdc/types/soql";
import { configuration } from "@server/features/common";
import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";

type AccProjectCustom = SOQLRecord<{
  Project_Contact_Links__r: null | SOQLResult<{
    Acc_Role__c: string;
  }>;
}>;

const accProjectCustomEntityExtension: AdditionalEntity[] = [
  /**
   * Obtain the project roles based on the Project Contact Links
   */
  {
    name: "roles",
    field: {
      type: new GraphQLObjectType({
        name: "GqlProjectRoles",
        fields: () => ({
          isMo: { type: GraphQLBoolean, description: "Whether the currently logged in user is a 'Monitoring Officer'" },
          isFc: { type: GraphQLBoolean, description: "Whether the currently logged in user is a 'Financial Contact'" },
          isPm: { type: GraphQLBoolean, description: "Whether the currently logged in user is a 'Project Manager'" },
          isSu: { type: GraphQLBoolean, description: "Whether the currently logged in user is the System User" },
        }),
      }),
      resolve(source: AccProjectCustom, _, ctx: ResolverContext) {
        if (ctx.connection.email === configuration.salesforceServiceUser.serviceUsername) {
          return {
            isMo: true,
            isFc: true,
            isPm: true,
            isSu: true,
          };
        }

        const rolesList = source.Project_Contact_Links__r?.records.map(x => x.Acc_Role__c) ?? [];

        const roles = {
          isMo: rolesList?.includes("Monitoring officer"),
          isFc: rolesList?.includes("Finance contact"),
          isPm: rolesList?.includes("Project Manager"),
          isSu: false,
        };

        return roles;
      },
    },
    select: ctx => ({
      type: SOQLFieldType.SUB_QUERY,
      table: "Project_Contact_Links__r",
      selects: [
        {
          name: "Acc_Role__c",
          type: SOQLFieldType.FIELD,
        },
      ],
      where: {
        type: SOQLConditionExprType.FIELD_EXPR,
        field: "Acc_EmailOfSFContact__c",
        operator: SOQLComparisonOperator.EQ,
        value: ctx.connection.email,
      },
    }),
  },
];

export { accProjectCustomEntityExtension };
