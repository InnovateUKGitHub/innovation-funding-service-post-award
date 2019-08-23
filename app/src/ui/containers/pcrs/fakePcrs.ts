import { range } from "@shared/range";
import { PCRItemStatus, PCRItemType, PCRStatus } from "@framework/entities";
import { DateTime } from "luxon";

export interface PCRBaseDto {
  id: string;
  requestNumber: number;
  started: Date;
  lastUpdated: Date;
  status: PCRStatus;
  statusName: string;
}

export interface PCRSummaryDto extends PCRBaseDto {
  items: {
    type: PCRItemType;
    typeName: string;
  }[];
}

export interface PCRDto extends PCRBaseDto {
  items: PCRItemDto[];
  comments: string;
  reasoningStatus: PCRItemStatus;
  reasoningStatusName: string;
  reasoningComments: string;
}

export interface PCRItemDto {
  id: string;
  type: PCRItemType;
  typeName: string;
  status: PCRItemStatus;
  statusName: string;
}

const fakeItemTypes = ["Scope", "Duration", "Cost", "Partner"];
const fakePcrStatus = ["Approved", "Draft", "Submitted to MO", "Queried", "Submitted to IUK"];

export const fakePcrs = range(10).map<PCRSummaryDto>((x, i) => ({
  id: `Pcr-${x}`,
  requestNumber: x,
  items: range((x % fakeItemTypes.length) + 1).map(y => ({ typeName: fakeItemTypes[y % (fakeItemTypes.length - 1)], type: PCRItemType.Unknown })),
  started: DateTime.local().minus({ months: 1 }).plus({ days: x }).toJSDate(),
  lastUpdated: DateTime.local().minus({ months: 1 }).plus({ days: x + 15 }).toJSDate(),
  statusName: fakePcrStatus[i % 5],
  status: PCRStatus.Unknown,
})).reverse();

export const fakePcr: PCRDto = {
  comments: "Some comments for the MO.",
  id: "PCR-ID",
  lastUpdated: new Date(),
  reasoningStatus: PCRItemStatus.Unknown,
  reasoningStatusName: "To do",
  reasoningComments: "Some reasoning for the change.",
  requestNumber: 1,
  started: new Date(),
  status: PCRStatus.Unknown,
  statusName: "PCR Status",
  items: fakeItemTypes.map((x, i) => ({
    id: `PCR-Item-${i + 1}`,
    status: PCRItemStatus.Unknown,
    statusName: "To do",
    type: PCRItemType.Unknown,
    typeName: x,
  }))
};

export const fakeDocuments: DocumentSummaryDto[] = range(3).map<DocumentSummaryDto>(x => ({
  id: `Doc${x}`,
  fileName: `doc${x}.txt`,
  fileSize: 0,
  link: "#",
  dateCreated: new  Date(),
}));
