import { GraphQLContext } from "@gql/GraphQLContext";
import type { IFieldResolverOptions } from "@graphql-tools/utils";
import { DataloaderNotFoundError } from "@server/repositories/errors";

const isOwnerResolver: IFieldResolverOptions = {
  selectionSet: `{ Id ContentDocument { CreatedBy { Id }} }`,
  async resolve(input, args, ctx: GraphQLContext) {
    const userData = await ctx.userContactDataLoader.load(ctx.email);

    /**
     * `isOwner` flag is true if the document was created by the current user
     */
    return !(userData instanceof DataloaderNotFoundError) && userData.Id === input?.ContentDocument?.CreatedBy?.Id;
  },
};

export { isOwnerResolver };
