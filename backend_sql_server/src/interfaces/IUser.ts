import { IRole } from './IRole';

export interface IUser {
  id?: string;
  name: string;
  email: string;
  roleId: string;
  password: string;
  address: string;
  accessToken?: string;
}
