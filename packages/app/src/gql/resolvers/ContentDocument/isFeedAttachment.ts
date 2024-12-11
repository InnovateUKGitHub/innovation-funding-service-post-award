import { GraphQLContext } from "@gql/GraphQLContext";
import type { IFieldResolverOptions } from "@graphql-tools/utils";
import { DataloaderNotFoundError } from "@server/repositories/errors";

const isFeedAttachmentResolver: IFieldResolverOptions = {
  selectionSet: `{ Id ContentDocument { Id LatestPublishedVersionId { value }} }`,
  async resolve(input, args, ctx: GraphQLContext) {
    const [contentDocumentLinkData, contentDocumentData] = await ctx.feedAttachmentDataLoader.loadMany([
      input.ContentDocument.LatestPublishedVersionId.value,
      input.ContentDocument.Id,
    ]);

    return !(
      contentDocumentLinkData instanceof DataloaderNotFoundError &&
      contentDocumentData instanceof DataloaderNotFoundError
    );
  },
};

export { isFeedAttachmentResolver };
