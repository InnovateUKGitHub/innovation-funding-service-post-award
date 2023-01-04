import { DateTime } from "luxon";

import { ProjectSortableFragment$data } from "@gql/fragment/__generated__/ProjectSortableFragment.graphql";

export type IComparer<T> = (x: T, y: T) => number;

export const numberComparator: IComparer<number> = (a, b) => a - b;

export const nullableNumberComparator: IComparer<number | null> = (a, b) => {
  if (typeof a === "number" && typeof b === "number") return numberComparator(a, b);
  if (typeof a === "number") return 1;
  if (typeof b === "number") return -1;

  return 0;
};

export const dateComparator: IComparer<Date> = (a, b) => numberComparator(a.getTime(), b.getTime());

export const stringComparator: IComparer<string | null> = (a, b) => {
  if (a && b) return a.localeCompare(b);
  if (a) return -1;
  if (b) return 1;

  return 0;
};

export const dayComparator: IComparer<Date> = (a, b) => {
  return DateTime.fromJSDate(a).startOf("day").toMillis() - DateTime.fromJSDate(b).startOf("day").toMillis();
};

/**
 * Compares the sortable position of two projects, from most important to least important.
 *
 * @param a The first project
 * @param b The second project
 * @returns A number to be consumed by the `Array.prototype.sort` function
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description
 * @example projects.open.sort(projectPriorityComparator)
 */
export const projectPriorityComparator: IComparer<ProjectSortableFragment$data> = (a, b) => {
  const claimsForReviewComparison = nullableNumberComparator(
    b.Acc_ClaimsForReview__c?.value,
    a.Acc_ClaimsForReview__c?.value,
  );
  const pcrsForReviewComparison = nullableNumberComparator(
    b.Acc_PCRsForReview__c?.value,
    a.Acc_PCRsForReview__c?.value,
  );
  const pcrsUnderQueryComparison = nullableNumberComparator(
    b.Acc_PCRsUnderQuery__c?.value,
    a.Acc_PCRsUnderQuery__c?.value,
  );

  return claimsForReviewComparison || pcrsForReviewComparison || pcrsUnderQueryComparison;
};
