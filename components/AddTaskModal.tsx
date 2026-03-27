
import React, { useState, useEffect } from 'react';
import { Task, User, TaskType, DayOfWeek, DAYS_OF_WEEK } from '../types';
import { XIcon } from './Icons';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'creatorId' | 'completedByUserIds'> & { id?: string }) => void;
  task: Task | null;
  users: User[];
  day: DayOfWeek;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSave, task, users, day }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>([]);
  const [type, setType] = useState<TaskType>(TaskType.ONE_TIME);
  const [recurringDays, setRecurringDays] = useState<DayOfWeek[]>([]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setAssignedUserIds(task.assignedUserIds);
      setType(task.type);
      setRecurringDays(task.recurringDays || []);
    } else {
      setTitle('');
      setDescription('');
      setAssignedUserIds([]);
      setType(TaskType.ONE_TIME);
      setRecurringDays([]);
    }
  }, [task, isOpen]);

  const handleUserToggle = (userId: string) => {
    setAssignedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleRecurringDayToggle = (day: DayOfWeek) => {
    setRecurringDays(prev =>
        prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onSave({
      ...(task ? { id: task.id } : {}),
      title,
      description,
      day,
      assignedUserIds,
      type,
      recurringDays: type === TaskType.RECURRING ? recurringDays : [],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
          <XIcon />
        </button>
        <h2 className="text-xl font-bold mb-4">{task ? 'Editar Tarefa' : 'Nova Tarefa'} para {day}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-transparent" required />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-transparent"></textarea>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Atribuir a</span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {users.map(user => (
                  <label key={user.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" checked={assignedUserIds.includes(user.id)} onChange={() => handleUserToggle(user.id)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <span>{user.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Tarefa</span>
                <div className="mt-2 flex space-x-4">
                    <label className="flex items-center"><input type="radio" name="taskType" value={TaskType.ONE_TIME} checked={type === TaskType.ONE_TIME} onChange={() => setType(TaskType.ONE_TIME)} className="h-4 w-4 text-primary focus:ring-primary"/> <span className="ml-2">Única vez</span></label>
                    <label className="flex items-center"><input type="radio" name="taskType" value={TaskType.RECURRING} checked={type === TaskType.RECURRING} onChange={() => setType(TaskType.RECURRING)} className="h-4 w-4 text-primary focus:ring-primary"/> <span className="ml-2">Recorrente</span></label>
                </div>
            </div>
            {type === TaskType.RECURRING && (
                <div>
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Repetir nos dias</span>
                    <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {DAYS_OF_WEEK.map(d => (
                             <label key={d} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                <input type="checkbox" checked={recurringDays.includes(d)} onChange={() => handleRecurringDayToggle(d)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                <span>{d.substring(0,3)}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
