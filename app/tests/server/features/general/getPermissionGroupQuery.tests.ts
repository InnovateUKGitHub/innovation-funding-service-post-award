import { TestContext } from "../../testContextProvider";
import { GetPermissionGroupQuery } from "@server/features/general/getPermissionGroupsQuery";
import { BadRequestError } from "@server/features/common";
import { PermissionGroupIdenfifier } from "@framework/types/permisionGroupIndentifier";

describe("GetPermissionGroupQuery", () => {
  it("returns error if asking for unknown group", async () => {
    const context = new TestContext();

    const query = new GetPermissionGroupQuery(PermissionGroupIdenfifier.Unknown);

    await expect(context.runQuery(query)).rejects.toThrow(BadRequestError);
  });

  it("returns error if group not found", async () => {
    const context = new TestContext();

    context.repositories.permissionGroups.Items = [
      { id: "Unknown ID", identifier: 22, name: "TEST NAME" }
    ];

    const query = new GetPermissionGroupQuery(PermissionGroupIdenfifier.ClaimsTeam);

    await expect(context.runQuery(query)).rejects.toThrow(BadRequestError);
  });

  it("returns item if found", async () => {
    const context = new TestContext();

    const query = new GetPermissionGroupQuery(PermissionGroupIdenfifier.ClaimsTeam);

    const result = await context.runQuery(query);

    expect(result.id).toBe(context.repositories.permissionGroups.Items[0].id);
    expect(result.identifier).toBe(PermissionGroupIdenfifier.ClaimsTeam);
  });

});
