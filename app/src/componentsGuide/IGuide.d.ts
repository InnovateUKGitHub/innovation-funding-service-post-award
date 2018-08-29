interface IGuide {
    name: string;
    options: IGuideOption[];
}

interface IGuideOption {
    name: string;
    comments: string;
    example: string;
    render: () => JSX.Element;
}
