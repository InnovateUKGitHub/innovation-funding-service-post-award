import { DocumentDescription } from "@framework/constants";
import { SalesforceBaseMapper } from "@server/repositories/mappers/saleforceMapperBase";
import { ISalesforceDocument } from "@server/repositories";
import { DocumentEntity } from "@framework/entities/document";

export class SalesforceDocumentMapper extends SalesforceBaseMapper<ISalesforceDocument, DocumentEntity> {
  public map(x: ISalesforceDocument): DocumentEntity {
    return {
      id: x.Id,
      title: x.Title,
      fileExtension: x.FileExtension,
      contentDocumentId: x.ContentDocumentId,
      contentSize: x.ContentSize,
      fileType: x.FileType,
      reasonForChange: x.ReasonForChange,
      pathOnClient: x.PathOnClient,
      contentLocation: x.ContentLocation,
      versionData: x.VersionData,
      description: new DocumentDescriptionMapper().mapFromSalesforceDocumentDescription(x.Description),
      createdDate: this.clock.parseRequiredSalesforceDateTime(x.CreatedDate),
      lastModifiedBy: x.Acc_LastModifiedByAlias__c,
    };
  }
}

export class DocumentDescriptionMapper {
  private types = {
    IAR: "IAR",
    Evidence: "Evidence",
    ClaimValidationForm: "ClaimValidationForm",
    DeMinimusDeclartionForm: "DeMinimusDeclartionForm"
  };

  public mapFromSalesforceDocumentDescription = ((documentType: string | null | undefined): DocumentDescription | null => {
    switch (documentType) {
      case this.types.IAR: return DocumentDescription.IAR;
      case this.types.Evidence: return DocumentDescription.Evidence;
      case this.types.ClaimValidationForm: return DocumentDescription.ClaimValidationForm;
      case this.types.DeMinimusDeclartionForm: return DocumentDescription.DeMinimusDeclarationForm;
      default: return null;
    }
  });

  public mapToSalesforceDocumentDescription = ((documentType: DocumentDescription | undefined) => {
    switch (documentType) {
      case DocumentDescription.IAR: return this.types.IAR;
      case DocumentDescription.Evidence: return this.types.Evidence;
      case DocumentDescription.ClaimValidationForm: return this.types.ClaimValidationForm;
      case DocumentDescription.DeMinimusDeclarationForm: return this.types.DeMinimusDeclartionForm;
      default: return null;
    }
  });
}
