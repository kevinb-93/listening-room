import { UserRole } from '../models/user';

export enum Permission {
    CreateParty = 'create-party'
}

export type RolePermissions = {
    [key in UserRole]: Permission[];
};

const rolePermissions: RolePermissions = {
    [UserRole.User]: [Permission.CreateParty],
    [UserRole.Admin]: [Permission.CreateParty]
};

export const hasUserAccess = (
    permission: Permission,
    role: UserRole
): boolean => {
    return rolePermissions[role]?.includes(permission);
};
