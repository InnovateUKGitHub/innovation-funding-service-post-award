export interface IContactAddress {
  street: string;
  city: string;
  county: string;
  postcode: string;
}

export interface IContact {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  address: IContactAddress;
}
