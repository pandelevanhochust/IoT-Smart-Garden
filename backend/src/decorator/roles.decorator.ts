import { SetMetadata } from '@nestjs/common';
import { Role } from '../auth/guard/role.enum';
export const ROLES_KEY = 'role';
export const Roles = (...role: Role[]) => SetMetadata(ROLES_KEY, role);

export const PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(PUBLIC_KEY,true);
