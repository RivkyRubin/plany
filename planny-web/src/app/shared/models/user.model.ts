export interface IUser{
    _id: string;
    name: string;
    email: string;
    password: string;
}
export class User implements IUser {
    _id!: string;
    name!: string;
    email!: string;
    password!:string;
  }