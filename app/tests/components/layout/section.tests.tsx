import "jest";
import React from "react";
import { Section } from "../../../src/ui/components/layout/section";

import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("Section", () => {

    it("should the render the title", () => {
        const title = "a test title";

        const wrapper = Enzyme.mount(<Section title={title} />);

        expect(wrapper.text()).toContain(title);
    });

    it("should the render the sub title", () => {
        const subtitle = "a test sub title";

        const wrapper = Enzyme.mount(<Section subtitle={subtitle} />);

        expect(wrapper.text()).toContain(subtitle);
    });

    it("should the render the content", () => {
        const content = "a test content";

        const wrapper = Enzyme.mount(<Section>{content}</Section>);

        expect(wrapper.text()).toContain(content);
    });

    it("should the render the badge", () => {
        const badge = "a test badge";

        const wrapper = Enzyme.mount(<Section badge={badge} />);

        expect(wrapper.text()).toContain(badge);
    });

    it("should the render h2 subsection", () => {
        const output = Enzyme.mount(<Section title={"aTitle"}/>).html();
        expect(output).toContain("<h2");
    });
});
