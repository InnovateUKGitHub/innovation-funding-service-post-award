// tslint:disable:no-duplicate-string
import React from "react";
import { DocumentSingle, DocumentSingleProps } from "../../src/ui/components";

import { mount, shallow } from "enzyme";
import TestBed from "./helpers/TestBed";
import { findByQa } from "./helpers/find-by-qa";

describe("DocumentSingle", () => {

    const stubContent = {
        components: {
          documentSingle: {
            newWindow: "stub-newWindowContent"
          }
        }
      };

    const setup = (props: DocumentSingleProps) => {
        const shallowWrapper = shallow(<TestBed content={stubContent as any}><DocumentSingle {...props} /></TestBed>);
        const mountWrapper = mount(<TestBed content={stubContent as any}><DocumentSingle {...props} /></TestBed>);

        const documentLinkElement = findByQa(mountWrapper, "qa");

        return {
            shallowWrapper,
            mountWrapper,
            documentLinkElement
        };
    };
    const document = { link: "https://www.google.com/", fileName: "LABOUR_COSTS_Q3_2017-11-05.pdf", id: "1", fileSize: 3, dateCreated: new Date(), owner: "owner1@ownder.com", uploadedBy: "Arthur the Aardvark" };

    it("should render LABOUR_COSTS_Q3_2017-11-05.pdf text as  https://www.google.com/ link ", () => {
        const { documentLinkElement } = setup({message: "test", document, qa: "qa"});
        expect(documentLinkElement.get(0).props.href).toBe(document.link);
        expect(documentLinkElement.props().children).toBe(document.fileName);
    });

    it("should render a An IAR has been added to this claim section heading", () => {
        const { mountWrapper } = setup({message: "An IAR has been added to this claim", document, qa: "qa"});
        expect(mountWrapper.find("p").props().children).toBe("An IAR has been added to this claim");
    });

    it("should render <a> that opens in a new window", () => {
        const { shallowWrapper } = setup({message: "An IAR has been added to this claim", document, qa: "qa", openNewWindow: true});
        expect(shallowWrapper.html()).toContain("<a target=\"_blank\"");
    });
});
