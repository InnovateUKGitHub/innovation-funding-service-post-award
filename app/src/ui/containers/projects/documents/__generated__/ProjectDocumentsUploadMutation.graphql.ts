/**
 * @generated SignedSource<<30aa185ded83f5832c296ee9a52b5098>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SalesforceAccProjectConnectionDocumentTypeEnum = "AgreementToPCR" | "AnnexThree" | "BankStatement" | "ClaimValidationForm" | "CollaborationAgreement" | "DeMinimisDeclartionForm" | "Email" | "EndOfProjectSurvey" | "Evidence" | "IAR" | "Invoice" | "JeSForm" | "LMCMinutes" | "Loan" | "MeetingAgenda" | "OverheadCalculationSpreadsheet" | "Plans" | "Presentation" | "ProjectCompletionForm" | "ProofOfSatisfiedConditions" | "ReviewMeeting" | "RiskRegister" | "ScheduleThree" | "StatementOfExpenditure" | "%future added value";
export type ProjectDocumentsUploadMutation$variables = {
  documentType: SalesforceAccProjectConnectionDocumentTypeEnum;
  files: ReadonlyArray<any>;
  partnerId?: string | null;
  projectId: string;
};
export type ProjectDocumentsUploadMutation$data = {
  readonly mspDocumentShareUpload: string;
};
export type ProjectDocumentsUploadMutation = {
  response: ProjectDocumentsUploadMutation$data;
  variables: ProjectDocumentsUploadMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "documentType"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "files"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "partnerId"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectId"
},
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "files",
        "variableName": "files"
      },
      {
        "kind": "Variable",
        "name": "partnerId",
        "variableName": "partnerId"
      },
      {
        "kind": "Variable",
        "name": "projectId",
        "variableName": "projectId"
      },
      {
        "kind": "Variable",
        "name": "type",
        "variableName": "documentType"
      }
    ],
    "kind": "ScalarField",
    "name": "mspDocumentShareUpload",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ProjectDocumentsUploadMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ProjectDocumentsUploadMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "b583c5d51c365b535af205abcf341850",
    "id": null,
    "metadata": {},
    "name": "ProjectDocumentsUploadMutation",
    "operationKind": "mutation",
    "text": "mutation ProjectDocumentsUploadMutation(\n  $files: [File!]!\n  $projectId: ID!\n  $partnerId: ID\n  $documentType: SalesforceAccProjectConnectionDocumentTypeEnum!\n) {\n  mspDocumentShareUpload(files: $files, projectId: $projectId, partnerId: $partnerId, type: $documentType)\n}\n"
  }
};
})();

(node as any).hash = "e4ee35982af8c09065499995fe01aa5b";

export default node;
