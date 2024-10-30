import { GraphQLContext } from "@gql/GraphQLContext";
import type { IFieldResolverOptions } from "@graphql-tools/utils";

const isOwnerResolver: IFieldResolverOptions = {
  selectionSet: `{ Id ContentDocument { CreatedBy { Id }} }`,
  async resolve(input, args, ctx: GraphQLContext) {
    const userData = await ctx.userContactDataLoader.load(ctx.email);

    /**
     * `isOwner` flag is true if the document was created by the current user
     */
    return userData?.Id && userData.Id === input?.ContentDocument?.CreatedBy?.Id;
  },
};

export { isOwnerResolver };
