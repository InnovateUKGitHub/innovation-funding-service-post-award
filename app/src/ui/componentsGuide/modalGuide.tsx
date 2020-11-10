import React from "react";
import { Modal, ModalLink, PrivateModal, Section } from "@ui/components";
import { SimpleString } from "@ui/components/renderers";
import { ModalConsumer, ModalProvider, ModalRegister } from "@ui/redux";
import { IGuide } from "@framework/types";

export const modalGuide: IGuide = {
  name: "Modal",
  options: [{
    name: "Simple",
    comments: "Used to show a modal dialogue",
    example: "<a href=\"#abc\">Modal</a>\n\n" +
      "<Modal id=\"abc\">\n" +
      "  <Section title={\"Modal demo\"}>\n" +
      "    <SimpleString>This is how to use a modal.</SimpleString>\n" +
      "  </Section>\n" +
      "</Modal>",
    render: () => (
      <div>
        <a href="#abc">Modal</a>
        <ModalProvider value={new ModalRegister()}>
          <Modal id="abc">
            <Section title={"Modal demo"}>
              <SimpleString>This is how to use a modal.</SimpleString>
            </Section>
          </Modal>
          <ModalConsumer>
            {
              modalRegister => modalRegister.getModals().map(x => <PrivateModal key={`modal-${x.id}`} id={x.id}>{x.children}</PrivateModal>)
            }
          </ModalConsumer>
        </ModalProvider>
      </div>
    )
  },
    {
    name: "Modal link",
    comments: "Link for opening or closing a modal dialogue",
    example: "<ModalLink open={true} modalId=\"modal1\" styling={\"PrimaryButton\"}>Open Modal</ModalLink>\n\n" +
      "<Modal id=\"modal1\">\n" +
      "  <Section title={\"Modal demo\"}>\n" +
      "    <SimpleString>This is how to use a modal.</SimpleString>\n" +
      "    <ModalLink open={false} modalId=\"modal1\" styling={\"PrimaryButton\"}>Close Modal</ModalLink>\n" +
      "  </Section>\n" +
      "</Modal>",
    render: () => (
      <div>
        <ModalLink open={true} modalId="modal1" styling={"PrimaryButton"}>Open Modal</ModalLink>
        <ModalProvider value={new ModalRegister()}>
          <Modal id="modal1">
            <Section title={"Modal demo"}>
              <SimpleString>This is how to use a modal.</SimpleString>
              <ModalLink open={false} modalId="modal1" styling={"PrimaryButton"}>Close Modal</ModalLink>
            </Section>
          </Modal>
          <ModalConsumer>
            {
              modalRegister => modalRegister.getModals().map(x => <PrivateModal key={`modal-${x.id}`} id={x.id}>{x.children}</PrivateModal>)
            }
          </ModalConsumer>
        </ModalProvider>
      </div>
    )
  }]
};
