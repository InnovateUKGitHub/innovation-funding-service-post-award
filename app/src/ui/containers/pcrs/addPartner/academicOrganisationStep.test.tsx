import { fireEvent, render, act } from "@testing-library/react";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import TestBed, { TestBedContent, TestBedStore } from "@shared/TestBed";
import { AcademicOrganisationStep } from "@ui/containers/pcrs/addPartner";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { Pending } from "@shared/pending";

describe("<AcademicOrganisationStep />", () => {
  const stubProps = {
    // TODO implement as necessary
  } as PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>;

  const getJesStub = jest.fn();

  const setup = (
    props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
    isServer?: boolean,
  ) => {
    const stubContent = {
      pcrAddPartnerAcademicOrganisation: {
        labels: {
          searchButton: {
            content: "stub-search-button",
          },
          jesOrganisationSectionTitle: {
            content: "stub-jes-section-title",
          },
          jesOrganisationSectionSubtitle: {
            content: "stub-jes-section-subtitle",
          },
          jesOrganisationInfo: {
            content: "stub-jes-info",
          },
        },
        jesSearchResults: {
          content: "stub-jes-header",
        },
        pcrItem: {
          submitButton: {
            content: "stub-submit-button",
          },
          returnToSummaryButton: {
            content: "stub-return-to-summary-button",
          },
        },
      },
      pcrAddPartnerCompanyHouse: {
        resultNotShowing: {
          content: "stub-result-not-showing",
        },
      },
    } as any;

    const stubStore = {
      accounts: {
        getJesAccountsByName: getJesStub.mockReturnValue(
          Pending.done([
            {
              id: "stub-id",
              companyName: "stub-company-name",
              jesEnabled: true,
            },
          ]),
        ),
      },
    } as any;

    return render(
      <TestBed isServer={isServer} content={stubContent as TestBedContent} stores={stubStore as TestBedStore}>
        <AcademicOrganisationStep {...props} />
      </TestBed>,
    );
  };

  beforeEach(jest.clearAllMocks);

  describe("@returns", () => {
    test("as default", () => {
      const { queryByTestId } = setup(stubProps);
      const form = queryByTestId("addPartnerForm");
      const jesOrgInfo = queryByTestId("jes-organisation-info");
      const jesSearch = queryByTestId("input-search-jes-organisations");
      const jsDisabledSearchButton = queryByTestId("field-jesOrganisationSearch");
      const jesAccountsForm = queryByTestId("jes-accounts-form");
      const saveAndContinueButton = queryByTestId("save-and-continue");
      const saveAndReturn = queryByTestId("save-and-return-to-summary");

      expect(form).toBeInTheDocument();
      expect(jesOrgInfo).toBeInTheDocument();
      expect(jesSearch).toBeInTheDocument();
      expect(jsDisabledSearchButton).not.toBeInTheDocument();
      expect(jesAccountsForm).toBeInTheDocument();
      expect(saveAndContinueButton).toBeInTheDocument();
      expect(saveAndReturn).toBeInTheDocument();
    });

    describe("with js disabled", () => {
      test("should display search button", () => {
        const { queryByTestId } = setup(stubProps, true);

        const jsDisabledSearchButton = queryByTestId("button-search-jes-organisations");

        expect(jsDisabledSearchButton).toBeInTheDocument();
      });
    });

    test("search jes organisations", () => {
      jest.useFakeTimers();

      const { queryByTestId, getByTestId } = setup(stubProps);

      expect(queryByTestId("jesSearchResults")).not.toBeInTheDocument();

      const jesSearch = getByTestId("input-search-jes-organisations");

      act(() => {
        fireEvent.change(jesSearch, { target: { value: "test" } });
        jest.advanceTimersByTime(250);
      });

      expect(getByTestId("jesSearchResults")).toBeInTheDocument();
    });
  });
});
