import { Field, ObjectType } from "type-graphql";

@ObjectType("CurrentUserObject")
class CurrentUserObject {
  @Field(() => String, { nullable: true })
  email!: string | null;

  @Field(() => String, { nullable: true })
  userId!: string | null;

  @Field(() => String, { nullable: true })
  accountId!: string | null;

  @Field(() => String, { nullable: true })
  contactId!: string | null;

  @Field(() => Boolean)
  isSystemUser!: boolean;
}

export { CurrentUserObject };
