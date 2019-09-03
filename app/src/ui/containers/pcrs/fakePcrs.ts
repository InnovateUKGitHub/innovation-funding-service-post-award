import { range } from "@shared/range";

export const fakeDocuments: DocumentSummaryDto[] = range(3).map<DocumentSummaryDto>(x => ({
  id: `Doc${x}`,
  fileName: `doc${x}.txt`,
  fileSize: 0,
  link: "#",
  dateCreated: new Date(),
}));
