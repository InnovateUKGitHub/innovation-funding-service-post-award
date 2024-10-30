import { GraphQLContext } from "@gql/GraphQLContext";
import type { IFieldResolverOptions } from "@graphql-tools/utils";

const usernameResolver: IFieldResolverOptions = {
  selectionSet: `{ Id }`,
  async resolve(input, args, ctx: GraphQLContext): Promise<string | null> {
    const roleData = await ctx.usernameDataLoader.load(input.Id);

    return roleData?.node?.Username?.value ?? null;
  },
};

export { usernameResolver };
