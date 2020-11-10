/**
 * Each component guide is in the structure of IGuide where 'name' is the name of the component or set of components being described and 'options' is an array of IGuideOptions.
 */

export interface IGuide {
    name: string;
    options: IGuideOption[];
}

export interface IGuideOption {
    /** * The name of the specific component or variation of that component. */
    name: string;
     /** * Describes what is being rendered. */
    comments: JSX.Element|string;
     /** * The code required to produce the described variation of the component. */
    example: JSX.Element|string;
     /** * A function that renders the described component. */
    render: () => JSX.Element;
}
