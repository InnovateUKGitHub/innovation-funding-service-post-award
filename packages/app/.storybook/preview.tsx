import type { Decorator, Preview } from "@storybook/react";
import { ContentProvider } from "@ui/context/contentProvider";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import cx from "classnames";

import { Copy } from "@copy/Copy";
import {
  allLanguages,
  allNamespaces,
  CopyLanguages,
  CopyNamespaces,
  enCopy,
  ktpEnCopy,
  loansEnCopy,
  sbriEnCopy,
} from "@copy/data";
import { i18nInterpolationOptions, registerIntlFormatter } from "@copy/interpolation";

import { useEffect } from "react";
import "../src/styles/index.css";
import { StubMountedProvider } from "./StubMountedProvider";

i18next.use(initReactI18next).init({
  lng: CopyLanguages.en_GB,
  defaultNS: CopyNamespaces.DEFAULT,
  fallbackNS: CopyNamespaces.DEFAULT,
  interpolation: i18nInterpolationOptions,
});

registerIntlFormatter();

i18next.addResourceBundle(CopyLanguages.en_GB, CopyNamespaces.DEFAULT, enCopy, true, true);
i18next.addResourceBundle(CopyLanguages.en_GB, CopyNamespaces.KTP, ktpEnCopy, true, true);
i18next.addResourceBundle(CopyLanguages.en_GB, CopyNamespaces.LOANS, loansEnCopy, true, true);
i18next.addResourceBundle(CopyLanguages.en_GB, CopyNamespaces.SBRI_IFS, sbriEnCopy, true, true);
i18next.addResourceBundle(CopyLanguages.en_GB, CopyNamespaces.SBRI, sbriEnCopy, true, true);

const decorators: Decorator[] = [
  (Story, context) => {
    useEffect(() => {
      i18next.changeLanguage(context.globals.language);
    }, [context.globals.language]);

    return <Story />;
  },
  (Story, context) => {
    const mounted = !!context.globals.mounted;
    return (
      <div className={cx("govuk-template__body", { "js-enabled": mounted })} id="root">
        <ContentProvider value={new Copy({ competitionType: context.globals.namespace })}>
          <StubMountedProvider mounted={mounted}>
            <Story />
          </StubMountedProvider>
        </ContentProvider>
      </div>
    );
  },
];

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
  decorators,
};

export default preview;
export { decorators };
