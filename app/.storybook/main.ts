import type { StorybookConfig } from "@storybook/react-webpack5";
import { Configuration, RuleSetRule } from "webpack";
import custom from "../webpack.config.js";

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
  core: {
    disableTelemetry: true,
  },
  staticDirs: ["../public"],
  webpackFinal: async (config: Configuration) => {
    const rule = {
      ...config,
      module: {
        ...config.module,
        rules: [
          ...(config?.module?.rules?.filter(rule =>
            rule === "..." ? false : (rule as RuleSetRule)?.test?.toString().includes("mdx"),
          ) ?? []),
          ...(clientWebpackConfig?.module?.rules ?? []),
        ],
      },
      resolve: {
        ...clientWebpackConfig.resolve,
        ...config.resolve,
        extensions: [...(config?.resolve?.extensions ?? []), ...(clientWebpackConfig?.resolve?.extensions ?? [])],
        plugins: [...(config?.resolve?.plugins ?? []), ...(clientWebpackConfig?.resolve?.plugins ?? [])],
        roots: [...(config?.resolve?.roots ?? []), ...(clientWebpackConfig?.resolve?.roots ?? [])],
      },
      plugins: [...(config?.plugins ?? []), ...(clientWebpackConfig?.plugins ?? [])],
      output: {
        ...clientWebpackConfig.output,
        ...config.output,
      },
    };

    return rule;
  },
};
export default config;
