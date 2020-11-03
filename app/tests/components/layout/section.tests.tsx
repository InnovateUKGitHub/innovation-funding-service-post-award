import React from "react";
import { Section } from "../../../src/ui/components/layout/section";

import { mount } from "enzyme";

describe("Section", () => {

    it("should the render the title", () => {
        const title = "a test title";

        const wrapper = mount(<Section title={title} />);

        expect(wrapper.text()).toContain(title);
    });

    it("should the render the sub title", () => {
        const subtitle = "a test sub title";

        const wrapper = mount(<Section subtitle={subtitle} />);

        expect(wrapper.text()).toContain(subtitle);
    });

    it("should the render the content", () => {
        const content = "a test content";

        const wrapper = mount(<Section>{content}</Section>);

        expect(wrapper.text()).toContain(content);
    });

    it("should the render the badge", () => {
        const badge = "a test badge";

        const wrapper = mount(<Section badge={badge} />);

        expect(wrapper.text()).toContain(badge);
    });

    it("should the render h2 subsection", () => {
        const output = mount(<Section title={"aTitle"}/>).html();
        expect(output).toContain("<h2");
    });
});
