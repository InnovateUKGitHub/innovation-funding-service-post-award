import React from "react";
import { PageTitle } from "@ui/components";
import { IStores, StoresProvider } from "@ui/redux";

const stores: IStores = {
    navigation: {
        getPageTitle: () => ({displayTitle: "Component guide", htmlTitle: "Component guide"})
    }
} as IStores;

export const pageTitleGuide: IGuide = {
    name: "Page Title",
    options: [
        {
            name: "Page title with caption",
            comments: "Renders a PageTitle and a caption if present",
            example: "<PageTitle caption=\"Component guide caption\" />",
            render: () => (
              <StoresProvider value={stores}>
                    <PageTitle caption="Component guide caption" />
              </StoresProvider>
            )
        }
    ]
};
