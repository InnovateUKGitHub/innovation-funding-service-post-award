import { IClientUser } from "../../src/types/IUser";

export class TestUser implements IClientUser {
    constructor() {
        this.email = "test.user@test.com";
        this.name = "Test User";
        this.roleInfo = {};
    }

    public email: string;
    public name: string;
    public roleInfo: {};

    public set(user: Partial<{email: string, name: string}>) {
        this.email = user.email || this.email;
        this.name = user.name || this.name;
    }
}
