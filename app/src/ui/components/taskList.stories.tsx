import type { Meta, StoryObj } from "@storybook/react";
import { Result } from "@ui/validation";

import { OL } from "./layout/list";
import { TaskListSection, Task } from "./taskList";

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
        <Task name="View files" status="Complete" route={null} />
        <Task name="View rationale" status="Incomplete" route={null} />
        <Task name="View reasoning" status="To do" route={null} />
      </TaskListSection>
      <TaskListSection step={2} title="Partner Change">
        <Task name="View files" status="To do" route={null} />
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
        <Task name="View files" status="Complete" route={null} />
        <Task name="View rationale" status="Incomplete" route={null} />
        <Task name="View reasoning" status="To do" route={null} />
      </TaskListSection>
    </OL>
  ),
};
