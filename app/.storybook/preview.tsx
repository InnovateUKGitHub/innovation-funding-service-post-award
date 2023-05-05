import type { Preview } from "@storybook/react";
import { MountedProvider } from "@ui/features";
import { ContentProvider } from "@ui/redux";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { Copy } from "@copy/Copy";
import {
  CopyLanguages,
  CopyNamespaces,
  allLanguages,
  allNamespaces,
  enCopy,
  ktpEnCopy,
  sbriEnCopy,
  sbriIfsEnCopy,
  loansEnCopy,
} from "@copy/data";
import { i18nInterpolationOptions } from "@copy/interpolation";

import "../src/styles/index.css";
import { useEffect } from "react";
import { StubMountedProvider } from "./StubMountedProvider";

i18next.use(initReactI18next).init({
  lng: CopyLanguages.en_GB,
  defaultNS: CopyNamespaces.DEFAULT,
  fallbackNS: CopyNamespaces.DEFAULT,
  interpolation: i18nInterpolationOptions,
});

i18next.addResourceBundle(CopyLanguages.en_GB, CopyNamespaces.DEFAULT, enCopy, true, true);
i18next.addResourceBundle(CopyLanguages.en_GB, CopyNamespaces.KTP, ktpEnCopy, true, true);
i18next.addResourceBundle(CopyLanguages.en_GB, CopyNamespaces.LOANS, loansEnCopy, true, true);
i18next.addResourceBundle(CopyLanguages.en_GB, CopyNamespaces.SBRI_IFS, sbriEnCopy, true, true);
i18next.addResourceBundle(CopyLanguages.en_GB, CopyNamespaces.SBRI, sbriIfsEnCopy, true, true);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  globalTypes: {
    language: {
      name: "Language",
      description: "Internationalisation",
      defaultValue: CopyLanguages.en_GB,
      toolbar: {
        icon: "globe",
        items: allLanguages,
      },
    },
    namespace: {
      name: "Competition",
      description: "The internationalisation namespace",
      defaultValue: CopyNamespaces.DEFAULT,
      toolbar: {
        icon: "certificate",
        items: allNamespaces,
      },
    },
    mounted: {
      name: "useMounted",
      description: "Whether we are mounted (client) or pretending to not be mounted (ssr)",
      defaultValue: true,
      toolbar: {
        icon: "power",
        items: [
          { value: true, title: "isClient" },
          { value: false, title: "isServer" },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      useEffect(() => {
        i18next.changeLanguage(context.globals.language);
      }, [context.globals.language]);

      return <Story />;
    },
    (Story, context) => (
      <div className="govuk-template__body js-enabled" id="root">
        <ContentProvider value={new Copy(context.globals.namespace)}>
          <StubMountedProvider mounted={context.globals.mounted ?? true}>
            <Story />
          </StubMountedProvider>
        </ContentProvider>
      </div>
    ),
  ],
};

export default preview;
