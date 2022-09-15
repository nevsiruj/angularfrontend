import { Role } from './role';

export class User {
    id!: string;
    title!: string;
    Nombre!: string;
    Apellido!: string;
    Direccion!: string;
    email!: string;
    role!: Role;
    isDeleting: boolean = false;
}