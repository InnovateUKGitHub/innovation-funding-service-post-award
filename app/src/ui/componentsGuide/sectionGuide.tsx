import React from "react";
import { Section } from "../components/layout/section";
import { SimpleString } from "../components/renderers/simpleString";

export const sectionGuide: IGuide = {
    name: "Section",
    options: [
        {
            name: "Simple",
            comments: "Renders a section and children",
            example: `<Section title="Section title"><div>Section contents</div></Section>`,
            render: () => <Section title="Section title"><SimpleString>Section contents</SimpleString></Section>
        },
        {
            name: "With comments",
            comments: "Renders comments below a title",
            example: `<Section title="Section title" subtitle="The sub title" />`,
            render: () => <Section title="Section title" subtitle="The sub title" />
        },
        {
            name: "Section with a subsection",
            comments: "Renders a section and a subsection",
            example: `
                <Section title="Section title" subtitle="The subtitle" >
                  <Section title="Subsection title" subtitle="Subsection subtitle" />
                </Section>
            `,
            render: () => (
              <Section title="Section title" subtitle="The subtitle" >
                  <Section title="Subsection title" subtitle="Subsection subtitle" />
              </Section>
              )
        },
        {
            name: "With badge",
            comments: "Renders a badge to the right of the title",
            example: `<Section title="Section title" badge={<h3>The badge</h3>} />`,
            render: () => <Section title="Section title" badge={<h3>The badge</h3>} />
        },
        {
            name: "The works",
            comments: "Everything together",
            example: `<Section title="Section title" badge={<h3>The badge</h3>} />`,
            render: () => <Section title="Section title" subtitle="The sub title" badge={<h3>The badge</h3>}><SimpleString>Section contents</SimpleString></Section>
        },
        {
            name: "The over-compensator",
            comments: "Sec-Sec-Section-tion-tion",
            example: `<Section title="Section title 1" >
                    <Section title="Section title 1.1">
                        <Section title="Section title 1.1.1">
                            <Section title="Section title 1.1.1.1" />
                        </Section>
                    </Section>
                    <Section title="Section title 1.2">
                        <Section title="Section title 1.2.1" />
                        <Section title="Section title 1.2.2" />
                    </Section>
                </Section>
              <Section title="Section title 2">
                  <Section title="Section title 2.1">
                      <Section title="Section title 2.1.1" />
                  </Section>
              </Section>`,
            render: () => (
              <React.Fragment>
                <Section title="Section title 1" >
                    <Section title="Section title 1.1">
                        <Section title="Section title 1.1.1">
                            <Section title="Section title 1.1.1.1" />
                        </Section>
                    </Section>
                    <Section title="Section title 1.2">
                        <Section title="Section title 1.2.1" />
                        <Section title="Section title 1.2.2" />
                    </Section>
                </Section>
              <Section title="Section title 2">
                  <Section title="Section title 2.1">
                      <Section title="Section title 2.1.1" />
                  </Section>
              </Section>
              </React.Fragment>
            )
        },
    ]
};
