export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role?: string;
    role_id?: number;
    all_permissions?: string[];
    /** Enabled module names for tenant's service type; null = no service type = all modules visible */
    enabled_modules?: string[] | null;
    clinic?: {
        id: number;
        name: string;
        slug: string;
    };
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
