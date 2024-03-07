import { readFileSync } from "fs";

/**
 * Check if an environemnt variable exists
 * @param env The name of the environment variable
 * @returns Whether the KEY provided is a set environment variable
 */
const envExists = (env: string): boolean => typeof process.env[env] === "string";

/**
 * Get an environment variable, and transform it with a trans function
 * @param env The name of the environment variable
 * @param defaultValue The default value of the environment variable. If both this and the environment variable does not exist, the function will throw an exception.
 * @param transFunction The transformation function that converts a string to the output type
 * @returns The environment variable, as processed by the trans function
 */
const getEnv = <T>(env: string, defaultValue: T | undefined, transFunction: (key: string) => T): T => {
  const value = process.env[env];
  if (typeof value !== "string") {
    if (typeof defaultValue !== "undefined") {
      return defaultValue;
    }
    if (process.env.NODE_ENV === "test") {
      return transFunction("");
    }
    throw new Error(`Failed to read environment variable: ${env}`);
  }
  return transFunction(value);
};

/**
 * Get a string environment variable
 * @param env The name of the environment variable
 * @param defaultValue The default value of the environment variable. If both this and the environment variable does not exist, the function will throw an exception.
 * @returns The environment variable (or it's default, if assigned) as a string.
 */
const getStringEnv = (env: string, defaultValue?: string) => getEnv(env, defaultValue, x => x.trim());

/**
 * Get a pipe-separated string array environment variable
 * @param env The name of the environment variable
 * @param defaultValue The default value of the environment variable. If both this and the environment variable does not exist, the function will throw an exception.
 * @returns The environment variable (or it's default, if assigned) as a string array.
 */
const getPipeSepStringArray = (env: string, defaultValue?: string[]) =>
  getEnv(env, defaultValue, x =>
    x
      .trim()
      .split(/[\|\n]/)
      .map(x => x.trim())
      .filter(x => x),
  );

/**
 * Get a comma separated string list environment variable
 * @param env The name of the environment variable
 * @param defaultValue The default value of the environment variable. If both this and the environment variable does not exist, the function will throw an exception.
 * @returns The environment variable (or it's default, if assigned) as a string array.
 */
const getCommaSepStringArray = (env: string, defaultValue?: string[]) =>
  getEnv(env, defaultValue, x =>
    x
      .trim()
      .split(",")
      .map(x => x.trim())
      .filter(x => x),
  );

/**
 * Get a boolean environment variable
 * @param env The name of the environment variable
 * @param defaultValue The default value of the environment variable. If both this and the environment variable does not exist, the function will throw an exception.
 * @returns `true` iff the environment variable is set to the string value "true" (or it's default, if assigned)
 */
const getBooleanEnv = (env: string, defaultValue?: boolean) => getEnv(env, defaultValue, x => x === "true");

/**
 * Get an integer environment variable
 * @param env The name of the environment variable
 * @param defaultValue The default value of the environment variable. If both this and the environment variable does not exist, the function will throw an exception.
 * @returns The environment variable (or it's default, if assigned) as a number.
 */
const getIntegerEnv = (env: string, defaultValue?: number) => getEnv(env, defaultValue, x => parseInt(x, 10));

/**
 * Get a float environment variable
 * @param env The name of the environment variable
 * @param defaultValue The default value of the environment variable. If both this and the environment variable does not exist, the function will throw an exception.
 * @returns The environment variable (or it's default, if assigned) as a number.
 */
const getFloatEnv = (env: string, defaultValue?: number) => getEnv(env, defaultValue, x => parseFloat(x));

/**
 * Get a certificate environment variable
 * @param type The name of the environment variable
 * @param defaultValue The default value of the environment variable. If both this and the environment variable does not exist, the function will throw an exception.
 * @returns The environment variable, either from the env itself or from a file stored on diskette
 */
const getCertificateEnv = (type: string, defaultValue?: string): string => {
  if (envExists(type)) {
    return getStringEnv(type).replaceAll("\\n", "\n");
  }
  if (envExists(`${type}_FILE`)) {
    return readFileSync(getStringEnv(`${type}_FILE`), { encoding: "utf-8" });
  }
  if (typeof defaultValue === "string") {
    return defaultValue;
  }
  if (process.env.NODE_ENV?.toLowerCase() === "test") {
    return "";
  }

  throw new Error(`Could not find the private key: ${type}`);
};

export {
  getEnv,
  getStringEnv,
  getPipeSepStringArray,
  getCommaSepStringArray,
  getBooleanEnv,
  getIntegerEnv,
  getFloatEnv,
  getCertificateEnv,
};
