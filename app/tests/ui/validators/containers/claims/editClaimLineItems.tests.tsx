import { render } from "@testing-library/react";
import {
  EditClaimDetailsParams,
  EditClaimLineItemsCallbacks,
  EditClaimLineItemsComponent,
  EditClaimLineItemsData,
} from "@ui/containers";
import { BaseProps, ContainerProps } from "@ui/containers/containerBase";
import { Pending } from "@shared/pending";
import { ClaimDetailsDto, DocumentSummaryDto, ForecastDetailsDTO, ProjectDto } from "@framework/dtos";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { TestBed, TestBedContent } from "@shared/TestBed";
import { LoadingStatus } from "@framework/constants";

const projectId = "test-id";

const contentStub = {
  editClaimLineItems: {
    saveAndReturnButton: { content: "stub-saveAndReturnButton" },
    backLink: { content: "stub-backLink" },
    descriptionHeader: { content: "stub-descriptionHeader" },
    lastUpdatedHeader: { content: "stub-lastUpdatedHeader" },
    costHeader: { content: "stub-costHeader" },
    uploadAndRemoveDocumentsButton: { content: "stub-uploadAndRemoveDocumentsButton" },
    additionalInformationHeading: { content: "stub-additionalInformationHeading" },
    additionalInfo: { content: "stub-additionalInfo" },
    additionalInformationHint: { content: "stub-additionalInformationHint" },
    sbriAdditionalInformationHint: { content: "stub-sbriAdditionalInformationHint" },
    actionHeader: { content: "stub-actionHeader" },
    supportingDocumentsHeader: { content: "stub-supportingDocumentsHeader" },
    totalCosts: { content: "stub-totalCosts" },
    noData: { content: "stub-noData" },
    addCost: { content: "stub-addCost" },
    forecastCosts: { content: "stub-forecastCosts" },
    difference: { content: "stub-difference" },
    messages: {
      editClaimLineItemDocumentGuidance: { content: "stub-editClaimLineItemDocumentGuidance" },
      negativeClaimWarning: { content: "stub-negativeClaimWarning" },
      editClaimLineItemContactMo: { content: "stub-editClaimLineItemContactMo" },
      editClaimLineItemUploadEvidence: { content: "stub-editClaimLineItemUploadEvidence" },
      editClaimLineItemClaimDocuments: { content: "stub-editClaimLineItemClaimDocuments" },
    },
    documentLabels: {
      documentDisplayTitle: { content: "stub-documentDisplayTitle" },
    },
    documentMessages: {
      noDocumentsUploaded: { content: "stub-noDocumentsUploaded" },
    },
  },
  claimDocuments: {
    messages: {
      editClaimLineItemGuidance: {
        content: "stub-editClaimLineItemGuidance",
      },
      editClaimLineItemCurrencyGbp: {
        content: "stub-editClaimLineItemCurrencyGbp",
      },
      nonJsEditClaimLineItemCurrencyGbp: {
        content: "stub-nonJsEditClaimLineItemCurrencyGbp",
      },
      editClaimLineItemOtherCostsTotal: {
        content: "stub-editClaimLineItemOtherCostsTotal",
      },
    },
  },
  components: {
    documents: {
      labels: {
        documentDisplayTitle: { content: "stub-documentDisplayTitle" },
        documentDisplaySubTitle: { content: "stub-documentDisplaySubTitle" },
      },
      messages: {
        noDocumentsUploaded: { content: "stub-noDocumentsUploaded" },
      },
    },
    projectInactiveContent: {
      projectInactiveMessage: { content: "stub-projectInactiveMessage"}
    }
  },
} as any;

const stubBaseProps = {
  routes: {
    prepareClaim: {
      getLink: jest.fn().mockReturnValue({
        routeName: "test",
      }),
    },
  } as any,
} as Partial<BaseProps>;

