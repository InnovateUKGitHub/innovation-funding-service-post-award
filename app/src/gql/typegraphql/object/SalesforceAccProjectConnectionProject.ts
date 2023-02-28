import { Field, ObjectType } from "type-graphql";

@ObjectType()
class SalesforceAccProjectConnectionObject {
  @Field(() => [String])
  pdfTypes!: string[];

  @Field(() => [String])
  textTypes!: string[];

  @Field(() => [String])
  presentationTypes!: string[];

  @Field(() => [String])
  spreadsheetTypes!: string[];

  @Field(() => [String])
  imageTypes!: string[];
}

export { SalesforceAccProjectConnectionObject };
