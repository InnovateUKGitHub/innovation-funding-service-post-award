import { TestBed, TestBedStore } from "@shared/TestBed";

import { createPartnerDto } from "@framework/util/stubDtos";
import { PartnerDto } from "@framework/dtos";
import { Pending } from "@shared/pending";
import { renderHook } from "@testing-library/react-hooks";
import { ProjectParticipantProvider, useProjectParticipants } from "@ui/features/project-participants";
import { LoadingStatus } from "@framework/constants";
import { noop } from "@ui/helpers/noop";

describe("useProjectParticipants", () => {
  const setup = (stubProjectId: string | undefined, stubParterQuery: Pending<PartnerDto[] | undefined>) => {
    const stubStore = {
      partners: {
        getPartnersForProject: jest.fn().mockReturnValue(stubParterQuery),
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
    const stubProjectId = "stub-project-id";

    const stubDefinedPartner = createPartnerDto();
    const stubSinglePartner = [stubDefinedPartner];
    const stubMultiplePartners = [stubDefinedPartner, stubDefinedPartner];

    describe("with thrown errors", () => {
      // Note: RTL throws the error even though we catch it with 'results.error' this removes the console.warn cli noise
      const consoleSpy = jest.spyOn(console, "error");
      consoleSpy.mockImplementation(noop);

      afterEach(consoleSpy.mockRestore);

      const stubErrorMessage = "stub-error";

      test("with non specific error message", () => {
        const failedQuery = new Pending(LoadingStatus.Failed, undefined, stubErrorMessage);

        const { result } = setup(stubProjectId, failedQuery);

        expect(result.error).toEqual(new Error("There was an error fetching data within useGetProjectParticipants"));
      });

      test("with no error", () => {
        const failedQuery = new Pending(LoadingStatus.Failed, undefined, undefined);

        const { result } = setup(stubProjectId, failedQuery);

        expect(result.error).toEqual(new Error("There was an error fetching data within useGetProjectParticipants"));
      });

      test("with thrown error", () => {
        const stubError = new Error(stubErrorMessage);
        const failedQuery = new Pending(LoadingStatus.Failed, undefined, stubError);

        const { result } = setup(stubProjectId, failedQuery);

        expect(result.error).toEqual(stubError);
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