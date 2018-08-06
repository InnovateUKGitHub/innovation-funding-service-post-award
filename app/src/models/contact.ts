export interface Contact {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  address: {
    street: string;
    city: string;
    county: string;
    postcode: string;
  }
}
