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
import { TestBed } from "@shared/TestBed";
import { LoadingStatus } from "@framework/constants";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";
import { CopyNamespaces } from "@copy/data";

const projectId = "test-id";

const stubContent = {
  pages: {
    editClaimLineItems: {
      backLink: "stub-backLink",
      headerDescription: "stub-headerDescription",
      headerLastUpdated: "stub-headerLastUpdated",
      headerCost: "stub-headerCost",
      headerAction: "stub-headerAction",
      buttonSaveAndReturn: "stub-buttonSaveAndReturn",
      headerAdditionalInformation: "stub-headerAdditionalInformation",
      headerSupportingDocuments: "stub-headerSupportingDocuments",
      buttonUploadAndRemoveDocuments: "stub-buttonUploadAndRemoveDocuments",
      hintAdditionalInformation: "stub-hintAdditionalInformation",
      buttonRemove: "stub-buttonRemove",
      noData: "stub-noData",
      totalCosts: "stub-totalCosts",
      forecastCosts: "stub-forecastCosts",
      difference: "stub-difference",
      addCost: "stub-addCost",
      additionalInfo: "stub-additionalInfo",
      setToZeroToRemove: "stub-setToZeroToRemove",
    },
  },
  claimsMessages: {
    editClaimLineItemDocumentGuidance: "stub-editClaimLineItemDocumentGuidance",
    negativeClaimWarning: "stub-negativeClaimWarning",
    editClaimLineItemGuidance: "stub-editClaimLineItemGuidance",
    editClaimLineItemConvertGbp: "stub-editClaimLineItemCurrencyGbp",
    nonjsEditClaimLineItemConvertGbp: "stub-nonJsEditClaimLineItemCurrencyGbp",
    editClaimLineItemOtherCostsTotalCosts: "stub-editClaimLineItemOtherCostsTotal",
  },
  documentLabels: {
    documentDisplayTitle: "stub-documentDisplayTitle",
    documentDisplaySubTitle: "stub-documentDisplaySubTitle",
  },
  documentMessages: {
    noDocumentsUploaded: "stub-noDocumentsUploaded",
  },
};

const stubSbriContent = {
  pages: {
    editClaimLineItems: {
      sbriHintAdditionalInformation: "stub-sbriHintAdditionalInformation",
    },
  },
  claimsMessages: {
    editClaimLineItemContactMo: "stub-editClaimLineItemContactMo",
    editClaimLineItemUploadEvidence: "stub-editClaimLineItemUploadEvidence",
    editClaimLineItemClaimDocuments: "stub-editClaimLineItemClaimDocuments",
  },
};

const stubBaseProps = {
  routes: {
    prepareClaim: {
      getLink: jest.fn().mockReturnValue({
        routeName: "test",
        routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/costs/:costCategoryId",
        path: "/projects/123/claims/abcde/prepare/1/costs/4",
        projectId: "123",
        partnerId: "abcde",
        periodId: "1",
        costCategoryId: "4",
      }),
    },
  },
} as unknown as Partial<BaseProps>;

const stubProps = {
  ...stubBaseProps,
  project: {
    data: { id: projectId } as Partial<ProjectDto>,
    state: LoadingStatus.Done,
  } as Pending<ProjectDto>,
  claimOverrides: {
    data: {},
    state: LoadingStatus.Done,
  },
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
  },
  forecastDetail: {
    data: {},
    state: LoadingStatus.Done,
  } as Pending<ForecastDetailsDTO>,
  documents: {
    data: {},
    state: LoadingStatus.Done,
  } as Pending<DocumentSummaryDto[]>,
} as unknown as ContainerProps<EditClaimDetailsParams, EditClaimLineItemsData, EditClaimLineItemsCallbacks>;

describe("editClaimLineItems", () => {
  const setup = (
    props: ContainerProps<EditClaimDetailsParams, EditClaimLineItemsData, EditClaimLineItemsCallbacks>,
    isServer?: boolean,
  ) =>
    render(
      <TestBed competitionType={props.project.data?.competitionType} isServer={isServer}>
        <EditClaimLineItemsComponent {...props} />
      </TestBed>,
    );

  beforeAll(async () => {
    await testInitialiseInternationalisation(stubContent, {
      [CopyNamespaces.SBRI]: stubSbriContent,
      [CopyNamespaces.SBRI_IFS]: stubSbriContent,
    });
  });

  describe("@renders", () => {
    describe("@content solution", () => {
      test("with editClaimLineItemCurrencyGbp", () => {
        const stubMessage = stubContent.claimsMessages.editClaimLineItemConvertGbp;
        const { queryByText } = setup(stubProps, false);

        expect(queryByText(stubMessage)).toBeInTheDocument();
      });

      test("with nonJsEditClaimLineItemCurrencyGbp", () => {
        const stubMessage = stubContent.claimsMessages.nonjsEditClaimLineItemConvertGbp;
        const { queryByText } = setup(stubProps, true);

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
      const uploadAndRemoveDocumentsButton = stubContent.pages.editClaimLineItems.buttonUploadAndRemoveDocuments;
      const additionalInformationHeading = stubContent.pages.editClaimLineItems.headerAdditionalInformation;
      const additionalInfo = stubContent.pages.editClaimLineItems.additionalInfo;
      const additionalInformationHint = stubContent.pages.editClaimLineItems.hintAdditionalInformation;
      const { queryByText } = setup(stubKtpProps);

      expect(queryByText(uploadAndRemoveDocumentsButton)).not.toBeInTheDocument();
      expect(queryByText(additionalInformationHeading)).not.toBeInTheDocument();
      expect(queryByText(additionalInfo)).not.toBeInTheDocument();
      expect(queryByText(additionalInformationHint)).not.toBeInTheDocument();
    });

    describe("with sbri content", () => {
      test.each`
        name                                  | competitionType
        ${"with 'SBRI' competition type"}     | ${"SBRI"}
        ${"with 'SBRI IFS' competition type"} | ${"SBRI IFS"}
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

        const sbriAdditionalInformationHint = stubSbriContent.pages.editClaimLineItems.sbriHintAdditionalInformation;
        const editClaimLineItemContactMo = stubSbriContent.claimsMessages.editClaimLineItemContactMo;
        const editClaimLineItemUploadEvidence = stubSbriContent.claimsMessages.editClaimLineItemUploadEvidence;
        const editClaimLineItemClaimDocuments = stubSbriContent.claimsMessages.editClaimLineItemClaimDocuments;

        expect(queryByText(sbriAdditionalInformationHint)).toBeInTheDocument();
        expect(queryByText(editClaimLineItemContactMo)).toBeInTheDocument();
        expect(queryByText(editClaimLineItemUploadEvidence)).toBeInTheDocument();
        expect(queryByText(editClaimLineItemClaimDocuments)).toBeInTheDocument();
      });
    });
  });
});
