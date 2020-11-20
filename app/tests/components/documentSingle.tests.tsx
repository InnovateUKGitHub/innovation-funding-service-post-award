import React from "react";
// tslint:disable-next-line: import-blacklist
import { mount } from "enzyme";

import { DocumentSingle, DocumentSingleProps } from "../../src/ui/components";
import { findByQa } from "./helpers/find-by-qa";
import TestBed, { TestBedContent } from "@shared/TestBed";

type AnchorWithDataQa = { "data-qa": string } & React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

describe("DocumentSingle", () => {
  const stubContent = {
    components: {
      documentSingle: {
        newWindow: { content: "stub-newWindowContent" },
      },
    },
  };

  const defaultProps: DocumentSingleProps = {
    document: {
      link: "https://www.google.com/",
      fileName: "stub-filename",
    },
  };

  const setup = (props?: Partial<DocumentSingleProps>) => {
    const wrapper = mount(
      <TestBed content={stubContent as TestBedContent}>
        <DocumentSingle {...defaultProps} {...props} />
      </TestBed>,
    );

    const messageElement = findByQa(wrapper, "document-single-message");
    const linkElement = wrapper.find("a");

    // Note: Remove prop don't need
    const { className, ...linkElementProps } = linkElement.props();

    return {
      wrapper,
      linkElement,
      linkElementProps,
      messageElement,
    };
  };

  it("should render valid link", () => {
    const { linkElementProps, messageElement } = setup();

    // tslint:disable: object-literal-key-quotes
    const expectedProps = {
      href: defaultProps.document.link,
      children: defaultProps.document.fileName,
      target: undefined,
      "data-qa": undefined,
      style: { paddingRight: 20 },
    };

    expect(linkElementProps).toStrictEqual(expectedProps);
    expect(messageElement.exists()).toBe(false);
  });

  it("should render message", () => {
    const stubMessage = "stub-message";
    const { messageElement } = setup({ message: stubMessage });

    expect(messageElement.text()).toBe(stubMessage);
  });

  it("should render a removeElement", () => {
    const stubElementQa = "stub-qa-removeElement";
    const { wrapper } = setup({ removeElement: <div data-qa={stubElementQa}>removeElement</div> });

    const target = findByQa(wrapper, stubElementQa);

    expect(target.exists()).toBe(true);
  });

  it("should render a qa", () => {
    const stubQa = "stub-qa";
    const { linkElementProps } = setup({ qa: stubQa });

    // Note: Added type since "data-qa" is a custom attr
    const target = linkElementProps as AnchorWithDataQa;

    expect(target["data-qa"]).toBe(stubQa);
  });

  it("should render a link which opens new window", () => {
    const { linkElementProps } = setup({ openNewWindow: true });

    expect(linkElementProps.target).toContain("_blank");
  });
});
