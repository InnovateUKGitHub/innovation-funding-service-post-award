import { PCRTimeExtensionOption, PCRItemForTimeExtensionDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Loader } from "@ui/components/bjss/loading";
import { ShortDateRangeFromDuration, Months } from "@ui/components/atomicDesign/atoms/Date";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { EditorStatus } from "@ui/redux/constants/enums";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { useContent } from "@ui/hooks/content.hook";
import { useStores } from "@ui/redux/storesProvider";
import { PCRTimeExtensionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import React from "react";
import { PcrStepProps } from "../pcrWorkflow";

interface TimeExtensionProps {
  timeExtensionOptions: PCRTimeExtensionOption[];
}

const Form = createTypedForm<PCRItemForTimeExtensionDto>();

const TimeExtensionStep = (
  props: PcrStepProps<PCRItemForTimeExtensionDto, PCRTimeExtensionItemDtoValidator> & TimeExtensionProps,
) => {
  const { getContent } = useContent();
  const { isClient } = useMounted();

  const existingProjectHeading = getContent(x => x.pages.pcrTimeExtensionStep.existingProjectHeading);
  const dateLabel = getContent(x => x.pages.pcrTimeExtensionStep.dateLabel);
  const durationLabel = getContent(x => x.pages.pcrTimeExtensionStep.durationLabel);
  const proposedProjectHeading = getContent(x => x.pages.pcrTimeExtensionStep.proposedProjectHeading);
  const saveAndContinue = getContent(x => x.pages.pcrTimeExtensionStep.saveAndContinue);
  const currentProjectEndDate = getContent(x => x.pages.pcrTimeExtensionStep.currentProjectEndDate);

  const timeExtensionDropdownOptions = React.useMemo(
    () =>
      props.timeExtensionOptions?.map(x => {
        const isCurrent = x.offset === 0;
        return {
          id: x.offset.toString(),
          value: isCurrent ? currentProjectEndDate : x.label,
        };
      }),
    [props.timeExtensionOptions, currentProjectEndDate],
  );

  if (!timeExtensionDropdownOptions || timeExtensionDropdownOptions.length === 1) {
    throw new Error("You are not able to change the project duration");
  }

  const getProjectEndOption = React.useCallback(
    (offsetMonths: number) => timeExtensionDropdownOptions.find(x => x.id === offsetMonths.toString()),
    [timeExtensionDropdownOptions],
  );

  const newProjectDuration =
    props.pcrItem.offsetMonths || props.pcrItem.offsetMonths === 0
      ? props.pcrItem.offsetMonths + props.pcrItem.projectDurationSnapshot
      : null;

  return (
    <>
      <Section>
        <Content markdown value={x => x.pages.pcrTimeExtensionStep.changeProjectDurationHint} />
      </Section>

      <Section>
        <Form.Form
          data={props.pcrItem}
          isSaving={props.status === EditorStatus.Saving}
          onChange={dto => props.onChange(dto)}
          onSubmit={() => props.onSave(false)}
          qa="itemStatus"
        >
          <Form.Fieldset heading={existingProjectHeading}>
            <Form.Custom
              label={dateLabel}
              name="currentDates"
              value={({ formData }) => (
                <SimpleString>
                  <ShortDateRangeFromDuration
                    startDate={props.project.startDate}
                    months={formData.projectDurationSnapshot}
                  />
                </SimpleString>
              )}
            />
            <Form.Custom
              label={durationLabel}
              name="currentDuration"
              value={({ formData }) => (
                <SimpleString>
                  <Months months={formData.projectDurationSnapshot} />
                </SimpleString>
              )}
            />
          </Form.Fieldset>

          <Form.Fieldset heading={proposedProjectHeading}>
            <Form.DropdownList
              // TODO: Revise this content
              label={"Please select a new date from the available list"}
              placeholder="-- Select end date --"
              name="timeExtension"
              validation={props.validator.offsetMonthsResult}
              options={timeExtensionDropdownOptions}
              value={m => getProjectEndOption(m.offsetMonths)}
              update={(m, value) => {
                return (m.offsetMonths = Number(value?.id));
              }}
            />
            {isClient && (
              <Form.Custom
                label={dateLabel}
                name="proposedDates"
                value={() => (
                  <SimpleString>
                    <ShortDateRangeFromDuration startDate={props.project.startDate} months={newProjectDuration} />
                  </SimpleString>
                )}
                update={() => {
                  return;
                }}
              />
            )}

            {isClient && (
              <Form.Custom
                label={durationLabel}
                name="proposedDuration"
                value={() => (
                  <SimpleString>
                    <Months months={newProjectDuration} />
                  </SimpleString>
                )}
                update={() => {
                  return;
                }}
              />
            )}
          </Form.Fieldset>

          <Form.Fieldset>
            <Form.Submit>{saveAndContinue}</Form.Submit>
          </Form.Fieldset>
        </Form.Form>
      </Section>
    </>
  );
};

export const TimeExtensionStepContainer = (
  props: PcrStepProps<PCRItemForTimeExtensionDto, PCRTimeExtensionItemDtoValidator>,
) => {
  const { projectChangeRequests } = useStores();
  const pending = projectChangeRequests.getTimeExtensionOptions(props.pcr.projectId);

  return (
    <Loader
      pending={pending}
      render={(timeExtensionOptions, isLoading) =>
        isLoading ? (
          <SimpleString qa="claimsLoadingMessage">
            <Content value={x => x.pages.pcrTimeExtensionStep.loadingTimeExtensionOptions} />
          </SimpleString>
        ) : (
          <TimeExtensionStep timeExtensionOptions={timeExtensionOptions} {...props} />
        )
      }
    />
  );
};
