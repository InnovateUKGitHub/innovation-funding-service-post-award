/**
 * @generated SignedSource<<9ae5b86ad8a1583d77b464261b4df7a0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type Acc_ProjectChangeRequest__cCreateInput = {
  Acc_ProjectChangeRequest__c: Acc_ProjectChangeRequest__cCreateRepresentation;
};
export type Acc_ProjectChangeRequest__cCreateRepresentation = {
  Acc_Account__c?: any | null | undefined;
  Acc_AdditionalNumberofMonths__c?: number | null | undefined;
  Acc_ApprovalStatus__c?: string | null | undefined;
  Acc_Approval_Setting_Name__c?: string | null | undefined;
  Acc_Approved__c?: boolean | null | undefined;
  Acc_AwardRate__c?: number | null | undefined;
  Acc_Comments__c?: any | null | undefined;
  Acc_CommercialWork__c?: boolean | null | undefined;
  Acc_Contact1EmailAddress__c?: string | null | undefined;
  Acc_Contact1Forename__c?: string | null | undefined;
  Acc_Contact1Phone__c?: string | null | undefined;
  Acc_Contact1ProjectRole__c?: string | null | undefined;
  Acc_Contact1Surname__c?: string | null | undefined;
  Acc_Contact1__c?: any | null | undefined;
  Acc_Contact2EmailAddress__c?: string | null | undefined;
  Acc_Contact2Forename__c?: string | null | undefined;
  Acc_Contact2Phone__c?: string | null | undefined;
  Acc_Contact2ProjectRole__c?: string | null | undefined;
  Acc_Contact2Surname__c?: string | null | undefined;
  Acc_Contact2__c?: any | null | undefined;
  Acc_EligibleForStateAid__c?: boolean | null | undefined;
  Acc_Employees__c?: number | null | undefined;
  Acc_ExistingEndDate__c?: string | null | undefined;
  Acc_ExistingPartnerName__c?: string | null | undefined;
  Acc_ExistingProjectDuration__c?: number | null | undefined;
  Acc_ExternalReviewCompletedDate__c?: string | null | undefined;
  Acc_ExternalReviewRequestedDate__c?: string | null | undefined;
  Acc_ExternalReviewStatus__c?: string | null | undefined;
  Acc_FastTrack__c?: boolean | null | undefined;
  Acc_GrantMovingOverFinancialYear__c?: number | null | undefined;
  Acc_Guidance__c?: any | null | undefined;
  Acc_LastUpdated__c?: string | null | undefined;
  Acc_Location__c?: string | null | undefined;
  Acc_MarkedasComplete__c?: string | null | undefined;
  Acc_NewOrganisationName__c?: any | null | undefined;
  Acc_NewPeriodLength__c?: string | null | undefined;
  Acc_NewProjectDuration__c?: number | null | undefined;
  Acc_NewProjectEndDate__c?: string | null | undefined;
  Acc_NewProjectSummary__c?: any | null | undefined;
  Acc_NewPublicDescription__c?: any | null | undefined;
  Acc_Nickname__c?: string | null | undefined;
  Acc_OrganisationName__c?: string | null | undefined;
  Acc_OtherFunding__c?: boolean | null | undefined;
  Acc_ParticipantSize__c?: string | null | undefined;
  Acc_ParticipantType__c?: string | null | undefined;
  Acc_PriorStatusValue__c?: string | null | undefined;
  Acc_Profile__c?: any | null | undefined;
  Acc_ProjectCity__c?: string | null | undefined;
  Acc_ProjectContactLink__c?: any | null | undefined;
  Acc_ProjectPostcode__c?: string | null | undefined;
  Acc_ProjectRole__c?: string | null | undefined;
  Acc_ProjectSummarySnapshot__c?: any | null | undefined;
  Acc_Project_Participant__c?: any | null | undefined;
  Acc_Project__c?: any | null | undefined;
  Acc_PublicDescriptionSnapshot__c?: any | null | undefined;
  Acc_ReasonForWithdrawal__c?: string | null | undefined;
  Acc_ReasonforTermination__c?: string | null | undefined;
  Acc_Reasoning__c?: any | null | undefined;
  Acc_RegisteredAddress__c?: any | null | undefined;
  Acc_RegistrationNumber__c?: string | null | undefined;
  Acc_Rejected__c?: boolean | null | undefined;
  Acc_RemovalDate__c?: string | null | undefined;
  Acc_RemovalPeriod__c?: number | null | undefined;
  Acc_RequestHeader__c?: any | null | undefined;
  Acc_RequestNumber__c?: number | null | undefined;
  Acc_RequestedEndDate__c?: string | null | undefined;
  Acc_RequestedEndPeriod__c?: number | null | undefined;
  Acc_Status__c?: string | null | undefined;
  Acc_Subsidiary__c?: boolean | null | undefined;
  Acc_SuspensionEnds__c?: string | null | undefined;
  Acc_SuspensionStarts__c?: string | null | undefined;
  Acc_TSBReference__c?: string | null | undefined;
  Acc_TerminationDate__c?: string | null | undefined;
  Acc_TotalOtherFunding__c?: number | null | undefined;
  Acc_TurnoverYearEnd__c?: string | null | undefined;
  Acc_Turnover__c?: number | null | undefined;
  Acc_TypeofWithdrawal__c?: string | null | undefined;
  Acc_TypesofPCRRequests__c?: any | null | undefined;
  Allow_Flow_To_Override_Status_Changes__c?: boolean | null | undefined;
  Company_registration_number__c?: string | null | undefined;
  Cost_of_work__c?: number | null | undefined;
  Country_where_work_will_be_carried_out__c?: string | null | undefined;
  Days_in_previous_statuses__c?: number | null | undefined;
  Justification__c?: any | null | undefined;
  Loan_ExtensionPeriodChange__c?: number | null | undefined;
  Loan_RepaymentPeriodChange__c?: number | null | undefined;
  New_company_subcontractor_name__c?: string | null | undefined;
  Override_Grant_Control__c?: boolean | null | undefined;
  Override_Justification__c?: string | null | undefined;
  OwnerId?: any | null | undefined;
  RecordTypeId?: any | null | undefined;
  Relationship_between_partners__c?: boolean | null | undefined;
  Relationship_justification__c?: any | null | undefined;
  Role_in_the_project__c?: string | null | undefined;
  Status_change_date__c?: string | null | undefined;
};
export type PcrModifyOptionsCreateMutation$variables = {
  input: Acc_ProjectChangeRequest__cCreateInput;
  projectId: string;
};
export type PcrModifyOptionsCreateMutation$data = {
  readonly uiapi: {
    readonly Acc_ProjectChangeRequest__cCreate: {
      readonly Record: {
        readonly Id: string;
        readonly Name: {
          readonly value: string | null | undefined;
        } | null | undefined;
      } | null | undefined;
    } | null | undefined;
  };
};
export type PcrModifyOptionsCreateMutation = {
  response: PcrModifyOptionsCreateMutation$data;
  variables: PcrModifyOptionsCreateMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "projectId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "projectId",
        "variableName": "projectId"
      }
    ],
    "concreteType": "UIAPIMutations",
    "kind": "LinkedField",
    "name": "uiapi",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input"
          }
        ],
        "concreteType": "Acc_ProjectChangeRequest__cCreatePayload",
        "kind": "LinkedField",
        "name": "Acc_ProjectChangeRequest__cCreate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Acc_ProjectChangeRequest__c",
            "kind": "LinkedField",
            "name": "Record",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "Id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "StringValue",
                "kind": "LinkedField",
                "name": "Name",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "value",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PcrModifyOptionsCreateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PcrModifyOptionsCreateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "98cf1947e1aea507b9ae1f9a661fa756",
    "id": null,
    "metadata": {},
    "name": "PcrModifyOptionsCreateMutation",
    "operationKind": "mutation",
    "text": "mutation PcrModifyOptionsCreateMutation(\n  $input: Acc_ProjectChangeRequest__cCreateInput!\n  $projectId: String!\n) {\n  uiapi(projectId: $projectId) {\n    Acc_ProjectChangeRequest__cCreate(input: $input) {\n      Record {\n        Id\n        Name {\n          value\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "042f6b105b7a3b95b942f163db9a732f";

export default node;
