import React from "react";
import { render } from "@testing-library/react";
import { Callbacks, Data, EditClaimDetailsParams, EditClaimLineItemsComponent } from "@ui/containers";
import { BaseProps, ContainerProps } from "@ui/containers/containerBase";
import { LoadingStatus, Pending } from "@shared/pending";
import { ClaimDetailsDto, DocumentSummaryDto, ForecastDetailsDTO, ProjectDto } from "@framework/dtos";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { IEditorStore } from "@ui/redux";
import { ClaimDetailsValidator } from "@ui/validators";
import { TestBed, TestBedContent } from "@shared/TestBed";

const projectId = "test-id";

const contentStub = {
  claimDocuments: {
    messages: {
      editClaimLineItemCurrencyGbp: {
        content: "stub-editClaimLineItemCurrencyGbp",
      },
    },
  },
} as TestBedContent;

const stubBaseProps = {
    routes: {
        prepareClaim: {
            getLink: jest.fn()
        }
    } as any
} as Partial<BaseProps>;

const stubProps = {
  project: {
    data: { id: projectId } as Partial<ProjectDto>,
    state: LoadingStatus.Done,
  } as Pending<ProjectDto>,
  claimDetails: {
    data: {},
    state: LoadingStatus.Done,
  } as Pending<ClaimDetailsDto>,
  costCategories: {
    data: {
    },
    state: LoadingStatus.Done,
  } as Pending<CostCategoryDto[]>,
  editor: {
    data: {},
    state: LoadingStatus.Done,
  } as Pending<IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>>,
  forecastDetail: {
    data: {},
    state: LoadingStatus.Done,
  } as Pending<ForecastDetailsDTO>,
  documents: {
    data: {},
    state: LoadingStatus.Done,
  } as Pending<DocumentSummaryDto[]>,
  ...stubBaseProps,
} as ContainerProps<EditClaimDetailsParams, Data, Callbacks>;

describe("editClaimLineItems", () => {
  describe("@renders", () => {
    test("the correct currency conversion text", () => {
      const { queryByTestId } = render(
        <TestBed content={contentStub}>
          <EditClaimLineItemsComponent {...stubProps} />
        </TestBed>,
      );

      expect(queryByTestId("guidance-currency-message")).toBeDefined();
    });
  });
});
