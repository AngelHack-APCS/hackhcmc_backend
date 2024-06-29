export class TaskDto {
    task_id: number;
    parent_id: number;
    child_id: number;
    name: string;
    type: string;
    description: string;
    reward: number;
    due_date: string;
    status: string;
}
