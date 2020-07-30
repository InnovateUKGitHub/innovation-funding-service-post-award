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
  // These are what the documents get saved as in Salesforce so these names must not change
  private readonly types = {
    IAR: "IAR",
    Evidence: "Evidence",
    ClaimValidationForm: "ClaimValidationForm",
    DeMinimisDeclartionForm: "DeMinimisDeclartionForm",
    StatementOfExpenditure: "StatementOfExpenditure",
    EndOfProjectSurvey: "EndOfProjectSurvey",
    JeSForm: "JeSForm",
    OverheadCalculationSpreadsheet: "OverheadCalculationSpreadsheet",
    BankStatement: "BankStatement",
  };

  public mapFromSalesforceDocumentDescription = ((documentType: string | null | undefined): DocumentDescription | null => {
    switch (documentType) {
      case this.types.IAR: return DocumentDescription.IAR;
      case this.types.Evidence: return DocumentDescription.Evidence;
      case this.types.ClaimValidationForm: return DocumentDescription.ClaimValidationForm;
      case this.types.DeMinimisDeclartionForm: return DocumentDescription.DeMinimisDeclarationForm;
      case this.types.StatementOfExpenditure: return DocumentDescription.StatementOfExpenditure;
      case this.types.EndOfProjectSurvey: return DocumentDescription.EndOfProjectSurvey;
      case this.types.JeSForm: return DocumentDescription.JeSForm;
      case this.types.OverheadCalculationSpreadsheet: return DocumentDescription.OverheadCalculationSpreadsheet;
      case this.types.BankStatement: return DocumentDescription.BankStatement;
      default: return null;
    }
  });

  public mapToSalesforceDocumentDescription = ((documentType: DocumentDescription | undefined) => {
    switch (documentType) {
      case DocumentDescription.IAR: return this.types.IAR;
      case DocumentDescription.Evidence: return this.types.Evidence;
      case DocumentDescription.ClaimValidationForm: return this.types.ClaimValidationForm;
      case DocumentDescription.DeMinimisDeclarationForm: return this.types.DeMinimisDeclartionForm;
      case DocumentDescription.EndOfProjectSurvey: return this.types.EndOfProjectSurvey;
      case DocumentDescription.StatementOfExpenditure: return this.types.StatementOfExpenditure;
      case DocumentDescription.JeSForm: return this.types.JeSForm;
      case DocumentDescription.OverheadCalculationSpreadsheet: return this.types.OverheadCalculationSpreadsheet;
      case DocumentDescription.BankStatement: return this.types.BankStatement;
      default: return null;
    }
  });
}
