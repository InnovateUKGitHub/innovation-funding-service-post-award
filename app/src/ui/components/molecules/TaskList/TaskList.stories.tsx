import type { Meta, StoryObj } from "@storybook/react";
import { Result } from "@ui/validation/result";
import { OL } from "@ui/components/atoms/List/list";
import { TaskListSection, Task } from "./TaskList";

const meta: Meta<typeof TaskListSection> = {
  title: "GOV.UK Patterns/Task list",
};

export default meta;

type Story = StoryObj<typeof TaskListSection>;

export const Primary: Story = {
  tags: ["govuk/pattern"],
  render: () => (
    <OL className="app-task-list">
      <TaskListSection step={1} title="Scope Change">
        <Task id="files" name="View files" status="Complete" route={null} />
        <Task id="rationale" name="View rationale" status="Incomplete" route={null} />
        <Task id="reasoning" name="View reasoning" status="To do" route={null} />
      </TaskListSection>
      <TaskListSection step={2} title="Partner Change">
        <Task id="blah" name="blah" status="To do" route={null} />
      </TaskListSection>
    </OL>
  ),
};

export const Validation: Story = {
  tags: ["ifspa/pattern"],
  render: () => (
    <OL className="app-task-list">
      <TaskListSection
        step={1}
        title="Scope Change"
        validation={[
          new Result(null, true, false, "Thanks to you, I am a figure of ridicule within the market community.", false),
        ]}
      >
        <Task id="files" name="View files" status="Complete" route={null} />
        <Task id="rationale" name="View rationale" status="Incomplete" route={null} />
        <Task id="reasoning" name="View reasoning" status="To do" route={null} />
      </TaskListSection>
    </OL>
  ),
};
