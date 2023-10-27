/**
 * @generated SignedSource<<ffeaeaae3c03234a76fe75df302932a9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { InlineFragment, ReaderInlineDataFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectSortableFragment$data = {
  readonly Acc_ClaimsForReview__c: {
    readonly value: number | null | undefined;
  } | null | undefined;
  readonly Acc_PCRsForReview__c: {
    readonly value: number | null | undefined;
  } | null | undefined;
  readonly Acc_PCRsUnderQuery__c: {
    readonly value: number | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "ProjectSortableFragment";
};
export type ProjectSortableFragment$key = {
  readonly " $data"?: ProjectSortableFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProjectSortableFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "ProjectSortableFragment"
};

(node as any).hash = "23015fe79e53623bb809f603be80ce7f";

export default node;
