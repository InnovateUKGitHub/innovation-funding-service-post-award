interface IContactAddress {
  street: string;
  city: string;
  county: string;
  postcode: string;
}

interface IContact {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  address: IContactAddress;
}
