import type { GraphQLContext } from "@gql/GraphQLContext";
import { configuration } from "@server/features/common/config";
import { Ctx, Query, Resolver } from "type-graphql";
import { CurrentUserObject } from "../object/CurrentUserObject";
import { DataloaderNotFoundError } from "@server/repositories/errors";

@Resolver()
class CurrentUserResolver {
  @Query(() => CurrentUserObject)
  async currentUser(@Ctx() ctx: GraphQLContext): Promise<CurrentUserObject> {
    const userInfo = await ctx.userContactDataLoader.load(ctx.email);

    if (userInfo instanceof DataloaderNotFoundError) {
      return {
        email: null,
        userId: null,
        accountId: null,
        contactId: null,
        isSystemUser: false,
      };
    }

    return {
      email: ctx.email,
      userId: userInfo.Id,
      accountId: userInfo?.Account?.Id,
      contactId: userInfo?.Contact?.Id,
      isSystemUser: ctx.email === configuration.salesforceServiceUser.serviceUsername,
    };
  }
}

export { CurrentUserResolver };
