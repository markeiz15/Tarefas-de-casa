
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  PERFORMER = 'performer',
}

export interface User {
  id: string;
  name: string;
  avatarColor: string;
  role: UserRole;
}

export enum TaskType {
  ONE_TIME = 'one-time',
  RECURRING = 'recurring',
}

export const DAYS_OF_WEEK = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'] as const;

export type DayOfWeek = typeof DAYS_OF_WEEK[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  day: DayOfWeek;
  assignedUserIds: string[];
  completedByUserIds: string[];
  type: TaskType;
  recurringDays?: DayOfWeek[];
  creatorId: string;
}