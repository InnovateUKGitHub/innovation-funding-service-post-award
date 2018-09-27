import React from "react";
import { TypedForm } from "../components/form";
import { Json } from "../components/renderers/json";

export const formGuide: IGuide = {
    name: "Forms",
    options: [
        {
            name: "Simple",
            comments: "Renders a simple form with text field",
            example: `
                <ExampleForm.Form data={this.state.editor} onSubmit={() => this.onSave()} onChange={(dto) => this.onChange(dto)}>
                    <ExampleForm.Fieldset heading={(data) => \`Example form for the editor \${this.state.original.name} \`}>
                        <ExampleForm.String label="Name" name="name" hint="A simple field" value={data => data.name} update={(dto, value) => dto.name = value} />
                        <ExampleForm.MultilineString label="Description" name="description" hint="A multiline field" value={data => data.description} update={(dto, value) => dto.description = value} />
                    </ExampleForm.Fieldset>
                    <ExampleForm.Submit>Save</ExampleForm.Submit>
                </ExampleForm.Form>
                `,
            render: () => <SimpleForm />
        }
    ]
};

interface ISimpleEditorDto {
    name: string;
    description: string;
}

class SimpleForm extends React.Component<{}, { original: ISimpleEditorDto, editor: ISimpleEditorDto }> {
    constructor(props: {}) {
        super(props);
        const dto: ISimpleEditorDto = { name: "Example Name", description: "" };
        this.state = { original: dto, editor: JSON.parse(JSON.stringify(dto)) };
    }

    render() {
        const ExampleForm = TypedForm<ISimpleEditorDto>();
        return (
            <div>
                <Json value={this.state} />
                <ExampleForm.Form data={this.state.editor} onSubmit={() => this.onSave()} onChange={(dto) => this.onChange(dto)}>
                    <ExampleForm.Fieldset heading={(data) => `Example form for the editor ${this.state.original.name} `}>
                        <ExampleForm.String label="Name" name="name" hint="A simple field" value={data => data.name} update={(dto, value) => dto.name = value} />
                        <ExampleForm.MultilineString label="Description" name="description" hint="A multiline field" value={data => data.description} update={(dto, value) => dto.description = value} />
                    </ExampleForm.Fieldset>
                    <ExampleForm.Submit>Save</ExampleForm.Submit>
                </ExampleForm.Form>
            </div>
        );
    }

    private onChange(dto: ISimpleEditorDto) {
        this.setState({ editor: dto });
    }

    private onSave() {
        console.log("Saving", this.state.editor);
        const dto = this.state.editor;
        this.setState({ original: dto, editor: JSON.parse(JSON.stringify(dto)) });
    }
}
