import React from "react";
import { Task, TaskList, TaskListSection } from "@ui/components/taskList";
import { HomeRoute } from "@ui/containers";
import createRouter from "router5";
import browserPluginFactory from "router5/plugins/browser";
import { createStore } from "redux";
import { rootReducer } from "@ui/redux";
import { RouterProvider } from "react-router5";
import { Provider } from "react-redux";
import { Result } from "@ui/validation";
import { IGuide } from "@framework/types";

const route = { name: "home", routeName: "home", path: "/" } as any;
const router = createRouter([route]).usePlugin(browserPluginFactory({ useHash: false }));

export const taskListGuide: IGuide = {
  name: "Task list",
  options: [
    {
      name: "Simple, without validation",
      comments: "Renders information in a summary list, with action",
      example: `
      <TaskList>
              <TaskListSection step={1} title={"Scope Change"}>
                <Task
                  name="View files"
                  status="Complete"
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
            </TaskList>
      `,
      render: () => (
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <TaskList>
              <TaskListSection step={1} title={"Scope Change"}>
                <Task
                  name="View files"
                  status="Complete"
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
            </TaskList>
          </RouterProvider>
        </Provider>
      )
    },
    {
      name: "With validation",
      comments: "Renders information in a summary list, with action and validation results",
      example: `
       <TaskList>
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
            </TaskList>
      `,
      render: () => (
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <TaskList>
              <TaskListSection
                step={1}
                title={"Scope Change"}
                validation={[new Result(null, true, false, "You must upload a file plz", false)]}
              >
                <Task
                  name="View files"
                  status="To do"
                  route={HomeRoute.getLink({})}
                />
              </TaskListSection>
            </TaskList>
          </RouterProvider>
        </Provider>
      )
    }
  ]
};
