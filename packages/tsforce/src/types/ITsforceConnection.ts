import type { ExecutionRequest } from "@graphql-tools/utils";
import { PayloadError } from "relay-runtime";
import { TsforceConnectionDataloader } from "../TsforceDataloader";
import { ITsforceHttpClient } from "./ITsforceHttpClient";
import { ITsforceSobject } from "./ITsforceObject";

interface ExecuteConfiguration {
  decodeHTMLEntities?: boolean;
}

/**
 * User-specific connection to the Salesforce API.
 * Initialise by creating a connection with the `asUser` static method.
 */
interface ITsforceConnection {
  email: string;
  httpClient: ITsforceHttpClient;
  dataLoader: TsforceConnectionDataloader;

  /**
   * Execute a GraphQL Query AST via the Salesforce GraphQL API.
   *
   * @todo Remove decodeHTMLEntities when Salesforce no longer returns encoded results.
   * @returns GraphQL Result - Is typed as `any` because the result may vary, including potential errors.
   */
  executeGraphQL<T>({
    document,
    variables,
    decodeHTMLEntities,
  }: ExecutionRequest & ExecuteConfiguration): Promise<{ data: T; errors: PayloadError[] }>;

  /**
   * Execute a SOQL Query via the Salesforce SOQL Query API.
   *
   * @returns SOQL Result - Is typed as `any` because the result may vary, including potential errors.
   */
  executeSOQL<T>({ query }: { query: string }): Promise<{ totalSize: number; done: boolean; records: T[] }>;

  sobject(name: string): ITsforceSobject;
}

export { ITsforceConnection };
