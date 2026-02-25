/** Employee as returned from API (list or single) for use in list, view drawer, and edit drawer */
export interface EmployeeDrawerEmployee {
    id: number;
    employee_id: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        phone: string | null;
    };
    department: { id: number; name: string } | null;
    designation: { id: number; title: string; department_id?: number } | null;
    shift: { id: number; name: string; start_time?: string; end_time?: string } | null;
    status: string;
    employment_type: string;
    joining_date: string;
}
