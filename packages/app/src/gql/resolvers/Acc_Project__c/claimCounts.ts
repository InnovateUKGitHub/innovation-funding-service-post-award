import { ClaimStatus, ClaimStatusKey } from "@framework/constants/claimStatus";
import { GraphQLContext } from "@gql/GraphQLContext";
import type { IFieldResolverOptions } from "@graphql-tools/utils";

const claimCountsResolver: IFieldResolverOptions = {
  selectionSet: `{ Id }`,
  async resolve(input, args, ctx: GraphQLContext): Promise<Record<ClaimStatusKey, number>> {
    const userData = await ctx.projectClaimStatusCountsDataLoader.load(input.Id);

    const entries: [ClaimStatusKey, number][] = Object.entries(ClaimStatus).map(([statusName, status]) => [
      statusName as ClaimStatusKey,
      userData?.find(x => x.Acc_ClaimStatus__c === status)?.expr0 ?? 0,
    ]);

    return Object.fromEntries(entries) as Record<ClaimStatusKey, number>;
  },
};

export { claimCountsResolver };
