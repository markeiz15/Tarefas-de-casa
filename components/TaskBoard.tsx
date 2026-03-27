import React, { useState } from 'react';
import { Task, User, DayOfWeek } from '../types';
import TaskColumn from './TaskColumn';

interface TaskBoardProps {
  tasks: Task[];
  users: User[];
  currentUser: User;
  days: readonly DayOfWeek[];
  onEditTask: (day: DayOfWeek, task: Task) => void;
  onDeleteTask: (task: Task, day: DayOfWeek) => void;
  onToggleCompletion: (taskId: string, userId: string) => void;
  onAddTask: (day: DayOfWeek, task: null) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  users,
  currentUser,
  days,
  onEditTask,
  onDeleteTask,
  onToggleCompletion,
  onAddTask,
}) => {
  const todayIndex = new Date().getDay();
  const [activeDay, setActiveDay] = useState<DayOfWeek>(days[todayIndex]);
  
  const getTasksForDay = (day: DayOfWeek) => {
    return tasks.filter(task => {
        if (task.type === 'recurring' && task.recurringDays?.includes(day)) {
            return true;
        }
        return task.day === day && task.type === 'one-time';
    });
  }

  return (
    <>
      {/* Desktop View: Responsive Grid */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        {days.map(day => (
          <TaskColumn
            key={day}
            day={day}
            tasks={getTasksForDay(day)}
            users={users}
            currentUser={currentUser}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onToggleCompletion={onToggleCompletion}
            onAddTask={onAddTask}
          />
        ))}
      </div>

      {/* Mobile View: Tabs */}
      <div className="sm:hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-4 overflow-x-auto px-4" aria-label="Tabs">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`${
                  activeDay === day
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-500'
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
              >
                {day}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-2">
            <TaskColumn
                key={activeDay}
                day={activeDay}
                tasks={getTasksForDay(activeDay)}
                users={users}
                currentUser={currentUser}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onToggleCompletion={onToggleCompletion}
                onAddTask={onAddTask}
            />
        </div>
      </div>
    </>
  );
};

export default TaskBoard;