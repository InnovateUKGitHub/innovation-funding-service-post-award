import { fireEvent, render, act } from "@testing-library/react";
import TestBed, { TestBedStore } from "@shared/TestBed";
import { PcrStepProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { Pending } from "@shared/pending";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { AcademicOrganisationStep } from "./academicOrganisationStep";

describe("<AcademicOrganisationStep />", () => {
  const stubProps = {
    // TODO implement as necessary
  } as PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>;

  const getJesStub = jest.fn();

  const setup = (
    props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
    isServer?: boolean,
  ) => {
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
    };

    return render(
      <TestBed isServer={isServer} stores={stubStore as unknown as TestBedStore}>
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
