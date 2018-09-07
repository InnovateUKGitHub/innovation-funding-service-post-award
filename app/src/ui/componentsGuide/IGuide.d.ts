interface IGuide {
    name: string;
    options: IGuideOption[];
}

interface IGuideOption {
    name: string;
    comments: JSX.Element|string;
    example: JSX.Element|string;
    render: () => JSX.Element;
}
