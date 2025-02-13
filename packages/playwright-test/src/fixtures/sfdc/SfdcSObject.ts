import { Fixture, Then, When } from "playwright-bdd/decorators";
import { SfdcApi } from "./SfdcApi";
import { ProjectState } from "../projectFactory/ProjectState";
import { AbstractSObject } from "@innovateuk/project-factory-two/sobjects/AbstractProjectFactory";
import { DataTable } from "playwright-bdd";
import { DatabaseConnector } from "@innovateuk/project-factory-two/database/DatabaseConnector";

export
@Fixture("sfdcSObject")
class SfdcSObject {
  protected readonly sfdcApi: SfdcApi;
  protected projectState: ProjectState | null;

  constructor({ projectState, sfdcApi }: { projectState: ProjectState; sfdcApi: SfdcApi }) {
    this.sfdcApi = sfdcApi;
    this.projectState = projectState;
  }

  static create({ projectState, sfdcApi }: { projectState: ProjectState; sfdcApi: SfdcApi }, use) {
    use(new SfdcSObject({ projectState, sfdcApi }));
  }

  @Then("the SObject {string} should now match data")
  async sobjectMatcher(label: string, table: DataTable) {
    const sobject = this.projectState.context[label];
    if (!(sobject instanceof AbstractSObject)) throw new Error(`${label} does not extend AbstractSObject`);
    if (typeof sobject.Id !== "string") throw new Error(`SObject ${label} does not have an existing Id`);

    const rows = table.rows();
    const fields = rows.map(([x]) => x);
    const connection = await this.sfdcApi.getTsforceConnection();
    const data = await connection.executeSOQL<Record<string, unknown>>({
      query: `SELECT ${fields} FROM ${sobject.sobject} WHERE Id = '${sobject.Id}'`,
    });

    const record = data.records[0];

    if (!record) throw new Error("SObject does not exist in Salesforce");

    const nonMatchingValues: { key: string; expected: string; actual: string }[] = [];

    for (const [key, value] of rows) {
      const actual = String(record[key]);
      const expected = value;
      if (actual !== expected) nonMatchingValues.push({ key, expected, actual });
    }

    if (nonMatchingValues.length) {
      throw new Error(
        `SObject ${label} does not match expected values\n\n${nonMatchingValues
          .map(({ key, actual, expected }) => `${key}: expected "${expected}", received "${actual}"`)
          .join("\n")}`,
      );
    }
  }

  @When("the SObject {string} is updated with data")
  async sobjectWriter(label: string, table: DataTable) {
    const sobject = this.projectState.context[label];
    if (!(sobject instanceof AbstractSObject)) throw new Error(`${label} does not extend AbstractSObject`);
    if (typeof sobject.Id !== "string") throw new Error(`SObject ${label} does not have an existing Id`);

    const rows = table.rows();
    const connection = await this.sfdcApi.getTsforceConnection();

    for (const [key, value] of rows) {
      sobject[key] = value;
    }

    const Database = new DatabaseConnector({ connection });
    return Database.update(sobject);
  }
}
