class User {
    name: string;
    phone: string;
    email: string;
    password: string;

    constructor(name: string, phone: string, email: string, password: string) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.password = password;
    }
    convertToJSON() {
        return {
            name: this.name,
            phone: this.phone,
            email: this.email,
        
        }
    }
}
export default User;