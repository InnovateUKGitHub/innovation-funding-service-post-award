export class TestUser implements IUser {
    constructor(){
        this.email = "test.user@test.com";
        this.name = "Test User";
    }

    public email: string;
    public name: string;

    public set(user: Partial<{email:string, name: string}>){
        this.email = user.email || this.email;
        this.name = user.name || this.name;
    }
}