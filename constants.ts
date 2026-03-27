
import { User, Task, UserRole, TaskType, DayOfWeek } from './types';

export const USERS: User[] = [
  { id: 'user-admin', name: 'admin', avatarColor: 'bg-gray-700', role: UserRole.ADMIN, password: 'admin' },
  { id: 'user-1', name: 'Ana (Gerente)', avatarColor: 'bg-red-500', role: UserRole.MANAGER, password: '123' },
  { id: 'user-2', name: 'Bruno', avatarColor: 'bg-blue-500', role: UserRole.PERFORMER, password: '123' },
  { id: 'user-3', name: 'Carla', avatarColor: 'bg-green-500', role: UserRole.PERFORMER, password: '123' },
  { id: 'user-4', name: 'Daniel', avatarColor: 'bg-yellow-500', role: UserRole.PERFORMER, password: '123' },
];

export const TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Lavar la louça do jantar',
    description: 'Secar e guardar toda a louça.',
    day: 'Segunda',
    assignedUserIds: ['user-2', 'user-3'],
    completedByUserIds: ['user-2'],
    type: TaskType.RECURRING,
    recurringDays: ['Segunda', 'Quarta', 'Sexta'],
    creatorId: 'user-1',
  },
  {
    id: 'task-2',
    title: 'Passear com o cachorro',
    description: 'Passeio matinal no parque.',
    day: 'Terça',
    assignedUserIds: ['user-4'],
    completedByUserIds: [],
    type: TaskType.RECURRING,
    recurringDays: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
    creatorId: 'user-1',
  },
  {
    id: 'task-3',
    title: 'Limpar o banheiro social',
    description: 'Limpeza completa, incluindo box e espelho.',
    day: 'Quarta',
    assignedUserIds: ['user-1'],
    completedByUserIds: ['user-1'],
    type: TaskType.ONE_TIME,
    creatorId: 'user-1',
  },
  {
    id: 'task-4',
    title: 'Tirar o lixo',
    description: 'Lixo orgânico e reciclável.',
    day: 'Sexta',
    assignedUserIds: ['user-2'],
    completedByUserIds: [],
    type: TaskType.RECURRING,
    recurringDays: ['Segunda', 'Quarta', 'Sexta'],
    creatorId: 'user-1',
  },
  {
    id: 'task-5',
    title: 'Compras da semana',
    description: 'Ir ao supermercado com a lista de compras.',
    day: 'Sábado',
    assignedUserIds: ['user-1', 'user-3'],
    completedByUserIds: [],
    type: TaskType.ONE_TIME,
    creatorId: 'user-1',
  },
];