import { IContact } from "../../models";

export function getAll(): Promise<IContact[]> {
  return fetch("http://localhost:8080/api/contacts").then(x => x.json()) as any;
}

export function get(id: string): Promise<IContact> {
  return fetch(`http://localhost:8080/api/contact/${id}`) as any;
}
