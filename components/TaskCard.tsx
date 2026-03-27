import React from 'react';
import { Task, User, UserRole } from '../types';
import UserAvatar from './UserAvatar';
// fix: Removed unused SparklesIcon import which was causing an error.
import { EditIcon, TrashIcon, CheckCircleIcon, CircleIcon } from './Icons';

interface TaskCardProps {
  task: Task;
  users: User[];
  currentUser: User;
  onEditTask: () => void;
  onDeleteTask: () => void;
  onToggleCompletion: (taskId: string, userId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  users,
  currentUser,
  onEditTask,
  onDeleteTask,
  onToggleCompletion,
}) => {
  const assignedUsers = users.filter(user => task.assignedUserIds.includes(user.id));
  const hasManagePower = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.MANAGER;
  const isAssigned = task.assignedUserIds.includes(currentUser.id);
  const hasCompleted = task.completedByUserIds.includes(currentUser.id);
  const isFullyCompleted = task.completedByUserIds.length > 0 && task.completedByUserIds.length === task.assignedUserIds.length;
  
  const cardBg = isFullyCompleted ? 'bg-green-50 dark:bg-green-900/50' : 'bg-light-card dark:bg-dark-card';
  const cardOpacity = isFullyCompleted ? 'opacity-70' : 'opacity-100';

  return (
    <div className={`p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-all ${cardBg} ${cardOpacity}`}>
      <div className="flex justify-between items-start">
        <h3 className={`font-bold text-md mb-2 ${isFullyCompleted ? 'line-through' : ''}`}>
          {task.title}
        </h3>
        {hasManagePower && (
          <div className="flex-shrink-0 flex items-center space-x-1">
            <button onClick={onEditTask} className="p-1 text-gray-500 hover:text-blue-500 rounded-full"><EditIcon /></button>
            <button onClick={onDeleteTask} className="p-1 text-gray-500 hover:text-red-500 rounded-full"><TrashIcon /></button>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
      
      <div className="flex justify-between items-end">
        <div className="flex -space-x-2">
          {assignedUsers.map(user => (
            <UserAvatar key={user.id} user={user} isCompleted={task.completedByUserIds.includes(user.id)} />
          ))}
        </div>
        
        {isAssigned && (
          <button
            onClick={() => onToggleCompletion(task.id, currentUser.id)}
            className="flex items-center space-x-1.5 px-3 py-1 text-sm font-medium rounded-full transition-colors bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {hasCompleted ? <CheckCircleIcon className="text-secondary" /> : <CircleIcon />}
            <span>{hasCompleted ? 'Feito!' : 'Concluir'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;