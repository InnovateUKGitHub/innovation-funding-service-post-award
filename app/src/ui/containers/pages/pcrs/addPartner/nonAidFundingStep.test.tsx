import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { PCRDto, PCRItemForPartnerAdditionDto, PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { ProjectDto } from "@framework/dtos/projectDto";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import TestBed from "@shared/TestBed";
import { fireEvent, render } from "@testing-library/react";
import { EditorStatus } from "@ui/redux/constants/enums";
import { PcrStepProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { IRoutes } from "@ui/routing/routeConfig";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { NonAidFundingStep } from "./nonAidFundingStep";

describe("<NonAidFundingStep />", () => {
  type TestProps = PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>;

  const stubProps = {
    project: {
      competitionType: "KTP",
    } as ProjectDto,
    pcr: {} as PCRDto,
    pcrItem: {} as PCRItemForPartnerAdditionDto,
    pcrItemType: {} as PCRItemTypeDto,
    documentsEditor: {} as IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>,
    validator: {} as PCRPartnerAdditionItemDtoValidator,
    status: {} as EditorStatus,
    onChange: jest.fn(),
    getRequiredToCompleteMessage: jest.fn(),
    routes: {} as IRoutes,
    mode: "prepare",
    onSave: jest.fn(),
  } as TestProps;

  const stubContent = {
    pages: {
      pcrAddPartnerStateAidEligibility: {
        formSectionTitleNonAidFunding: "Non aid funding",
        guidanceNonAidFunding: "This screen is extremely relevant.",
      },
    },
    pcrItem: {
      submitButton: "stub-submitButton",
      returnToSummaryButton: "stub-returnToSummaryButton",
    },
  };

  const setup = (props: TestProps, isServer?: boolean) => {
    return render(
      <TestBed isServer={isServer}>
        <NonAidFundingStep {...props} />
      </TestBed>,
    );
  };

  beforeEach(jest.clearAllMocks);

  beforeAll(async () => {
    await initStubTestIntl(stubContent);
  });

  describe("@returns", () => {
    test("as default", () => {
      const { queryByTestId, getByText } = setup(stubProps);
      const form = queryByTestId("saveAndContinue");
      const saveAndContinueButton = getByText("stub-submitButton");
      const saveAndReturn = getByText("stub-returnToSummaryButton");
      const content = getByText("This screen is extremely relevant.");

      expect(form).toBeInTheDocument();
      expect(saveAndContinueButton).toBeInTheDocument();
      expect(saveAndReturn).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    test("with validation UI", () => {
      const { queryByTestId } = setup(stubProps);
      const validationInfoElement = queryByTestId("validation-message");

      expect(validationInfoElement).toBeInTheDocument();
    });

    test("with default paragraph", () => {
      const defaultContent = { ...stubProps, project: { ...stubProps.project, competitionType: "CR&D" } };

      const { queryByTestId } = setup(defaultContent);
      const validationInfoElement = queryByTestId("validation-message");

      expect(validationInfoElement).not.toBeInTheDocument();
    });

    describe("actions", () => {
      test('"Save and Continue" btn should call the onSave action', () => {
        clickButton("stub-submitButton");
        expect(stubProps.onSave).toHaveBeenCalledTimes(1);
        expect(stubProps.onSave).toHaveBeenCalledWith(false);
      });

      test('"Save and Return to Summary" btn should call the onSubmit action', () => {
        clickButton("stub-returnToSummaryButton");
        expect(stubProps.onSave).toHaveBeenCalledTimes(1);
        expect(stubProps.onSave).toHaveBeenCalledWith(true);
      });
    });
  });

  /**
   * click button helper
   */
  function clickButton(text: string) {
    const { getByText } = setup(stubProps);
    const btn = getByText(text);
    fireEvent.click(btn);
  }
});