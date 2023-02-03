/**
 * @generated SignedSource<<e16c25a75e0ebcb815ebd1cc5335384c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type LogLevel = "DEBUG" | "ERROR" | "INFO" | "TRACE" | "VERBOSE" | "WARN" | "%future added value";
export type clientConfigQuery$variables = {};
export type clientConfigQuery$data = {
  readonly clientConfig: {
    readonly features: {
      readonly changePeriodLengthWorkflow: boolean;
      readonly customContent: boolean;
      readonly futureTimeExtensionInYears: number;
      readonly searchDocsMinThreshold: number;
    };
    readonly ifsRoot: string;
    readonly logLevel: LogLevel;
    readonly options: {
      readonly bankCheckAddressScorePass: number;
      readonly bankCheckCompanyNameScorePass: number;
      readonly bankCheckValidationRetries: number;
      readonly maxClaimLineItems: number;
      readonly maxFileSize: number;
      readonly maxUploadFileCount: number;
      readonly nonJsMaxClaimLineItems: number;
      readonly numberOfProjectsToSearch: number;
      readonly permittedFileTypes: ReadonlyArray<string>;
      readonly permittedTypes: {
        readonly imageTypes: ReadonlyArray<string>;
        readonly pdfTypes: ReadonlyArray<string>;
        readonly presentationTypes: ReadonlyArray<string>;
        readonly spreadsheetTypes: ReadonlyArray<string>;
        readonly textTypes: ReadonlyArray<string>;
      };
      readonly standardOverheadRate: number;
    };
    readonly ssoEnabled: boolean;
  };
};
export type clientConfigQuery = {
  response: clientConfigQuery$data;
  variables: clientConfigQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "ClientConfigObject",
    "kind": "LinkedField",
    "name": "clientConfig",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "ClientConfigFeaturesObject",
        "kind": "LinkedField",
        "name": "features",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "changePeriodLengthWorkflow",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "customContent",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "searchDocsMinThreshold",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "futureTimeExtensionInYears",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "ClientConfigAppOptionsObject",
        "kind": "LinkedField",
        "name": "options",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "maxFileSize",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "maxUploadFileCount",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "permittedFileTypes",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ClientConfigAppOptionsPermittedFileTypesObject",
            "kind": "LinkedField",
            "name": "permittedTypes",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "pdfTypes",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "textTypes",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "presentationTypes",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "spreadsheetTypes",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "imageTypes",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "bankCheckValidationRetries",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "bankCheckAddressScorePass",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "bankCheckCompanyNameScorePass",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "standardOverheadRate",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "numberOfProjectsToSearch",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "maxClaimLineItems",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "nonJsMaxClaimLineItems",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "ifsRoot",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "ssoEnabled",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "logLevel",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "clientConfigQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "clientConfigQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "b35a503fdc9608fd5424ed5e28306d24",
    "id": null,
    "metadata": {},
    "name": "clientConfigQuery",
    "operationKind": "query",
    "text": "query clientConfigQuery {\n  clientConfig {\n    features {\n      changePeriodLengthWorkflow\n      customContent\n      searchDocsMinThreshold\n      futureTimeExtensionInYears\n    }\n    options {\n      maxFileSize\n      maxUploadFileCount\n      permittedFileTypes\n      permittedTypes {\n        pdfTypes\n        textTypes\n        presentationTypes\n        spreadsheetTypes\n        imageTypes\n      }\n      bankCheckValidationRetries\n      bankCheckAddressScorePass\n      bankCheckCompanyNameScorePass\n      standardOverheadRate\n      numberOfProjectsToSearch\n      maxClaimLineItems\n      nonJsMaxClaimLineItems\n    }\n    ifsRoot\n    ssoEnabled\n    logLevel\n  }\n}\n"
  }
};
})();

(node as any).hash = "764f2f698443b96a8976c3ad3fce44ae";

export default node;
