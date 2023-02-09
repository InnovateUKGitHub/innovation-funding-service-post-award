import { Field, ObjectType } from "type-graphql";
import { SalesforceAccProjectObject } from "./SalesforceAccProjectObject";

@ObjectType()
class SalesforceApiObject {
  @Field(() => [SalesforceAccProjectObject])
  projects!: SalesforceAccProjectObject[];
}

export { SalesforceApiObject };
