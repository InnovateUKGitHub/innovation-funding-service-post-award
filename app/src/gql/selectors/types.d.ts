export type ProjectTypeSelector<T> = T extends {
  salesforce: {
    uiapi: {
      query: {
        Acc_Project__c: {
          edges: ArrayLike<{
            node: infer U | null;
          } | null> | null;
        } | null;
      };
    };
  };
}
  ? U
  : never;

export type ProjectChangeRequestTypeSelector<T> = T extends {
  Project_Change_Requests__r: {
    edges: ArrayLike<{
      node: infer U | null;
    } | null> | null;
  } | null;
}
  ? U
  : never;
