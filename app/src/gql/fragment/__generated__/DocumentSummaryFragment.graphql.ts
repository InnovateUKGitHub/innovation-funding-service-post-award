/**
 * @generated SignedSource<<fdf28cf40ab68cfeccfb6cbe8b59faca>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DocumentSummaryFragment$data = {
  readonly edges: ReadonlyArray<{
    readonly node: {
      readonly ContentDocument: {
        readonly ContentSize: {
          readonly value: number | null;
        } | null;
        readonly CreatedBy: {
          readonly Name: {
            readonly value: string | null;
          } | null;
          readonly Username: {
            readonly value: string | null;
          } | null;
        } | null;
        readonly CreatedDate: {
          readonly value: string | null;
        } | null;
        readonly Description: {
          readonly value: any | null;
        } | null;
        readonly FileExtension: {
          readonly value: string | null;
        } | null;
        readonly FileType: {
          readonly value: string | null;
        } | null;
        readonly Id: string;
        readonly LastModifiedDate: {
          readonly value: string | null;
        } | null;
        readonly LatestPublishedVersionId: {
          readonly value: string | null;
        } | null;
        readonly Title: {
          readonly value: string | null;
        } | null;
      } | null;
      readonly Id: string;
      readonly isFeedAttachment: boolean;
    } | null;
  } | null> | null;
  readonly " $fragmentType": "DocumentSummaryFragment";
};
export type DocumentSummaryFragment$key = {
  readonly " $data"?: DocumentSummaryFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DocumentSummaryFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v1 = [
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
  "name": "DocumentSummaryFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "ContentDocumentLinkEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ContentDocumentLink",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isFeedAttachment",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "ContentDocument",
              "kind": "LinkedField",
              "name": "ContentDocument",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "IDValue",
                  "kind": "LinkedField",
                  "name": "LatestPublishedVersionId",
                  "plural": false,
                  "selections": (v1/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "LongTextAreaValue",
                  "kind": "LinkedField",
                  "name": "Description",
                  "plural": false,
                  "selections": (v1/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "IntValue",
                  "kind": "LinkedField",
                  "name": "ContentSize",
                  "plural": false,
                  "selections": (v1/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "DateTimeValue",
                  "kind": "LinkedField",
                  "name": "CreatedDate",
                  "plural": false,
                  "selections": (v1/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "StringValue",
                  "kind": "LinkedField",
                  "name": "FileType",
                  "plural": false,
                  "selections": (v1/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "StringValue",
                  "kind": "LinkedField",
                  "name": "FileExtension",
                  "plural": false,
                  "selections": (v1/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "StringValue",
                  "kind": "LinkedField",
                  "name": "Title",
                  "plural": false,
                  "selections": (v1/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "DateTimeValue",
                  "kind": "LinkedField",
                  "name": "LastModifiedDate",
                  "plural": false,
                  "selections": (v1/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "User",
                  "kind": "LinkedField",
                  "name": "CreatedBy",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "StringValue",
                      "kind": "LinkedField",
                      "name": "Username",
                      "plural": false,
                      "selections": (v1/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "StringValue",
                      "kind": "LinkedField",
                      "name": "Name",
                      "plural": false,
                      "selections": (v1/*: any*/),
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
  ],
  "type": "ContentDocumentLinkConnection",
  "abstractKey": null
};
})();

(node as any).hash = "36859f4cca95257e9dd2e1640c750c11";

export default node;
