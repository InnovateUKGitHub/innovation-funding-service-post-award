/**
 * @generated SignedSource<<b4b8bdd71501d8b8c1762ae475313691>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectDetailProjectInformationTableFragment$data = {
  readonly Acc_CompetitionId__r: {
    readonly Name: {
      readonly value: string | null;
    } | null;
  } | null;
  readonly Acc_CompetitionType__c: {
    readonly value: string | null;
  } | null;
  readonly Acc_Duration__c: {
    readonly value: any | null;
  } | null;
  readonly Acc_EndDate__c: {
    readonly value: string | null;
  } | null;
  readonly Acc_NumberofPeriods__c: {
    readonly value: any | null;
  } | null;
  readonly Acc_ProjectSummary__c: {
    readonly value: any | null;
  } | null;
  readonly Acc_StartDate__c: {
    readonly value: string | null;
  } | null;
  readonly Loan_LoanAvailabilityPeriodLength__c: {
    readonly value: any | null;
  } | null;
  readonly Loan_LoanEndDate__c: {
    readonly value: string | null;
  } | null;
  readonly Loan_LoanExtensionPeriodLength__c: {
    readonly value: any | null;
  } | null;
  readonly Loan_LoanRepaymentPeriodLength__c: {
    readonly value: any | null;
  } | null;
  readonly " $fragmentType": "ProjectDetailProjectInformationTableFragment";
};
export type ProjectDetailProjectInformationTableFragment$key = {
  readonly " $data"?: ProjectDetailProjectInformationTableFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProjectDetailProjectInformationTableFragment">;
};

const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProjectDetailProjectInformationTableFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Competition__c",
      "kind": "LinkedField",
      "name": "Acc_CompetitionId__r",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "StringValue",
          "kind": "LinkedField",
          "name": "Name",
          "plural": false,
          "selections": (v0/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "StringValue",
      "kind": "LinkedField",
      "name": "Acc_CompetitionType__c",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "DateValue",
      "kind": "LinkedField",
      "name": "Acc_StartDate__c",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "DateValue",
      "kind": "LinkedField",
      "name": "Acc_EndDate__c",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "DateValue",
      "kind": "LinkedField",
      "name": "Loan_LoanEndDate__c",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "DoubleValue",
      "kind": "LinkedField",
      "name": "Loan_LoanAvailabilityPeriodLength__c",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "DoubleValue",
      "kind": "LinkedField",
      "name": "Loan_LoanExtensionPeriodLength__c",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "DoubleValue",
      "kind": "LinkedField",
      "name": "Loan_LoanRepaymentPeriodLength__c",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "DoubleValue",
      "kind": "LinkedField",
      "name": "Acc_Duration__c",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "DoubleValue",
      "kind": "LinkedField",
      "name": "Acc_NumberofPeriods__c",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "LongTextAreaValue",
      "kind": "LinkedField",
      "name": "Acc_ProjectSummary__c",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    }
  ],
  "type": "Acc_Project__c",
  "abstractKey": null
};
})();

(node as any).hash = "82996d39f671dc41141a99ba5197f1d9";

export default node;
