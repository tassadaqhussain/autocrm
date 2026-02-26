export interface ProjectDrawerProject {
    id: number;
    project_name: string;
    description: string | null;
    client_id: number | null;
    client?: {
        id: number;
        name: string;
    };
    start_date: string | null;
    deadline: string | null;
    status: 'Not Started' | 'In Progress' | 'On Hold' | 'Canceled' | 'Finished';
    budget: number;
    created_at: string;
}
