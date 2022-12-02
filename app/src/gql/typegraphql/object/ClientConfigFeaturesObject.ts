import { IFeatureFlags } from "@framework/types";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
class ClientConfigFeaturesObject implements IFeatureFlags {
  @Field(() => Boolean)
  changePeriodLengthWorkflow!: boolean;

  @Field(() => Boolean)
  contentHint!: boolean;

  @Field(() => Boolean)
  customContent!: boolean;

  @Field(() => Boolean)
  displayOtherContacts!: boolean;

  @Field(() => Int)
  searchDocsMinThreshold!: number;

  @Field(() => Int)
  futureTimeExtensionInYears!: number;
}

export { ClientConfigFeaturesObject };
