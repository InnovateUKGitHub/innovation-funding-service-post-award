import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { mapToSalesforceCompetitionTypes } from "@framework/constants/competitionTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, CheckboxList } from "@ui/components/atomicDesign/atoms/form/Checkbox/Checkbox";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { SubmitButton } from "@ui/components/atomicDesign/atoms/form/SubmitButton/SubmitButton";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Field } from "@ui/components/atomicDesign/molecules/form/Field/Field";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { BaseProps } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/redux/routesProvider";
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
import { usePcrItemsForThisCompetition } from "../utils/usePcrItemsForThisCompetition";

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
  const { project, pcrs, numberOfPartners } = usePcrModifyOptionsQuery({ projectId });
  const currentPcr = pcrs.find(x => x.id === pcrId);

  const pcrItems = usePcrItemsForThisCompetition(
    mapToSalesforceCompetitionTypes(project.competitionType),
    pcrs,
    pcrId,
    numberOfPartners,
  );

  const { register, handleSubmit, setError, formState, getFieldState } = useForm<
    z.output<PcrCreateSchemaType | PcrUpdateTypesSchemaType>
  >({
    resolver: zodResolver(
      getPcrModifyTypesSchema({
        pcrItemInfo: pcrItems,
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

  const { apiError, isFetching, onUpdate } = useOnSubmit();

  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const allErrors = useZodErrors<z.output<PcrModifyTypesSchemaType>>(setError, formState.errors);
  const defaults = useServerInput<z.output<PcrModifyTypesSchemaType>>();

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
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
      validationErrors={allErrors}
      apiError={apiError}
      isActive={project.isActive}
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
          <>
            <input type="hidden" {...register("form")} value={FormTypes.ProjectChangeRequestCreate} />
          </>
        )}

        <Field
          legend={getContent(x => x.pages.pcrModifyOptions.selectRequestTypesTitle)}
          error={getFieldState("types").error as RhfError}
          id="types"
        >
          <CheckboxList name="types" register={register}>
            {pcrItems
              .filter(x => !x.disabled)
              .map(({ item }, index) => {
                const { name, description } = getPcrItemContent(item.type);

                return (
                  <Checkbox
                    key={item.type}
                    id={`types_${index}`}
                    disabled={isFetching}
                    label={
                      <>
                        <span>{name}</span>
                        <br />
                        <span className="govuk-hint">{description}</span>
                      </>
                    }
                    value={item.type}
                    defaultChecked={defaults?.types.includes(item.type)}
                  ></Checkbox>
                );
              })}
          </CheckboxList>
        </Field>
        <PcrDisabledReasoning items={pcrItems} />

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
