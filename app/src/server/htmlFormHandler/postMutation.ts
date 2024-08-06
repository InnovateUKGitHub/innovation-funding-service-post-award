import { IContext } from "@framework/types/IContext";
import { Api } from "@gql/sf/Api";
import { GraphQLTaggedNode } from "relay-runtime";
import gql from "graphql-tag";

export type MutationNode = GraphQLTaggedNode & { params: { name: string; text: string } };

/**
 * this function will need to be improved. we will need to check that there no cases where these are
 * needed in the mutation, or a better solution for supporting access control and no js found
 */
const stripUiapiArgs = (str: string) =>
  str
    .replace(/(uiapi[\s\n]*)(\([\w\d:, $]+\))/, "$1")
    .replace(/\$partnerId: String!,{0,1}/g, "")
    .replace(/\$partnerIdStr: String!,{0,1}/g, "")
    .replace(/\$projectId: String!,{0,1}/g, "")
    .replace(/\$projectIdStr: String!,{0,1}/g, "");

export const postMutation = async <T extends MutationNode>(context: IContext, gqlMutation: T, variables: AnyObject) => {
  try {
    const api = await Api.asUser(context.user.email);
    const strippedText = stripUiapiArgs(gqlMutation.params.text);
    const document = gql`
      ${strippedText}
    `;

    const res = await api.executeGraphQL({
      document,
      variables,
      decodeHTMLEntities: true,
    });

    return res;
  } catch (er) {
    throw new Error("Error in postMutation: " + er);
  }
};
