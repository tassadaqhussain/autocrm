export interface ProjectDrawerProject {
    id: number;
    project_name: string;
    short_code: string | null;
    description: string | null;
    summary: string | null;
    notes: string | null;
    client_id: number | null;
    category_id: number | null;
    department_id: number | null;
    client?: {
        id: number;
        name: string;
    };
    category?: {
        id: number;
        name: string;
    };
    department?: {
        id: number;
        name: string;
    };
    members?: {
        id: number;
        name: string;
    }[];
    start_date: string | null;
    deadline: string | null;
    no_deadline: boolean;
    status: 'Not Started' | 'In Progress' | 'On Hold' | 'Canceled' | 'Finished';
    budget: number;
    currency: string;
    hours_estimate: number | null;
    public_gantt_chart: boolean;
    public_task_board: boolean;
    task_approval: boolean;
    is_public: boolean;
    allow_manual_time_logs: boolean;
    enable_miroboard: boolean;
    send_task_notification: boolean;
    created_at: string;
}
