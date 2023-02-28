import { GraphQLScalarType } from "graphql";

export const GraphQLFileScalar = new GraphQLScalarType({
  name: "File",
  description: "A blob created by GraphQL Yoga. Hurrah.",
})
