import { ProjectStatus } from "@framework/constants";
import { getProjectStatus } from "./projectStatus";

describe("getProjectStatus", () => {
  test.each`
    projectStatus          | enumValue
    ${"Offer Letter Sent"} | ${ProjectStatus.OfferLetterSent}
    ${"Live"}              | ${ProjectStatus.Live}
    ${"On Hold"}           | ${ProjectStatus.OnHold}
    ${"Final Claim"}       | ${ProjectStatus.FinalClaim}
    ${"Closed"}            | ${ProjectStatus.Closed}
    ${"Terminated"}        | ${ProjectStatus.Terminated}
    ${"Other"}             | ${ProjectStatus.Unknown}
  `(
    "should convert $projectStatus to $enumValue",
    ({ projectStatus, enumValue }: { projectStatus: string; enumValue: ProjectStatus }) => {
      expect(getProjectStatus(projectStatus)).toEqual(enumValue);
    },
  );
});
