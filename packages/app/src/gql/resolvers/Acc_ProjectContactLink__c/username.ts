import { GraphQLContext } from "@gql/GraphQLContext";
import type { IFieldResolverOptions } from "@graphql-tools/utils";
import { DataloaderNotFoundError } from "@server/repositories/errors";

const usernameResolver: IFieldResolverOptions = {
  selectionSet: `{ Id }`,
  async resolve(input, args, ctx: GraphQLContext): Promise<string | null> {
    const roleData = await ctx.usernameDataLoader.load(input.Id);

    if (roleData instanceof DataloaderNotFoundError) return null;

    return roleData?.node?.Username?.value ?? null;
  },
};

export { usernameResolver };
