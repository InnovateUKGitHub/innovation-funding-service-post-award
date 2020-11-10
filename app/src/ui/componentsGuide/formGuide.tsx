import React from "react";
import { TypedForm } from "../components/form";
import { Json } from "../components/renderers/json";
import { range } from "../../shared/range";
import { IFileWrapper } from "@framework/types";
import { IGuide } from "@framework/types";

export const formGuide: IGuide = {
    name: "Forms",
    options: [
        {
            name: "Simple",
            comments: "Renders a simple form with various input fields",
            example: `
    <ExampleForm.Form data={this.state.editor} onSubmit={() => this.onSave()} onChange={(dto) => this.onChange(dto)}>
        <ExampleForm.Fieldset heading="Example form for the editor">
            <ExampleForm.String label="Name" name="name" hint="A simple field" value={data => data.name} update={(dto, value) => dto.name = value} />
            <ExampleForm.MultilineString label="Description" name="description" hint="A multiline field" value={data => data.description} update={(dto, value) => dto.description = value} />
            <ExampleForm.Numeric label="Value" name="value" hint="A numeric value" value={data => data.value} update={(dto, value) => dto.value = value} />
            <ExampleForm.Date label="Full date" name="name" hint="Full date input" value={data => data.date} update={(dto, date) => dto.date = date}/>
            <ExampleForm.MonthYear label="Month year" name="name" hint="Month & year input" startOrEnd="start" value={data => data.date} update={(dto, date) => dto.date = date}/>
            <ExampleForm.Radio label="Radio option" name="option" hint="The option value" inline={true} options={this.options} value={dto => dto.option} update={(dto, option) => dto.option = option}/>
            <ExampleForm.DropdownList label="Drop down list option" name="option" hint="The option value" hasEmptyOption={true} options={this.options} value={dto => dto.option} update={(dto, option) => dto.option = option}/>
            <ExampleForm.Checkboxes label="Checkbox option" name="option" hint="The option value" options={this.multiOptions} value={dto => dto.mulipleOptions} update={(dto, options) => dto.mulipleOptions = options}/>
            <ExampleForm.FileUpload value={dto => dto.file} label="Upload file" name="upload file" hint="select file" update={(dto, file) => dto.file = file}/>
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
    date: Date | null;
    option: { value: React.ReactNode, id: string } | null;
    dropdownOption: { value: string | number, id: string } | null;
    mulipleOptions: { value: React.ReactNode, id: string }[] | null;
    dropdownOptions: { value: string | number, id: string }[] | null;
    file: IFileWrapper | null;
}

class SimpleForm extends React.Component<{}, { original: ISimpleEditorDto, editor: ISimpleEditorDto }> {
    private readonly options: { value: React.ReactNode; id: string; }[];
    private readonly multiOptions: { value: React.ReactNode; id: string; }[];
    private readonly dropdownOptions: { value: string | number; id: string; }[];

    constructor(props: {}) {
        super(props);
        const dto: ISimpleEditorDto = { name: "Example Name", description: "", value: 100, option: null, dropdownOption: null, mulipleOptions: [], dropdownOptions: [], file: null, date: new Date() };
        this.state = { original: dto, editor: JSON.parse(JSON.stringify(dto)) };
        this.options = range(4).map(i => ({ value: "Single Option " + i, id: `option-${i}`, qa: `qa-${i}`}));
        this.multiOptions = range(4).map(i => ({ value: "Multi Option " + i, id: `multi-option${i}`, qa: `qa-${i}`}));
        this.dropdownOptions = range(4).map(i => ({ value: "Multi Option " + i, id: `multi-option${i}`, qa: `qa-${i}`}));
    }

    render() {
        const ExampleForm = TypedForm<ISimpleEditorDto>();

        return (
            <div>
                <Json value={this.state} />
                <ExampleForm.Form data={this.state.editor} onSubmit={() => this.onSave()} onChange={(dto) => this.onChange(dto)}>
                    <ExampleForm.Fieldset heading={`Example form for the editor ${this.state.original.name} `}>
                        <ExampleForm.String label="Name" name="name" hint="A simple field" value={data => data.name} update={(dto, value) => dto.name = value} />
                        <ExampleForm.MultilineString label="Description" name="description" hint="A multiline field" value={data => data.description} update={(dto, value) => dto.description = value} />
                        <ExampleForm.Numeric label="Value" name="value" hint="A numeric value" value={data => data.value} update={(dto, value) => dto.value = value} />
                        <ExampleForm.Date label="Full date" name="name" hint="Full date input" value={data => data.date} update={(dto, date) => dto.date = date}/>
                        <ExampleForm.MonthYear label="Month year" name="name" hint="Month & year input" startOrEnd="start" value={data => data.date} update={(dto, date) => dto.date = date}/>
                        <ExampleForm.Radio label="Radio option" name="option" hint="The option value" inline={true} options={this.options} value={dto => dto.option} update={(dto, option) => dto.option = option}/>
                        <ExampleForm.DropdownList label="Drop down list option" name="option" hint="The option value" hasEmptyOption={true} options={this.dropdownOptions} value={dto => dto.dropdownOption} update={(dto, option) => dto.option = option}/>
                        <ExampleForm.Checkboxes label="Checkbox option" name="option" hint="The option value" options={this.multiOptions} value={dto => dto.mulipleOptions} update={(dto, options) => dto.mulipleOptions = options}/>
                        <ExampleForm.FileUpload value={dto => dto.file} label="Upload file" name="upload file" hint="select file" update={(dto, file) => dto.file = file}/>
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
        const original = this.state.editor;
        const editor = JSON.parse(JSON.stringify(original));
        editor.file = null;
        this.setState({ original, editor });
    }
}
