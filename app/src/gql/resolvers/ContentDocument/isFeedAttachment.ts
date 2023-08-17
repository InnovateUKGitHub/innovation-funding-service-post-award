import { GraphQLContext } from "@gql/GraphQLContext";
import type { IFieldResolverOptions } from "@graphql-tools/utils";

const isFeedAttachmentResolver: IFieldResolverOptions = {
  selectionSet: `{ Id ContentDocument { Id LatestPublishedVersionId { value }} }`,
  async resolve(input, args, ctx: GraphQLContext) {
    const [contentDocumentLinkData, contentDocumentData] = await Promise.all([
      ctx.feedAttachmentDataLoader.load(input.ContentDocument.LatestPublishedVersionId.value),
      ctx.feedAttachmentDataLoader.load(input.ContentDocument.Id),
    ]);
    return !!contentDocumentLinkData || !!contentDocumentData;
  },
};

export { isFeedAttachmentResolver };
