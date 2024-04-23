import { Field, ObjectType } from "type-graphql";

@ObjectType("DeveloperObject")
class DeveloperObject {
  @Field(() => String, { nullable: true })
  email!: string | null;
}

export { DeveloperObject };
