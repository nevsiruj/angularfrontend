import { Role } from './role';

export class User {
  id!: string;
  title!: string;
  nombre!: string;
  apellido!: string;
  direccion!: string;
  email!: string;
  role!: Role;
  isDeleting: boolean = false;
}
