# Components

Components are functions which return a React object.  
Each component should be standalone and be able to exist without any other component.  
They should also be pure and not have to depend on the store.

## Creating a new component

When creating a new component, it should be placed into the most relevant folder to aid ease of location in the future.  
Unit tests should be created, mirroring the structure of the components folder.

If creating a file new for a component, that file should be added to and exported via the `index.ts` file of the same directory, whether that is the component root directory, or a subdirectory

New components should also be added to and documented in the components guide.  
More documentation can be found at `componentsGuide/readme.md`.

## Using a component

The components layer should NOT be imported as `import * as ACC from "@ui/components"`.  
When being used, the component required should be obtained by automatically importing the relevant component with Intellisense.
e.g. `<ShortDate />`, `<ProjectTitle />` or `<DocumentList />`
