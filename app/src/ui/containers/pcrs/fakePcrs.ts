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

export interface PCRItemTypeDto {
  id: PCRItemType;
  name: string;
  order: number;
}

export const fakeItemTypes = [
  { id: PCRItemType.SinglePartnerFinancialVirement, name: "Financial Virement", order: 1 },
  { id: PCRItemType.PartnerAddition, name: "Partner Addition", order: 2 },
  { id: PCRItemType.PartnerWithdrawal, name: "Partner Withdrawal", order: 3 },
  { id: PCRItemType.TimeExtension, name: "Time Extension", order: 4 },
  { id: PCRItemType.ProjectSuspension, name: "Project Suspension", order: 5 },
  { id: PCRItemType.ScopeChange, name: "Scope Change", order: 6 },
  { id: PCRItemType.ProjectTermination, name: "Project Termination", order: 7 },
];

const fakePcrStatus = ["Approved", "Draft", "Submitted to MO", "Queried", "Submitted to IUK"];

export const fakePcrs = range(10).map<PCRSummaryDto>((x, i) => ({
  id: `Pcr-${x}`,
  requestNumber: x,
  items: fakeItemTypes.map(y => {
    return {
      typeName: y.name,
      type: y.id
    };
  }),
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
    statusName: i % 2 ? "To do" : "Complete",
    type: x.id,
    typeName: x.name,
  }))
};

export const fakeDocuments: DocumentSummaryDto[] = range(3).map<DocumentSummaryDto>(x => ({
  id: `Doc${x}`,
  fileName: `doc${x}.txt`,
  fileSize: 0,
  link: "#",
  dateCreated: new  Date(),
}));
