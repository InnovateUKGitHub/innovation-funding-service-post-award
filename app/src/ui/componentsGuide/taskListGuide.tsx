import { createStore } from "redux";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

import { Result } from "@ui/validation";
import { Task, TaskListSection, OL } from "@ui/components";
import { HomeRoute } from "@ui/containers";
import { rootReducer } from "@ui/redux";
import { IGuide } from "@framework/types";

const history = createMemoryHistory();

export const taskListGuide: IGuide = {
  name: "Task list",
  options: [
    {
      name: "Simple, without validation",
      comments: "Renders information in a summary list, with action",
      example: `
      <OL>
              <TaskListSection step={1} title={"Scope Change"}>
                <Task
                  name="View files"
                  status="Complete"
                  route={HomeRoute.getLink({})}
                />
                <Task 
                  name="View rationale" 
                  status="Incomplete" 
                  route={HomeRoute.getLink({})}
                />
                <Task
                  name="View reasoning"
                  status="To do"
                  route={HomeRoute.getLink({})}
                />
              </TaskListSection>
              <TaskListSection step={2} title={"Partner change"}>
                <Task
                  name="View files"
                  status="To do"
                  route={HomeRoute.getLink({})}
                />
              </TaskListSection>
            </OL>
      `,
      render: () => (
        <Provider store={createStore(rootReducer)}>
          <Router location={history.location} navigator={history}>
            <OL className="app-task-list">
              <TaskListSection step={1} title={"Scope Change"}>
                <Task name="View files" status="Complete" route={HomeRoute.getLink({})} />
                <Task name="View rationale" status="Incomplete" route={HomeRoute.getLink({})} />
                <Task name="View reasoning" status="To do" route={HomeRoute.getLink({})} />
              </TaskListSection>

              <TaskListSection step={2} title={"Partner change"}>
                <Task name="View files" status="To do" route={HomeRoute.getLink({})} />
              </TaskListSection>
            </OL>
          </Router>
        </Provider>
      ),
    },
    {
      name: "With validation",
      comments: "Renders information in a summary list, with action and validation results",
      example: `
       <OL>
              <TaskListSection
                step={1}
                title={"Scope Change"}
                validation={[new Result(null, true, false, "You must upload a file plz", false)]}
              >
                <Task
                  name="View files"
                  status="To Do"
                  route={HomeRoute.getLink({})}
                />
              </TaskListSection>
            </OL>
      `,
      render: () => (
        <Provider store={createStore(rootReducer)}>
          <Router location={history.location} navigator={history}>
            <OL className="app-task-list">
              <TaskListSection
                step={1}
                title={"Scope Change"}
                validation={[new Result(null, true, false, "You must upload a file plz", false)]}
              >
                <Task name="View files" status="To do" route={HomeRoute.getLink({})} />
              </TaskListSection>
            </OL>
          </Router>
        </Provider>
      ),
    },
  ],
};
