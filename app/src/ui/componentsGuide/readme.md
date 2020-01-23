# Components Guide
The components guide is used to display what each component looks like, and how it should be used.  
When a new component is made, a guide for it should be added here.  
A benefit of the component guide, is that it allows for components to be developed in isolation. 

## Creating a component guide
Component guides should be named after the component file they are related to, with the "Guide" suffix  
e.g. `documentListGuide.tsx` for the `documentList.tsx` component, or `datesGuide.tsx` for the various date components stored in `dates.tsx`.
 
The documentation outlining the structure of a component guide can be found at `src\framework\types\IGuide.d.ts`

Once made, this file should be added to the `guide.tsx` file and be kept in alphabetical order. 