const stubProps = {
  ...stubBaseProps,
  project: {
    data: { id: projectId } as Partial<ProjectDto>,
    state: LoadingStatus.Done,
  } as Pending<ProjectDto>,
  claimDetails: {
    data: {},
    state: LoadingStatus.Done,
  } as Pending<ClaimDetailsDto>,
  costCategories: {
    data: [{}],
    state: LoadingStatus.Done,
  } as Pending<CostCategoryDto[]>,
  editor: {
    data: {
      data: { lineItems: [] },
      validator: {
        items: {
          results: undefined,
        },
      },
    },
    state: LoadingStatus.Done,
  } as any,
  forecastDetail: {
    data: {},
    state: LoadingStatus.Done,
  } as Pending<ForecastDetailsDTO>,
  documents: {
    data: {},
    state: LoadingStatus.Done,
  } as Pending<DocumentSummaryDto[]>,
  isClient: true
} as ContainerProps<EditClaimDetailsParams, EditClaimLineItemsData, EditClaimLineItemsCallbacks>;

describe("editClaimLineItems", () => {
  const setup = (
    props: ContainerProps<EditClaimDetailsParams, EditClaimLineItemsData, EditClaimLineItemsCallbacks>,
  ) => {
    return render(
      <TestBed content={contentStub as TestBedContent}>
        <EditClaimLineItemsComponent {...props} />
      </TestBed>,
    );
  };

  describe("@renders", () => {
    describe("@content solution", () => {
      test("with editClaimLineItemCurrencyGbp", () => {
        const stubMessage = contentStub.claimDocuments.messages.editClaimLineItemCurrencyGbp.content;
        const { queryByText } = setup(stubProps);

        expect(queryByText(stubMessage)).toBeInTheDocument();
      });

      test("with nonJsEditClaimLineItemCurrencyGbp", () => {
        const stubMessage = contentStub.claimDocuments.messages.nonJsEditClaimLineItemCurrencyGbp.content;
        const { queryByText } = setup({ ...stubProps, isClient: false });

        expect(queryByText(stubMessage)).toBeInTheDocument();
      });
    });
  });

  describe("render competitionType contents", () => {
    test("with ktp competitionType", () => {
      const stubKtpProps = {
        ...stubProps,
        project: {
          ...stubProps.project,
          data: {
            ...stubProps.project.data,
            competitionType: "KTP",
          } as Partial<ProjectDto>,
        } as Pending<ProjectDto>,
      };
      const uploadAndRemoveDocumentsButton = contentStub.editClaimLineItems.uploadAndRemoveDocumentsButton.content;
      const additionalInformationHeading = contentStub.editClaimLineItems.additionalInformationHeading.content;
      const additionalInfo = contentStub.editClaimLineItems.additionalInfo.content;
      const additionalInformationHint = contentStub.editClaimLineItems.additionalInformationHint.content;
      const { queryByText } = setup(stubKtpProps);

      expect(queryByText(uploadAndRemoveDocumentsButton)).not.toBeInTheDocument();
      expect(queryByText(additionalInformationHeading)).not.toBeInTheDocument();
      expect(queryByText(additionalInfo)).not.toBeInTheDocument();
      expect(queryByText(additionalInformationHint)).not.toBeInTheDocument();
    });

    describe("with sbri content", () => {
      test.each`
        name                                 | competitionType
        ${"with 'SBRI' competition type"}    | ${"SBRI"}
        ${"with 'SBRI IFS' competiton type"} | ${"SBRI IFS"}
      `("$name", ({ competitionType }) => {
        const stubSbriProps = {
          ...stubProps,
          project: {
            ...stubProps.project,
            data: {
              ...stubProps.project.data,
              competitionType,
            } as Partial<ProjectDto>,
          } as Pending<ProjectDto>,
        };
        const { queryByText } = setup(stubSbriProps);

        const sbriAdditionalInformationHint = contentStub.editClaimLineItems.sbriAdditionalInformationHint.content;
        const editClaimLineItemContactMo = contentStub.editClaimLineItems.messages.editClaimLineItemContactMo.content;
        const editClaimLineItemUploadEvidence =
          contentStub.editClaimLineItems.messages.editClaimLineItemUploadEvidence.content;
        const editClaimLineItemClaimDocuments =
          contentStub.editClaimLineItems.messages.editClaimLineItemClaimDocuments.content;

        expect(queryByText(sbriAdditionalInformationHint)).toBeInTheDocument();
        expect(queryByText(editClaimLineItemContactMo)).toBeInTheDocument();
        expect(queryByText(editClaimLineItemUploadEvidence)).toBeInTheDocument();
        expect(queryByText(editClaimLineItemClaimDocuments)).toBeInTheDocument();
      });
    });
  });
});
