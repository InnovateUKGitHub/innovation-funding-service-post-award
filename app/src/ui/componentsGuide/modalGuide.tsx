import React from "react";
import { Modal, ModalLink, Section } from "@ui/components";
import { SimpleString } from "@ui/components/renderers";

export const modalGuide: IGuide = {
  name: "Modal",
  options: [{
    name: "Simple",
    comments: "Used to show a modal dialogue",
    example: "" +
      "<ModalLink open={true} modalId=\"modal1\" styling={\"PrimaryButton\"}>Open Modal</ModalLink>\n" +
      "<Modal id=\"modal1\">\n" +
      "  ...content...\n" +
      "  <ModalLink open={false} modalId=\"modal1\" styling={\"PrimaryButton\"}>Close Modal</ModalLink>\n" +
      "</Modal>",
    render: () => (
      <div>
        <ModalLink open={true} modalId="modal1" styling={"PrimaryButton"}>Open Modal</ModalLink>
        <Modal id="modal1">
          <Section title={"Modal demo"}>
            <SimpleString>This is how to use a modal.</SimpleString>
            <SimpleString>Click the x on the top right to close</SimpleString>
            <ModalLink open={false} modalId="modal1" styling={"PrimaryButton"}>Close Modal</ModalLink>
          </Section>
        </Modal>
      </div>
    )
  }]
};
