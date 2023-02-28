import { GraphQLContext } from "@gql/GraphQLContext";
import { ServerFileWrapper } from "@server/apis/controllerBase";
import { DocumentDescriptionMapper } from "@server/repositories/mappers/documentMapper";
import { Arg, Ctx, ID, Mutation, Resolver } from "type-graphql";
import { SalesforceAccProjectConnectionDocumentTypeEnum } from "../enum/SalesforceAccProjectConnectionDocumentTypeEnum";
import { GraphQLFileScalar } from "../scalar/GraphQLFileScalar";
import { File } from "@whatwg-node/fetch"

@Resolver()
class SalesforceAccProjectConnectionResolver {
  @Mutation(() => String)
  async mspDocumentShareUpload(
    @Arg("files", () => [GraphQLFileScalar]) files: File[],
    @Arg("type", () => SalesforceAccProjectConnectionDocumentTypeEnum)
    type: SalesforceAccProjectConnectionDocumentTypeEnum,
    @Arg("projectId", () => ID) projectId: string,
    @Arg("partnerId", () => ID, { nullable: true }) partnerId: string | null,
    @Ctx() context: GraphQLContext,
  ): Promise<string> {
    const recordId = projectId;
    const newType = new DocumentDescriptionMapper().mapFromSalesforceDocumentDescription(type) ?? undefined;

    await Promise.all(
      files.map(async (file) => {
        const stream = Buffer.from(await file.arrayBuffer()).toString("base64");
    
        return await context.legacyContext.repositories.documents.insertDocument(
          {
            fileName: file.name,
            size: 1,
            read: () => stream
          } as ServerFileWrapper,
          recordId,
          newType,
        );
      })
    )

    return "ok";
  }
}

export { SalesforceAccProjectConnectionResolver };
