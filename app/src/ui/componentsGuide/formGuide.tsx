import React from "react";
import { TypedForm } from "../components/form";
import { Json } from "../components/renderers/json";
import { range } from "../../shared/range";

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
    name: string | null;
    description: string | null;
    value: number | null;
    option: { value: string, id: string } | null;
    file: File | null;
}

class SimpleForm extends React.Component<{}, { original: ISimpleEditorDto, editor: ISimpleEditorDto }> {
    private options: { value: string; id: string; }[];

    constructor(props: {}) {
        super(props);
        const dto: ISimpleEditorDto = { name: "Example Name", description: "", value: 100, option: null, file: null };
        this.state = { original: dto, editor: JSON.parse(JSON.stringify(dto)) };
        this.options = range(4).map(i => ({ value: "Option " + i, id: i + ""}));
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
                        <ExampleForm.Numeric label="Value" name="value" hint="A numeric value" value={data => data.value} update={(dto, value) => dto.value = value} />
                        <ExampleForm.Radio label="Option" name="option" hint="The option value" options={this.options} value={dto => dto.option} update={(dto, option) => dto.option = option}/>
                        <ExampleForm.FileUpload label="Upload file" name="upload file" hint="select file" update={(dto, file) => dto.file = file}/>
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
        const dto = this.state.editor;
        this.setState({ original: dto, editor: JSON.parse(JSON.stringify(dto)) });
    }
}
