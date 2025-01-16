// const data = {
//   id: "a0GAd000003pEyTMAU",
//   projectId: "a0EAd00000228uoMAA",
//   items: [
//     {
//       id: "a0GAd000003pF05MAE",
//       tsbReference: "",
//       button_submit: "submit",
//       type: 20,
//       spendProfile: {
//         pcrItemId: "a0GAd000003pF05MAE",
//         costs: [
//           {
//             value: 100,
//             costCategoryId: "a0626000007qoT1AAI",
//             id: "",
//             description: "Directly incurred - Staff",
//             costCategory: 2,
//           },
//           {
//             value: 101,
//             costCategoryId: "a0626000007qoT2AAI",
//             id: "",
//             description: "Directly incurred - Travel and subsistence",
//             costCategory: 2,
//           },
//           {
//             value: 102,
//             costCategoryId: "a0626000007qoT3AAI",
//             id: "",
//             description: "Directly incurred - Equipment",
//             costCategory: 2,
//           },
//           {
//             value: 103,
//             costCategoryId: "a0626000007qoT4AAI",
//             id: "",
//             description: "Directly incurred - Other costs",
//             costCategory: 2,
//           },
//           {
//             value: 104,
//             costCategoryId: "a0626000007qoT5AAI",
//             id: "",
//             description: "Directly allocated - Investigations",
//             costCategory: 2,
//           },
//           {
//             value: 105,
//             costCategoryId: "a0626000007qoT6AAI",
//             id: "",
//             description: "Directly allocated - Estates costs",
//             costCategory: 2,
//           },
//           {
//             value: 106,
//             costCategoryId: "a0626000007qoT7AAI",
//             id: "",
//             description: "Directly allocated - Other costs",
//             costCategory: 2,
//           },
//           {
//             value: 107,
//             costCategoryId: "a0626000007qoQpAAI",
//             id: "",
//             description: "Indirect costs - Investigations",
//             costCategory: 2,
//           },
//           {
//             value: 108,
//             costCategoryId: "a0626000007qoQqAAI",
//             id: "",
//             description: "Exceptions - Staff",
//             costCategory: 2,
//           },
//           {
//             value: 109,
//             costCategoryId: "a0626000007qoQrAAI",
//             id: "",
//             description: "Exceptions - Travel and subsistence",
//             costCategory: 2,
//           },
//           {
//             value: 110,
//             costCategoryId: "a0626000007qoQsAAI",
//             id: "",
//             description: "Exceptions - Equipment",
//             costCategory: 2,
//           },
//           {
//             value: 111,
//             costCategoryId: "a0626000007qoQtAAI",
//             id: "",
//             description: "Exceptions - Other costs",
//             costCategory: 2,
//           },
//         ],
//         funds: [],
//       },
//       status: 2,
//     },
//   ],
// };

import { useNavigate } from "react-router-dom";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { useMessageContext } from "@ui/context/messages";
import { z } from "zod";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { AcademicCostsSchemaType } from "./schemas/academicCosts.zod";

export const useOnUpdateAddPartnerAcademicCosts = () => {
  const navigate = useNavigate();

  const { setFetchKey, pcrId, itemId, projectId, step } = usePcrWorkflowContext();
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<AcademicCostsSchemaType>, boolean, { link: ILinkInfo }>({
    req: data =>
      clientsideApiClient.pcrs.addPartnerAcademicCosts({
        projectId,
        pcrId,
        pcrItemId: itemId,
        pcr: {
          ...data,
          form: data.form,
          tsbReference: data.tsbReference,
          costs: data.costs,
          ...(typeof step === "number" ? { status: PCRItemStatus.Incomplete } : {}),
        },
      }),
    onSuccess: async function (
      _: z.output<AcademicCostsSchemaType>,
      __: boolean,
      context: { link: ILinkInfo } | undefined,
    ) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
