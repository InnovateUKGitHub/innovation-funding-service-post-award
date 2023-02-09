import { GraphQLContext } from "@gql/GraphQLContext";
import { SalesforceAccProjectObject } from "@gql/typegraphql/object/sf/SalesforceAccProjectObject";
import { SalesforceAccProjectParticipantObject } from "@gql/typegraphql/object/sf/SalesforceAccProjectParticipantObject";
import { SalesforceApiObject } from "@gql/typegraphql/object/sf/SalesforceApiObject";
import { GraphQLResolveInfo } from "graphql";
import { Arg, Ctx, FieldResolver, Info, Query, Resolver } from "type-graphql";
import { setupDataLoaders, sfResolver } from "./sfResolver";

@Resolver(() => SalesforceApiObject)
class SalesforceApiResolver {
  @Query(() => SalesforceApiObject)
  async salesforce(
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo,
    @Arg("login", () => String, { nullable: true }) login?: string,
  ) {
    

    setupDataLoaders({ context, info });

    return {};
  }

  @FieldResolver(() => SalesforceAccProjectObject)
  async project(@Arg("id", () => String) id: string, @Ctx() context: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    return sfResolver({ context, info, ids: [id] });
  }

  @FieldResolver(() => SalesforceAccProjectParticipantObject)
  async projectParticipant(
    @Arg("id", () => String) id: string,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo,
  ) {
    return sfResolver({ context, info, ids: [id] });
  }

  @FieldResolver(() => [SalesforceAccProjectObject])
  async projects(@Ctx() context: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    return sfResolver({ context, info });
  }

  @FieldResolver(() => [SalesforceAccProjectParticipantObject])
  async projectParticipants(@Ctx() context: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    return sfResolver({ context, info });
  }
}

export { SalesforceApiResolver };
