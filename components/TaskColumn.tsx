import React from 'react';
import { Task, User, DayOfWeek, UserRole } from '../types';
import TaskCard from './TaskCard';
import { PlusIcon } from './Icons';

interface TaskColumnProps {
  day: DayOfWeek;
  tasks: Task[];
  users: User[];
  currentUser: User;
  onEditTask: (day: DayOfWeek, task: Task) => void;
  onDeleteTask: (task: Task, day: DayOfWeek) => void;
  onToggleCompletion: (taskId: string, userId: string) => void;
  onAddTask: (day: DayOfWeek, task: null) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  day,
  tasks,
  users,
  currentUser,
  onEditTask,
  onDeleteTask,
  onToggleCompletion,
  onAddTask,
}) => {
  const hasManagePower = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.MANAGER;
  
  const visibleTasks = hasManagePower ? tasks : tasks.filter(task => task.assignedUserIds.includes(currentUser.id));

  return (
    <div className="w-full bg-light-bg dark:bg-gray-800 rounded-lg sm:shadow-sm sm:p-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">{day}</h2>
        {hasManagePower && (
          <button
            onClick={() => onAddTask(day, null)}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary transition-colors"
            aria-label={`Adicionar tarefa na ${day}`}
          >
            <PlusIcon />
          </button>
        )}
      </div>
      <div className="space-y-3 h-full overflow-y-auto">
        {visibleTasks.length > 0 ? (
          visibleTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              users={users}
              currentUser={currentUser}
              onEditTask={() => onEditTask(day, task)}
              onDeleteTask={() => onDeleteTask(task, day)}
              onToggleCompletion={onToggleCompletion}
            />
          ))
        ) : (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
            {hasManagePower ? 'Nenhuma tarefa neste dia.' : 'Você não possui tarefas para hoje. Bom descanso!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;