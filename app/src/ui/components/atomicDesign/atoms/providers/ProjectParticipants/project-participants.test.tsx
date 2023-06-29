import { TestBed, TestBedStore } from "@shared/TestBed";
import { createPartnerDto } from "@framework/util/stubDtos";
import { Pending } from "@shared/pending";
import { renderHook } from "@testing-library/react";
import {
  ProjectParticipantProvider,
  useProjectParticipants,
} from "@ui/components/atomicDesign/atoms/providers/ProjectParticipants/project-participants";
import { noop } from "@ui/helpers/noop";
import { LoadingStatus } from "@framework/constants/enums";
import { PartnerDto } from "@framework/dtos/partnerDto";

describe("useProjectParticipants", () => {
  const setup = (stubProjectId: ProjectId | undefined, stubPartnerQuery: Pending<PartnerDto[] | undefined>) => {
    const stubStore = {
      partners: {
        getPartnersForProject: jest.fn().mockReturnValue(stubPartnerQuery),
      } as Extract<TestBedStore["partners"], "getPartnersForProject">,
    } as TestBedStore;

    return renderHook(useProjectParticipants, {
      wrapper: x => (
        <TestBed stores={stubStore}>
          <ProjectParticipantProvider projectId={stubProjectId}>
            <>{x.children}</>
          </ProjectParticipantProvider>
        </TestBed>
      ),
    });
  };

  describe("@returns", () => {
    const stubProjectId = "stub-project-id" as ProjectId;

    const stubDefinedPartner = createPartnerDto();
    const stubSinglePartner = [stubDefinedPartner];
    const stubMultiplePartners = [stubDefinedPartner, stubDefinedPartner];

    describe("with thrown errors", () => {
      // Note: RTL throws the error even though we catch it with the jest expect. This removes the console.error cli noise
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(noop);

      afterAll(consoleSpy.mockRestore);

      const stubErrorMessage = "stub-error";

      test("with non specific error message", () => {
        const failedQuery = new Pending(LoadingStatus.Failed, undefined, stubErrorMessage);

        expect(() => setup(stubProjectId, failedQuery)).toThrowError(
          "There was an error fetching data within useGetProjectParticipants",
        );
      });

      test("with no error", () => {
        const failedQuery = new Pending(LoadingStatus.Failed, undefined, undefined);

        expect(() => setup(stubProjectId, failedQuery)).toThrowError(
          "There was an error fetching data within useGetProjectParticipants",
        );
      });

      test("with thrown error", () => {
        const stubError = new Error(stubErrorMessage);
        const failedQuery = new Pending(LoadingStatus.Failed, undefined, stubError);

        expect(() => setup(stubProjectId, failedQuery)).toThrowError(stubErrorMessage);
      });
    });

    test("with loading query (unresolved data)", () => {
      const loadingQuery = new Pending(LoadingStatus.Loading, undefined);

      const { result } = setup(stubProjectId, loadingQuery);

      const noProjectIdPayload = result.current;

      expect(noProjectIdPayload.totalParticipants).toBe(-1);
      expect(noProjectIdPayload.isSingleParticipant).toBe(false);
      expect(noProjectIdPayload.isMultipleParticipants).toBe(false);
    });

    test("with resolved query with no data", () => {
      const resolvedNoData = new Pending(LoadingStatus.Done, undefined);

      const { result } = setup(undefined, resolvedNoData);

      const noProjectIdPayload = result.current;

      expect(noProjectIdPayload.totalParticipants).toBe(-1);
      expect(noProjectIdPayload.isSingleParticipant).toBe(false);
      expect(noProjectIdPayload.isMultipleParticipants).toBe(false);
    });

    test("without project id", () => {
      const partnerQuery = Pending.done<PartnerDto[]>(stubSinglePartner);

      const { result } = setup(undefined, partnerQuery);

      const noProjectIdPayload = result.current;

      expect(noProjectIdPayload.totalParticipants).toBe(-1);
      expect(noProjectIdPayload.isSingleParticipant).toBe(false);
      expect(noProjectIdPayload.isMultipleParticipants).toBe(false);
    });

    test("with single partner", () => {
      const partnerQuery = Pending.done<PartnerDto[]>(stubSinglePartner);
      const { result } = setup(stubProjectId, partnerQuery);

      const projectIdPayload = result.current;

      expect(projectIdPayload.totalParticipants).toBe(1);
      expect(projectIdPayload.isSingleParticipant).toBe(true);
      expect(projectIdPayload.isMultipleParticipants).toBe(false);
    });

    test("with multiple partners", () => {
      const partnerQuery = Pending.done<PartnerDto[]>(stubMultiplePartners);
      const { result } = setup(stubProjectId, partnerQuery);

      const projectIdPayload = result.current;

      expect(projectIdPayload.totalParticipants).toBe(2);
      expect(projectIdPayload.isSingleParticipant).toBe(false);
      expect(projectIdPayload.isMultipleParticipants).toBe(true);
    });
  });
});
