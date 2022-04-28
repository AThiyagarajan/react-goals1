export enum GoalStatus {
  INPROGRESS = 'InProgress',
  CREATED = 'Created',
  COMPLETED = 'Completed',
}
export interface Goal {
  id?: string;
  name: string;
  status: GoalStatus;
  dueDate: string;
}

/* --- STATE --- */
export interface DashboardState {
  goals: Goal[];
}
