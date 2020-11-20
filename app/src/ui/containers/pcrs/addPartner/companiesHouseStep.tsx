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
      <ACC.Section qa="company-house" titleContent={x => x.pcrAddPartnerCompanyHouse.sectionTitle}>
        <Form.Form
          qa="addPartnerForm"
          data={this.props.pcrItem}
          isSaving={this.props.status === EditorStatus.Saving}
          onSubmit={() => this.props.onSave()}
          onChange={dto => this.props.onChange(dto)}
        >
          <Form.Fieldset headingContent={x => x.pcrAddPartnerCompanyHouse.formHeading}>
            <Form.String
              labelContent={x => x.pcrAddPartnerCompanyHouse.labels.organisationNameHeading}
              name="organisationName"
              value={dto => dto.organisationName}
              update={(dto, val) => {
                dto.organisationName = val;
              }}
              validation={this.props.validator.companyHouseOrganisationName}
            />
            <Form.String
              labelContent={x => x.pcrAddPartnerCompanyHouse.labels.registrationNumberHeading}
              name="registrationNumber"
              value={dto => dto.registrationNumber}
              update={(dto, val) => {
                dto.registrationNumber = val;
              }}
              validation={this.props.validator.registrationNumber}
            />
            <Form.String
              labelContent={x => x.pcrAddPartnerCompanyHouse.labels.registeredAddressHeading}
              name="registeredAddress"
              value={dto => dto.registeredAddress}
              update={(dto, val) => {
                dto.registeredAddress = val;
              }}
              validation={this.props.validator.registeredAddress}
            />
          </Form.Fieldset>
          <Form.Fieldset headingContent={x => x.pcrAddPartnerCompanyHouse.searchHeading} qa="search-companies-house">
            <Form.Search
              name="searchCompaniesHouse"
              hintContent={x => x.pcrAddPartnerCompanyHouse.hint}
              labelHidden={true}
              value={() => this.state.queryString}
              update={(dto, val) => this.setState({ searchTerm: val })}
            />
            <Form.Button styling="Primary" name="companiesHouseSearch" onClick={() => this.setState({ queryString: this.state.searchTerm })}><ACC.Content value={x => x.pcrAddPartnerCompanyHouse.searchButton}/></Form.Button>
          </Form.Fieldset>
          {this.renderPendingResults(Form, companiesHouseResults, this.props.pcrItem)}
          <Form.Fieldset qa="save-and-continue">
            <Form.Submit><ACC.Content value={x => x.pcrAddPartnerCompanyHouse.pcrItem.submitButton()}/></Form.Submit>
            <Form.Button name="saveAndReturnToSummary" onClick={() => this.props.onSave(true)}><ACC.Content value={x => x.pcrAddPartnerCompanyHouse.pcrItem.returnToSummaryButton()}/></Form.Button>
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
          <SimpleString><ACC.Content value={x => x.pcrAddPartnerCompanyHouse.resultNotShowing}/></SimpleString>
        );
      }
      const companiesOptions: ACC.SelectOption[] = searchResults.map(x => ({
        id: x.companyNumber,
        value: this.displayCompany(x)
      }));
      const selectedCompany = companiesOptions.find(x => x.id === this.state.selectedId);

      return (
        <ACC.Section qa="company-house-search-results">
          <Form.Fieldset headingContent={x => x.pcrAddPartnerCompanyHouse.searchResultsHeading} qa="searchResults">
            <Form.Radio
              name="searchResults"
              inline={false}
              options={companiesOptions}
              value={() => selectedCompany}
              update={(x, val) => this.onCompanySelectUpdate(val, searchResults, pcrItem)}
            />
          </Form.Fieldset>
          <SimpleString><ACC.Content value={x => x.pcrAddPartnerCompanyHouse.resultNotShowing}/></SimpleString>
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
