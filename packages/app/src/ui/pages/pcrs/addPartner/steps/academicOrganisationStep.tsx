import { createRegisterButton } from "@framework/util/registerButton";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { H2 } from "@ui/components/atoms/Heading/Heading.variants";
import { Link } from "@ui/components/atoms/Links/links";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Section } from "@ui/components/atoms/Section/Section";
import { InitialSearch } from "@ui/components/molecules/form/Search/InitialSearch";
import { SelectSearchResult } from "@ui/components/molecules/form/Search/SelectSearchResult";
import { useSearchParamState } from "@ui/components/molecules/form/Search/useSearchParamState";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { useContent } from "@ui/hooks/content.hook";
import { FormTypes } from "@ui/zod/FormTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { PcrPage } from "../../pcrPage";
import { useLinks } from "../../utils/useNextLink";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useOnUpdateAddPartnerAcademicOrganisation } from "./academicOrganisation.logic";
import { useJesSearchQuery } from "./jesSearch.logic";
import { AcademicOrganisationSchemaType } from "./schemas/academicOrganisation.zod";

export const AcademicOrganisationStep = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, search } = usePcrWorkflowContext();
  const [query, setQuery] = useSearchParamState("search", search?.toString());
  const { jesAccounts, isLoading } = useJesSearchQuery(query ?? "");
  const link = useLinks();
  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);
  const { onUpdate, isProcessing } = useOnUpdateAddPartnerAcademicOrganisation();
  const { setValue, register, handleSubmit } = useForm<z.output<AcademicOrganisationSchemaType>>();
  const registerButton = createRegisterButton(setValue, "button_submit");

  const searchResults =
    jesAccounts?.map(x => ({
      id: x.id,
      value: x.id,
      label: x.companyName,
      hint: undefined,
    })) ?? [];

  const defaultResult = pcrItem.accountId
    ? {
        id: pcrItem.accountId,
        value: pcrItem.accountId,
        label: pcrItem.organisationName ?? "",
        hint: undefined,
      }
    : null;

  const showSearchBox = !((defaultResult && query === null) || searchResults.length > 0);

  return (
    <PcrPage>
      <Section>
        <H2>{getContent(x => x.pages.pcrAddPartnerAcademicOrganisation.sectionTitle)}</H2>
        <ValidationMessage
          messageType="info"
          qa="jes-organisation-info"
          message={x => x.pcrAddPartnerLabels.jesOrganisationInfo}
        />
        {isLoading && <P>{getContent(x => x.components.search.loading)}</P>}
        {query !== null && query !== "" && !isLoading && searchResults.length === 0 && (
          <P>{getContent(x => x.components.search.noResults({ input: query }))}</P>
        )}
        {showSearchBox && (
          <>
            <InitialSearch
              query={query}
              setQuery={setQuery}
              searchResults={searchResults}
              maxLength={160}
              disabled={isProcessing}
              hint={getContent(x => x.pages.pcrAddPartnerAcademicOrganisation.hint)}
            />
            <Fieldset>
              <Link route={link({ button_submit: "submit" }).link}>
                <Button styling="Secondary">{getContent(x => x.pcrItem.continueButton)}</Button>
              </Link>
              <Link route={link({ button_submit: "returnToSummary" }).link}>
                <Button styling="Secondary">{getContent(x => x.pcrItem.returnToSummaryButton)}</Button>
              </Link>
            </Fieldset>
          </>
        )}
        {!showSearchBox && (
          <Form
            onSubmit={handleSubmit(x => {
              if (x.accountId === "search") {
                setQuery("");
              } else {
                onUpdate({
                  data: {
                    form: x.form,
                    accountId: x.accountId,
                    button_submit: x.button_submit,
                  },
                  context: link({ button_submit: x.button_submit }),
                });
              }
            })}
          >
            <input type="hidden" {...register("form")} value={FormTypes.PcrAddPartnerAcademicOrganisationStep} />
            <SelectSearchResult<z.output<AcademicOrganisationSchemaType>>
              name="accountId"
              register={register}
              query={query}
              defaultResult={defaultResult}
              searchResults={searchResults}
              disabled={isProcessing}
            />
            <Fieldset>
              <Button type="submit" {...registerButton("submit")} disabled={isProcessing}>
                {getContent(x => x.pcrItem.submitButton)}
              </Button>
              <Button type="submit" secondary {...registerButton("returnToSummary")} disabled={isProcessing}>
                {getContent(x => x.pcrItem.saveAndReturnToSummaryButton)}
              </Button>
            </Fieldset>
          </Form>
        )}
      </Section>
    </PcrPage>
  );
};
