import { IGuide } from "@framework/types/IGuide";
import { Accordion } from "@ui/components/accordion/Accordion";
import { AccordionItem } from "@ui/components/accordion/AccordionItem";
import { Content } from "@ui/components/content";
import { DocumentList } from "@ui/components/documents/DocumentList";

const documents = [
  {
    link: "https://www.google.com/",
    fileName: "LABOUR_COSTS_Q3_2017-11-05.pdf",
    id: "1",
    fileSize: 3,
    dateCreated: new Date(),
    owner: "owner1@ownder.com",
    uploadedBy: "Snap",
    uploadedByPartnerName: "Neil Little's Little Tots",
    isOwner: false,
  },
  {
    link: "https://www.amazon.co.uk/",
    fileName: "PAYMENT_RECEIPT_PROJECT_MANAGER_Q3_2017-11-05.pdf",
    id: "2",
    fileSize: 3,
    dateCreated: new Date(),
    owner: "owner2@ownder.com",
    uploadedBy: "Crackle",
    uploadedByPartnerName: "Neil Little's Little Tots",
    isOwner: false,
  },
  {
    link: "https://www.bbc.co.uk/",
    fileName: "PAYMENT_RECEIPT_ELECTRICIAN_Q3_2017-11-05.pdf",
    id: "3",
    fileSize: 3,
    dateCreated: new Date(),
    owner: "owner3@ownder.com",
    uploadedBy: "Pop",
    uploadedByPartnerName: "Neil Little's Little Tots",
    isOwner: false,
  },
];

export const accordionGuide: IGuide = {
  name: "Accordion",
  options: [
    {
      name: "Single accordion",
      comments: "Renders a single accordion item",
      example: `
      <Accordion>
        <AccordionItem title="Section 1">
            <DocumentList documents={documents} qa="documentList"/>
        </AccordionItem>
      </Accordion>`,
      render: () => (
        <Accordion>
          <AccordionItem title="Section 1" qa="Section1">
            <DocumentList documents={documents} qa="documentList" />
          </AccordionItem>
          <AccordionItem title="Section 2" qa="Section2">
            <DocumentList documents={documents} qa="documentList2" />
          </AccordionItem>
        </Accordion>
      ),
    },
    {
      name: "Multiple accordions",
      comments: "Renders multiple accordions items",
      example: `
      <Accordion>
        <AccordionItem title="Section 1">
            <DocumentList documents={documents} qa="documentList"/>
        </AccordionItem>
        <AccordionItem title="Section 2">
            <Content value={x => x.example.contentTitle} />
        </AccordionItem>
      </Accordion>`,
      render: () => (
        <Accordion>
          <AccordionItem title="Item 1" qa="Item1">
            <DocumentList documents={documents} qa="documentList" />
          </AccordionItem>
          <AccordionItem title="Item 2" qa="Item2">
            <Content value={x => x.example.contentTitle} />
          </AccordionItem>
        </Accordion>
      ),
    },
  ],
};
