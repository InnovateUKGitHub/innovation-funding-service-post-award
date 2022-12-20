/**
 * More details at: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_query.htm
 */

export interface SOQLResult<T extends AnyObject> {
    done: boolean;
    totalSize: number;
    nextRecordsUrl?: string;
    records: SOQLRecord<T>[];
}

export type SOQLRecord<T extends AnyObject> = T & {
    attributes: {
        type: string;
        url: string;
    };
}
