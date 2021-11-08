import { ProjectStatus } from "@framework/constants";
import { getIsProjectActive } from "@framework/util/projectHelper";

describe("isProjectActive", () => {
  test.each`
    name                      | status                                       | expectedIsActive
    ${"with Unknown"}         | ${{ status: ProjectStatus.Unknown }}         | ${true}
    ${"with OfferLetterSent"} | ${{ status: ProjectStatus.OfferLetterSent }} | ${true}
    ${"with Live"}            | ${{ status: ProjectStatus.Live }}            | ${true}
    ${"with OnHold"}          | ${{ status: ProjectStatus.OnHold }}          | ${false}
    ${"with FinalClaim"}      | ${{ status: ProjectStatus.FinalClaim }}      | ${true}
    ${"with Closed"}          | ${{ status: ProjectStatus.Closed }}          | ${false}
    ${"with Terminated"}      | ${{ status: ProjectStatus.Terminated }}      | ${false}
  `("$name", ({ status, expectedIsActive }) => {
    const isProjectActive = getIsProjectActive(status);
    expect(isProjectActive).toBe(expectedIsActive);
  });
});
