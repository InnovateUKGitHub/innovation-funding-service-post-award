import React from "react";
import { DocumentSingle, DocumentSingleProps } from "../components";
import { ClaimDto } from "@framework/types";
import * as ACC from "../components";
import { IGuide } from "@framework/types";

const document: DocumentSingleProps["document"] = {
  link: "https://www.ukri.org",
  fileName: "Custom Filename",
};

const Form = ACC.TypedForm<ClaimDto>();
const button = <Form.Button name="return">Remove</Form.Button>;

export const documentSingleGuide: IGuide = {
  name: "DocumentSingle",
  options: [
    {
      name: "Simple",
      comments: "Renders a DocumentSingle component",
      example: `<DocumentSingle message="test" document={document} qa="qa" openNewWindow={true} />`,
      render: () => (
        <DocumentSingle
          message={"An IAR has been added to this claim"}
          document={document}
          qa={"qa"}
          removeElement={button}
          openNewWindow={true}
        />
      ),
    },
  ],
};
