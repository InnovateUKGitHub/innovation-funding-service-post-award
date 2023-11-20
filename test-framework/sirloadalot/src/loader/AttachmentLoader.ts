import jsforce, { Connection } from "jsforce";
import { BaseLoader, IBaseLoader } from "./BaseLoader";
import { ApiName } from "../enum/ApiName";
import { join } from "node:path";
import fetch from "node-fetch";
import { FormData, Blob } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";
import { getSalesforceAccessToken } from "../sf/salesforce";

type AttachmentLoaderProps = Pick<
  IBaseLoader,
  "manager" | "prefix" | "startDate"
>;

interface FilePayload {
  loadId?: string;
  name: string;
  path: string;
  description?: string;
  username?: string;
}

interface SuccessPayload {
  errors: [];
  id: `068${string}`;
  success: true;
}

class AttachmentLoader extends BaseLoader<FilePayload, any> {
  constructor(props: AttachmentLoaderProps) {
    super({
      apiName: ApiName.Competition,
      externalId: "Acc_CompetitionCode__c",
      relationshipMap: new Map(),
      operation: "insert",
      ...props,
    });
  }

  private async loadContentVersion(
    conn: Connection<any>,
    { path, name, description }: FilePayload
  ): Promise<SuccessPayload> {
    const formData = new FormData();

    formData.append(
      "entity_content",
      new Blob(
        [
          JSON.stringify({
            ReasonForChange: "First Upload",
            PathOnClient: name,
            ContentLocation: "S",
            Description: description,
          }),
        ],
        { type: "application/json" }
      ),
      ""
    );
    formData.append(
      "VersionData",
      await fileFromPath(join(__dirname, "..", "payload", path))
    );

    const res = await fetch(
      conn.instanceUrl + "/services/data/v59.0/sobjects/ContentVersion",
      {
        headers: {
          Authorization: `Bearer ${conn.accessToken}`,
        },
        // @ts-ignore
        // TODO: It works. Don't question it. https://github.com/octet-stream/form-data/issues/57
        body: formData,
        method: "POST",
      }
    );

    if (!res.ok) throw new Error(await res.text());

    const json = await res.json();
    return json as SuccessPayload;
  }

  async load(
    bambooUserConnection: Connection<any>,
    payloads: FilePayload[]
  ): Promise<void> {
    for (const payload of payloads) {
      const parentRecord = this.manager.successMap.find(
        (x) => x.loadId === payload.loadId
      );

      if (!parentRecord) {
        throw new Error("Could not find parent record");
      }

      const conn = payload.username
        ? new jsforce.Connection<any>(
            await getSalesforceAccessToken(
              payload.username.replace(/< *prefix *>/g, this.prefix)
            )
          )
        : bambooUserConnection;

      // Upload a ContentVersion to a user's repository
      const initialVersion = await this.loadContentVersion(conn, payload);

      // Grab the ContentDocumentId from the ContentVersion
      const contentVersion = await bambooUserConnection
        .sobject("ContentVersion")
        .retrieve(initialVersion.id);

      // Link the ContentDocumentId to the record
      const result = await bambooUserConnection
        .sobject("ContentDocumentLink")
        .create({
          ContentDocumentId: contentVersion.ContentDocumentId,
          LinkedEntityId: parentRecord.recordId,
          ShareType: "V",
        });

      if (!result.success)
        throw new Error(
          `Failed to create document ${payload.name} for loadId ${payload.loadId}`
        );
    }

    return;
  }
}

export { AttachmentLoader, FilePayload };
