import { DateTime } from "luxon";

import { ProjectDto } from "@framework/dtos";

export type IComparer<T> = (x: T, y: T) => number;

export const numberComparator: IComparer<number> = (a, b) => a - b;

export const dateComparator: IComparer<Date> = (a, b) => numberComparator(a.getTime(), b.getTime());

export const stringComparator: IComparer<string> = (a, b) => {
  if (a && b) return a.localeCompare(b);
  if (a) return -1;
  if (b) return 1;

  return 0;
};

export const dayComparator: IComparer<Date> = (a, b) => {
  return DateTime.fromJSDate(a).startOf("day").toMillis() - DateTime.fromJSDate(b).startOf("day").toMillis();
};

export const projectPriorityComparator: IComparer<ProjectDto> = (a, b) => {
  const noClaimsAvailable = a.claimsToReview === 0 && b.claimsToReview === 0;
  const noPcrReviewsAvailable = a.pcrsToReview === 0 && b.pcrsToReview === 0;
  const noPcrQueriesAvailable = a.pcrsQueried === 0 && b.pcrsQueried === 0;

  // Note: These have no priority push to bottom
  if (noClaimsAvailable && noPcrReviewsAvailable && noPcrQueriesAvailable) return Number.MAX_SAFE_INTEGER;

  return b.claimsToReview - a.claimsToReview || b.pcrsToReview - a.pcrsToReview || b.pcrsQueried - a.pcrsQueried;
};
