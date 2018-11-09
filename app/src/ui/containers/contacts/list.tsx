import * as React from "react";
import { Link } from "react-router5";
import { Breadcrumbs, Title } from "../../components/layout";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as Acc from "../../components";

interface Props {
  contacts: Pending<IContact[]>;
}

class ListComponent extends ContainerBase<{}, Props, {}> {
  static loadData() {
    return [Actions.loadContacts()];
  }

  render() {
    const Loader = Acc.TypedLoader<IContact[]>();
    return (
      <div>
        <Breadcrumbs links={[{ routeName: "home", text: "Home" }]}>Contacts</Breadcrumbs>
        <Title title="Contacts" />
        <Loader pending={this.props.contacts} render={contacts => this.renderTable(contacts)} />
        <Link className="govuk-back-link" routeName="home">Home</Link>
      </div>
    );
  }

  private renderTable(contacts: IContact[]) {
    const Table = Acc.TypedTable<IContact>();
    return (
      <Table.Table qa="contacts" data={contacts}>
        <Table.String header="Id" qa="id" value={x => x.id} />
        <Table.String header="Name" qa="name" value={x => `${x.firstName} ${x.lastName}`.trim()} />
        <Table.Email header="Email" qa="email" value={x => x.email} />
        <Table.Custom header="Address" qa="address" value={x => this.renderAddress(x.address)} />
      </Table.Table>
    );
  }

  renderAddress(address: IContactAddress) {
    const items = [address.street, address.city, address.county, address.postcode].filter(x => !!x);

    return (!items.length)
      ? ""
      : items.map((x, i) => [<span key={`address${i}`}>{x}<br /></span>,]);
  }
}

const definition = ReduxContainer.for<{}, Props, {}>(ListComponent);

export const ContactList = definition.connect({
  withData: (state) => ({ contacts: Selectors.getContacts().getPending(state) }),
  withCallbacks: () => ({})
});

export const ContactListRoute = definition.route({
  routeName: "contacts",
  routePath: "/contacts",
  getParams: () => ({}),
  getLoadDataActions: () => [Actions.loadContacts()],
  container: ContactList
});
