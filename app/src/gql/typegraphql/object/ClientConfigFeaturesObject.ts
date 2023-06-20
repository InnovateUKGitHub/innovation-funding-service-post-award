import { IFeatureFlags } from "@framework/types/IFeaturesFlags";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType("ClientConfigFeaturesObject")
class ClientConfigFeaturesObject implements IFeatureFlags {
  @Field(() => Boolean)
  changePeriodLengthWorkflow!: boolean;

  @Field(() => Boolean)
  customContent!: boolean;

  @Field(() => Int)
  searchDocsMinThreshold!: number;

  @Field(() => Int)
  futureTimeExtensionInYears!: number;
}

export { ClientConfigFeaturesObject };
