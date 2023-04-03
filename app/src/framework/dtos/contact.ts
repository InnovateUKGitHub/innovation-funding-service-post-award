export interface IContactAddress {
  city: string;
  county: string;
  postcode: string;
  street: string;
}

export interface IContact {
  address: IContactAddress;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  title: string;
}
