import * as React from "react";
import { Link } from "react-router5";
import { Breadcrumbs, Title } from "../../components/layout";
import * as Actions from "../../redux/actions/thunks";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as Dtos from "../../models";
import * as Acc from "../../components";

interface Props {
  contacts: Pending<Dtos.IContact[]>;
}

class ListComponent extends ContainerBase<Props, {}> {
  static loadData() {
    return [Actions.loadContacts()];
  }

  render() {
    const Loading = Acc.Loading.forData(this.props.contacts);

    return (
      <div>
        <Breadcrumbs links={[{ routeName: "home", text: "Home" }]}>Contacts</Breadcrumbs>
        <Title title="Contacts" />
        <Loading.Loader render={contacts => this.renderTable(contacts)} />
        <Link className="govuk-back-link" routeName="home">Home</Link>
      </div>
    );
  }

  private renderTable(contacts: Dtos.IContact[]) {
    const Table = Acc.Table.forData(contacts);
    return (
      <Table.Table>
        <Table.String header="Id" qa="id" value={x => x.id} />
        <Table.String header="Name" qa="name" value={x => `${x.firstName} ${x.lastName}`.trim()} />
        <Table.Email header="Email" qa="email" value={x => x.email} />
        <Table.Custom header="Address" qa="address" value={x => this.renderAddress(x.address)} />
      </Table.Table>
    );
  }

  renderAddress(address: Dtos.IContactAddress) {
    const items = [address.street, address.city, address.county, address.postcode].filter(x => !!x);

    return (!items.length)
      ? ""
      : items.map((x, i) => [<span key={`address${i}`}>{x}<br /></span>,]);
  }
}

function mapStateToProps(state: any) {
  return {
    data: state && state.data && state.data.contacts && state.data.contacts.all && state.data.contacts.all.data
  };
}

export const ContactList = ReduxContainer.for<Props, {}>(ListComponent)
  .withData((store) => ({ contacts: Pending.create(store.data.contacts.all) }))
  .connect()
  ;
