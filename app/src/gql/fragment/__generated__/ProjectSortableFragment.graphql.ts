/**
 * @generated SignedSource<<bcd6d429299c58379991e2a8ad1dff27>>
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
    readonly value: any | null;
  } | null;
  readonly Acc_PCRsForReview__c: {
    readonly value: any | null;
  } | null;
  readonly Acc_PCRsUnderQuery__c: {
    readonly value: any | null;
  } | null;
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
