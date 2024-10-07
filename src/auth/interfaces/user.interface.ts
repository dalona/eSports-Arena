import { Role } from "src/common/enums/role.enum";

export interface Player {
    id: number;
    email: string;
    role: Role;
}