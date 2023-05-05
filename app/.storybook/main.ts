import type { StorybookConfig } from "@storybook/react-webpack5";
import { Configuration } from "webpack";
import custom from "../webpack.config.js";
import util from "util";
import path from "path";

const [clientWebpackConfig] = custom({ env: "development", devtools: true });

const config: StorybookConfig = {
  stories: ["../src/**/*.docs.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
  webpackFinal: async (config: Configuration) => {
    const rule = {
      ...config,
      module: {
        ...config.module,
        rules: [
          ...(config?.module?.rules?.filter(rule =>
            rule === "..." ? false : rule?.test?.toString().includes("mdx"),
          ) ?? []),
          ...(clientWebpackConfig?.module?.rules ?? []),
        ],
      },
      resolve: {
        ...config.resolve,
        extensions: [...(config?.resolve?.extensions ?? []), ...(clientWebpackConfig?.resolve?.extensions ?? [])],
        plugins: [...(config?.resolve?.plugins ?? []), ...(clientWebpackConfig?.resolve?.plugins ?? [])],
      },
      plugins: [...(config?.plugins ?? []), ...(clientWebpackConfig?.plugins ?? [])],
    };

    return rule;
  },
};
export default config;
