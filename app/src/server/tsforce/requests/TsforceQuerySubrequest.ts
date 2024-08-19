import { soql } from "@server/util/salesforce-string-helpers";
import { BaseTsforceRequestProps } from "./BaseTsforceRequest";
import { BaseTsforceSobjectSubrequest, TsforceSubrequestPayload } from "./BaseTsforceSubrequest";

class TsforceQuerySubrequest<T> extends BaseTsforceSobjectSubrequest<{
  totalSize: number;
  done: boolean;
  nextRecordsUrl: string;
  records: T[];
}> {
  method = "GET" as const;
  fieldNames: string[];
  private filter: string | null = null;
  limit: number = Infinity;

  constructor({
    fieldNames,
    sobject,
    connection,
  }: { fieldNames: string[]; sobject: string } & BaseTsforceRequestProps) {
    super({ sobject, connection });
    this.fieldNames = fieldNames;
  }

  where(filter: AnyObject | string) {
    if (typeof filter === "string") {
      this.filter = filter;
      return this;
    }

    if (typeof filter === "object") {
      const filters: string[] = [];
      for (const [key, value] of Object.entries(filter)) {
        const comparison = Array.isArray(value) ? "IN" : "=";
        filters.push(`${key} ${comparison} ${soql`${value}`}`);
      }

      this.filter = filters.join(" AND ");

      return this;
    }

    throw new Error("Filter must be either a string or a single depth object when making a Tsforce Query");
  }

  count(n: number) {
    this.limit = n;
    return this;
  }

  toSOQL(): string {
    let query = `SELECT ${this.fieldNames.join(", ")} FROM ${this.sobject}`;

    if (typeof this.filter === "string") {
      query += " WHERE " + this.filter;
    }

    if (isFinite(this.limit)) {
      query += " LIMIT " + this.limit;
    }

    return query;
  }

  payload(): TsforceSubrequestPayload {
    return {
      body: undefined,
      queryParameters: {
        q: this.toSOQL(),
      },
      url: "/query",
    };
  }
}

export { TsforceQuerySubrequest };
