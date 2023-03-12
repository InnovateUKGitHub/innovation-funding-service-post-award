declare namespace GQL {
  type NodeValue<T> = T extends {
    readonly edges: ReadonlyArray<infer Node> | null;
  }
    ? NodeValue<Node>
    : T extends { readonly node: infer U }
    ? U
    : null;

  /**
   * Type will extract type of object node from generated gql type files
   *
   * @example
   * type Project = GQL.ObjectNodeSelector<FinanceSummaryQuery, "Acc_Project__c">
   */
  type ObjectNodeSelector<T, Field extends string> = T extends { readonly salesforce: AnyObject }
    ? ObjectNodeSelector<T["salesforce"], Field>
    : T extends { readonly uiapi: AnyObject }
    ? ObjectNodeSelector<T["uiapi"], Field>
    : T extends { readonly query: AnyObject }
    ? ObjectNodeSelector<T["query"], Field>
    : Field extends keyof T
    ? NodeValue<T[Field]>
    : never;

  type ObjectEdgeSelector<T, Field extends string> = T extends { readonly salesforce: AnyObject }
    ? ObjectNodeSelector<T["salesforce"], Field>
    : T extends { readonly uiapi: AnyObject }
    ? ObjectNodeSelector<T["uiapi"], Field>
    : T extends { readonly query: AnyObject }
    ? ObjectNodeSelector<T["query"], Field>
    : Field extends keyof T
    ? T[Field] extends { readonly edges: ReadonlyArray<infer U> }
      ? U
      : null
    : never;

  type Value<T> = {
    value: T | null;
  } | null;

  type DtoMapper<Dto, Node, AdditionalData = undefined> = AdditionalData extends undefined
    ? {
        [Key in keyof Dto]: (node: Node) => Dto[Key];
      }
    : {
        [Key in keyof Dto]: (
          node: Node,
          additionalData: AdditionalData extends undefined ? never : AdditionalData,
        ) => Dto[Key];
      };
}
