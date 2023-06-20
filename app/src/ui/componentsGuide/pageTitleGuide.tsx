import { IGuide } from "@framework/types/IGuide";
import { PageTitle, PageTitleProvider } from "@ui/features/page-title";

export const pageTitleGuide: IGuide = {
  name: "Page Title",
  options: [
    {
      name: "Page title with caption",
      comments: "Renders a PageTitle and a caption if present",
      example: '<PageTitle caption="Component guide caption" />',
      render: () => (
        <PageTitleProvider title="Component guide">
          <PageTitle caption="Component guide caption" />
        </PageTitleProvider>
      ),
    },
  ],
};
