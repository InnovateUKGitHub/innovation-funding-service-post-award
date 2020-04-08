import React from "react";
import * as ACC from "@ui/components";
import { CompanyDto, PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { EditorStatus, StoresConsumer } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { Pending } from "@shared/pending";
import { SimpleString } from "@ui/components/renderers";

interface State {
  searchTerm: string | null;
  queryString: string | null;
  selectedId: string | null;
}

class Component extends React.Component<PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>, State> {
  constructor(props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) {
    super(props);
    this.state = {
      searchTerm: null,
      queryString: null,
      selectedId: null
    };
  }

  render() {
    return (
      <StoresConsumer>
        {
          stores => {
            return this.renderContents((queryString) => stores.companies.getCompanies(queryString), this.state.queryString ? stores.companies.getCompanies(this.state.queryString, 10) : Pending.done([]));
          }
        }
      </StoresConsumer>
    );
  }

  renderContents(companiesHouseLoader: (x: string) => Pending<CompanyDto[]>, companiesHouseResults: Pending<CompanyDto[]>) {
    const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
    return (
      <ACC.Section qa="company-house" title="Company House">
        <Form.Form
          qa="addPartnerForm"
          data={this.props.pcrItem}
          isSaving={this.props.status === EditorStatus.Saving}
          onSubmit={() => this.props.onSave()}
          onChange={dto => this.props.onChange(dto)}
        >
          <Form.Fieldset heading="Company details">
            <Form.String
              label="Organisation name"
              name="organisationName"
              value={dto => dto.organisationName}
              update={(dto, val) => {
                dto.organisationName = val;
              }}
              validation={this.props.validator.companyHouseOrganisationName}
            />
            <Form.String
              label="Registration number"
              name="registrationNumber"
              value={dto => dto.registrationNumber}
              update={(dto, val) => {
                dto.registrationNumber = val;
              }}
              validation={this.props.validator.registrationNumber}
            />
            <Form.String
              label="Registered address"
              name="registeredAddress"
              value={dto => dto.registeredAddress}
              update={(dto, val) => {
                dto.registeredAddress = val;
              }}
              validation={this.props.validator.registeredAddress}
            />
          </Form.Fieldset>
          <Form.Fieldset heading="Search companies house" qa="search-companies-house">
            <Form.Search
              name="searchCompaniesHouse"
              hint="Enter your organisation name or registration number"
              labelHidden={true}
              value={() => this.state.queryString}
              update={(dto, val) => this.setState({ searchTerm: val })}
            />
            <Form.Button styling="Primary" name="companiesHouseSearch" onClick={() => this.setState({ queryString: this.state.searchTerm })}>Search</Form.Button>
          </Form.Fieldset>
          {this.renderPendingResults(Form, companiesHouseResults, this.props.pcrItem)}
          <Form.Fieldset qa="save-and-continue">
            <Form.Submit>Save and continue</Form.Submit>
            <Form.Button name="saveAndReturnToSummary" onClick={() => this.props.onSave(true)}>Save and return to summary</Form.Button>
          </Form.Fieldset>
        </Form.Form>
      </ACC.Section>
    );
  }

  private renderPendingResults(Form: ACC.FormBuilder<PCRItemForPartnerAdditionDto>, pendingSearchResults: Pending<CompanyDto[]> | null, pcrItem: PCRItemForPartnerAdditionDto) {
    return !pendingSearchResults ? this.renderResults(Form, null, pcrItem) : (
      <ACC.Loader pending={pendingSearchResults} render={x => this.renderResults(Form, x, pcrItem)} />
    );
  }

  private renderResults(Form: ACC.FormBuilder<PCRItemForPartnerAdditionDto>, searchResults: CompanyDto[] | null, pcrItem: PCRItemForPartnerAdditionDto) {
    if (searchResults) {
      if (searchResults.length === 0) {
        // Only show warning message if results length is 0 and a search term has been entered
        return !this.state.queryString ? null : (
          <SimpleString>
            Is your organisation not showing in these results? Check your spelling, or try searching again using a more specific company name or the registration number.
          </SimpleString>
        );
      }
      const companiesOptions: ACC.SelectOption[] = searchResults.map(x => ({
        id: x.companyNumber,
        value: this.displayCompany(x)
      }));
      const selectedCompany = companiesOptions.find(x => x.id === this.state.selectedId);

      return (
        <ACC.Section qa="company-house-search-results">
          <Form.Fieldset heading="Companies house search results">
            <Form.Radio
              name="searchResults"
              inline={false}
              options={companiesOptions}
              value={() => selectedCompany}
              update={(x, val) => this.onCompanySelectUpdate(val, searchResults, pcrItem)}
            />
          </Form.Fieldset>
          <SimpleString>Is your organisation not showing in these results? Check your spelling, or try searching again using a more specific company name or the registration number.</SimpleString>
        </ACC.Section>
      );
    }
  }

  private onCompanySelectUpdate(value: ACC.SelectOption | null, companies: CompanyDto[], pcrItem: PCRItemForPartnerAdditionDto) {
    const dto = pcrItem;
    const id = value && value.id;
    this.setState({
      selectedId: id
    });
    const selectedCompany = companies.find(x => x.companyNumber === id);
    if (selectedCompany) {
      dto.organisationName = selectedCompany.title;
      dto.registrationNumber = selectedCompany.companyNumber;
      dto.registeredAddress = selectedCompany.address.addressLine1 + ", " + selectedCompany.address.locality + ", " + selectedCompany.address.postalCode;
      this.props.onChange(dto);
    }
  }

  private displayCompany(company: CompanyDto) {
    return (
      <React.Fragment>
        {/* tslint:disable-next-line: no-duplicate-string */}
        <SimpleString className={"govuk-!-margin-bottom-0"}>{company.title}</SimpleString>
        <SimpleString className={"govuk-!-margin-bottom-0"}>{company.companyNumber}</SimpleString>
        <SimpleString className={"govuk-!-margin-bottom-0"}>{company.address.addressLine1}, {company.address.locality}, {company.address.postalCode}, {company.address.addressLine2}</SimpleString>
      </React.Fragment>
    );
  }

}

export const CompaniesHouseStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => <Component {...props} />;
