import * as ACC from "@ui/components";
import { PCRItemForTimeExtensionDto, PCRTimeExtensionOption } from "@framework/dtos";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRTimeExtensionItemDtoValidator } from "@ui/validators";
import { useContent } from "@ui/hooks";
import { useMounted } from "@ui/features";
import { EditorStatus } from "@ui/constants/enums";
import { useStores } from "@ui/redux";
import React from "react";

interface TimeExtensionProps {
  timeExtensionOptions: PCRTimeExtensionOption[];
}

const TimeExtensionStep = (
  props: PcrStepProps<PCRItemForTimeExtensionDto, PCRTimeExtensionItemDtoValidator> & TimeExtensionProps,
) => {
  const { getContent } = useContent();
  const { isClient } = useMounted();

  const Form = ACC.TypedForm<PCRItemForTimeExtensionDto>();
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
      <ACC.Section>
        <ACC.Content markdown value={x => x.pages.pcrTimeExtensionStep.changeProjectDurationHint} />
      </ACC.Section>

      <ACC.Section>
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
              value={m => (
                <ACC.Renderers.SimpleString>
                  <ACC.Renderers.ShortDateRangeFromDuration
                    startDate={props.project.startDate}
                    months={m.projectDurationSnapshot}
                  />
                </ACC.Renderers.SimpleString>
              )}
              update={() => {
                return;
              }}
            />
            <Form.Custom
              label={durationLabel}
              name="currentDuration"
              value={m => (
                <ACC.Renderers.SimpleString>
                  <ACC.Renderers.Months months={m.projectDurationSnapshot} />
                </ACC.Renderers.SimpleString>
              )}
              update={() => {
                return;
              }}
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
                  <ACC.Renderers.SimpleString>
                    <ACC.Renderers.ShortDateRangeFromDuration
                      startDate={props.project.startDate}
                      months={newProjectDuration}
                    />
                  </ACC.Renderers.SimpleString>
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
                  <ACC.Renderers.SimpleString>
                    <ACC.Renderers.Months months={newProjectDuration} />
                  </ACC.Renderers.SimpleString>
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
      </ACC.Section>
    </>
  );
};

export const TimeExtensionStepContainer = (
  props: PcrStepProps<PCRItemForTimeExtensionDto, PCRTimeExtensionItemDtoValidator>,
) => {
  const { projectChangeRequests } = useStores();
  const pending = projectChangeRequests.getTimeExtensionOptions(props.pcr.projectId);

  return (
    <ACC.Loader
      pending={pending}
      render={(timeExtensionOptions, isLoading) =>
        isLoading ? (
          <ACC.Renderers.SimpleString qa="claimsLoadingMessage">
            <ACC.Content value={x => x.pages.pcrTimeExtensionStep.loadingTimeExtensionOptions} />
          </ACC.Renderers.SimpleString>
        ) : (
          <TimeExtensionStep timeExtensionOptions={timeExtensionOptions} {...props} />
        )
      }
    />
  );
};
