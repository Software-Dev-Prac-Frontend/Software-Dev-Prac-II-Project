export interface User{
    _id: string;
    name: string;
    email: string;
    password: string;
    tel: string;
    role:"member" | "admin";
}