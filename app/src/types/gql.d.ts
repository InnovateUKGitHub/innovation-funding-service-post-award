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
   * type Project = GQL.NodeSelector<FinanceSummaryQuery, "Acc_Project__c">
   */
  type NodeSelector<T, Field extends string> = T extends { readonly salesforce: AnyObject }
    ? NodeSelector<T["salesforce"], Field>
    : T extends { readonly uiapi: AnyObject }
    ? NodeSelector<T["uiapi"], Field>
    : T extends { readonly query: AnyObject }
    ? NodeSelector<T["query"], Field>
    : Field extends keyof T
    ? NodeValue<T[Field]>
    : never;

  type Maybe<T> = T | null;

  type Value<T> = Maybe<{ value: Maybe<T> }>;

  type ValueAndLabel<T> = Maybe<{ value?: Maybe<T>; label?: Maybe<string> }>;

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
