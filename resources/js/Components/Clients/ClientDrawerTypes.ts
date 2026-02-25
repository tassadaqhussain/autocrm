/** Client as returned from API (list or single) */
export interface ClientDrawerClient {
    id: number;
    name: string;
    email: string | null;
    mobile: string | null;
    status: string;
    created_at: string;
    salutation?: string | null;
    country?: string | null;
    gender?: string | null;
    language?: string | null;
    client_category?: string | null;
    client_sub_category?: string | null;
    login_allowed?: boolean;
    email_notifications?: boolean;
    company_name?: string | null;
    official_website?: string | null;
    tax_name?: string | null;
    gst_vat_number?: string | null;
    office_phone?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    company_address?: string | null;
    shipping_address?: string | null;
    note?: string | null;
}
