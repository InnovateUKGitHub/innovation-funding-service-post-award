import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { mapToSalesforceCompetitionTypes } from "@framework/constants/competitionTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, CheckboxList } from "@ui/components/atoms/form/Checkbox/Checkbox";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { SubmitButton } from "@ui/components/atoms/form/SubmitButton/SubmitButton";
import { BackLink, Link } from "@ui/components/atoms/Links/links";
import { Content } from "@ui/components/molecules/Content/content";
import { Field } from "@ui/components/molecules/form/Field/Field";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { BaseProps } from "@ui/app/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/context/routesProvider";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  getPcrModifyTypesSchema,
  PcrCreateSchemaType,
  pcrModifyErrorMap,
  PcrModifyTypesSchemaType,
  PcrUpdateTypesSchemaType,
} from "@ui/zod/pcrValidator.zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PcrDisabledReasoning } from "../components/PcrDisabledReasoning/PcrDisabledReasoning";
import { useGetPcrItemMetadata } from "../utils/useGetPcrItemMetadata";
import { useOnSubmit, usePcrModifyOptionsQuery } from "./PcrModifyOptions.logic";
import { usePcrItemExclusivity, usePcrItemsForThisCompetition } from "../utils/usePcrItemsForThisCompetition";

interface PcrModifyParams {
  projectId: ProjectId;
}

interface PcrUpdateParams extends PcrModifyParams {
  pcrId: PcrId;
}
interface PcrBaseParams {
  projectId: ProjectId;
  pcrId?: PcrId;
}

const PcrModifyOptions = ({ projectId, pcrId }: PcrBaseParams & BaseProps) => {
  const routes = useRoutes();
  const { getContent } = useContent();
  const { getPcrItemContent } = useGetPcrItemMetadata();
  const { project, pcrs, numberOfPartners, fragmentRef } = usePcrModifyOptionsQuery({ projectId });
  const currentPcr = pcrs.find(x => x.id === pcrId);

  const visiblePcrItems = usePcrItemsForThisCompetition(
    mapToSalesforceCompetitionTypes(project.competitionType),
    pcrs,
    pcrId,
    numberOfPartners,
  );

  const { register, handleSubmit, setError, formState, getFieldState, watch, setValue } = useForm<
    z.output<PcrCreateSchemaType | PcrUpdateTypesSchemaType>
  >({
    resolver: zodResolver(
      getPcrModifyTypesSchema({
        pcrItemInfo: visiblePcrItems,
        numberOfPartners,
        currentPcrItems: currentPcr?.items ?? [],
      }),
      { errorMap: pcrModifyErrorMap },
    ),
    defaultValues: {
      form: pcrId ? FormTypes.ProjectChangeRequestUpdateTypes : FormTypes.ProjectChangeRequestCreate,
      projectId,
      pcrId: undefined,
      types: [],
    },
  });

  const { apiError, isFetching, onUpdate } = useOnSubmit({ projectId });

  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const allErrors = useZodErrors<z.output<PcrModifyTypesSchemaType>>(setError, formState.errors);
  const defaults = useServerInput<z.output<PcrModifyTypesSchemaType>>();

  const pcrItems = usePcrItemExclusivity(visiblePcrItems, watch("types"), setValue);

  const onChange = (dto: z.output<PcrModifyTypesSchemaType>) => {
    onUpdate({
      data: dto,
    });
  };

  const cancelLink = pcrId
    ? routes.pcrPrepare.getLink({ projectId, pcrId })
    : routes.pcrsDashboard.getLink({ projectId });

  return (
    <Page
      backLink={
        <BackLink route={cancelLink}>
          {pcrId
            ? getContent(x => x.pages.pcrModifyOptions.backToPcr)
            : getContent(x => x.pages.pcrModifyOptions.backToPcrs)}
        </BackLink>
      }
      fragmentRef={fragmentRef}
      validationErrors={allErrors}
      apiError={apiError}
    >
      <Content markdown value={x => x.pages.pcrModifyOptions.guidance} />

      <Form onSubmit={handleSubmit(onChange)}>
        <input type="hidden" {...register("projectId")} value={projectId} />
        {pcrId ? (
          <>
            <input type="hidden" {...register("pcrId")} value={pcrId} />
            <input type="hidden" {...register("form")} value={FormTypes.ProjectChangeRequestUpdateTypes} />
          </>
        ) : (
          <input type="hidden" {...register("form")} value={FormTypes.ProjectChangeRequestCreate} />
        )}

        <Field
          legend={getContent(x => x.pages.pcrModifyOptions.selectRequestTypesTitle)}
          error={getFieldState("types").error as RhfError}
          id="types"
        >
          <CheckboxList name="types" register={register}>
            {pcrItems
              .filter(x => !x.hidden)
              .map(({ item, disabled }, index) => {
                const { name, description } = getPcrItemContent(item.type);

                return (
                  <Checkbox
                    key={item.type}
                    id={`types_${index}`}
                    disabled={isFetching || disabled}
                    label={
                      <>
                        <span>{name}</span>
                        <br />
                        <span className="govuk-hint">{description}</span>
                      </>
                    }
                    value={item.type}
                    defaultChecked={defaults?.types?.includes(item.type)}
                  ></Checkbox>
                );
              })}
          </CheckboxList>
        </Field>
        <PcrDisabledReasoning items={visiblePcrItems} />

        <Fieldset>
          <SubmitButton disabled={isFetching}>
            {pcrId
              ? getContent(x => x.pages.pcrModifyOptions.buttonUpdateRequest)
              : getContent(x => x.pages.pcrModifyOptions.buttonCreateRequest)}
          </SubmitButton>

          <Link styling="SecondaryButton" route={cancelLink}>
            {getContent(x => x.pages.pcrModifyOptions.buttonCancelRequest)}
          </Link>
        </Fieldset>
      </Form>
    </Page>
  );
};

export const PcrUpdateSelectedContainer = PcrModifyOptions;
export const PcrCreateSelectedContainer = PcrModifyOptions;
export type { PcrUpdateParams, PcrModifyParams };
