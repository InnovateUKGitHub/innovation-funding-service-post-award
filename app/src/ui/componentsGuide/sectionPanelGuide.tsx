import { IGuide } from "@framework/types/IGuide";
import { SectionPanel } from "@ui/components/layout/sectionPanel";

export const sectionPanelGuide: IGuide = {
  name: "Section Panel",
  options: [
    {
      name: "Simple",
      comments: "Used inside a section to wrap content in a border.",
      example: '<SectionPanel title="Project claims history" />',
      render: () => (
        <SectionPanel title="Project claims history">
          <div>I&amp;m a child</div>
        </SectionPanel>
      ),
    },
  ],
};
