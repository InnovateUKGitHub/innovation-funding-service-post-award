import { GraphQLContext } from "@gql/GraphQLContext";
import type { IFieldResolverOptions } from "@graphql-tools/utils";
import { getRecord } from "@server/dataloader/dataloader.logic";

const isFeedAttachmentResolver: IFieldResolverOptions = {
  selectionSet: `{ Id ContentDocument { Id LatestPublishedVersionId { value }} }`,
  async resolve(input, args, ctx: GraphQLContext) {
    const [contentDocumentLinkData, contentDocumentData] = await ctx.feedAttachmentDataLoader.loadMany([
      input.ContentDocument.LatestPublishedVersionId.value,
      input.ContentDocument.Id,
    ]);

    // If any of the loaders returns some data,
    // we have Salesforce Chatter documents!
    return (
      (getRecord(contentDocumentLinkData) && contentDocumentLinkData.length) ||
      (getRecord(contentDocumentData) && contentDocumentData.length)
    );
  },
};

export { isFeedAttachmentResolver };
