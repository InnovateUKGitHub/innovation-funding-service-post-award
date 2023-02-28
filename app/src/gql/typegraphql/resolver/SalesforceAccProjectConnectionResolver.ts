import { GraphQLContext } from "@gql/GraphQLContext";
import { ServerFileWrapper } from "@server/apis/controllerBase";
import { DocumentDescriptionMapper } from "@server/repositories/mappers/documentMapper";
import Upload from "graphql-upload/Upload";
import { Arg, Ctx, ID, Mutation, Resolver } from "type-graphql";
import { SalesforceAccProjectConnectionDocumentTypeEnum } from "../enum/SalesforceAccProjectConnectionDocumentTypeEnum";

@Resolver()
class SalesforceAccProjectConnectionResolver {
  @Mutation(() => String)
  async mspDocumentShareUpload(
    @Arg("file", () => File) file: File,
    @Arg("type", () => SalesforceAccProjectConnectionDocumentTypeEnum)
    type: SalesforceAccProjectConnectionDocumentTypeEnum,
    @Arg("projectId", () => ID) projectId: string,
    @Arg("partnerId", () => ID, { nullable: true }) partnerId: string | null,
    @Ctx() context: GraphQLContext,
  ): Promise<string> {
    const recordId = projectId;
    const newType = new DocumentDescriptionMapper().mapFromSalesforceDocumentDescription(type) ?? undefined;
    const stream = Buffer.from(await file.arrayBuffer()).toString("base64");

    return await context.legacyContext.repositories.documents.insertDocument(
      {
        fileName: file.name,
        size: 1,
        read: () => stream,
      } as ServerFileWrapper,
      recordId,
      newType,
    );
  }
}

export { SalesforceAccProjectConnectionResolver };
