import React, { useState, useEffect, useCallback } from 'react';
import { User, Task, DayOfWeek, DAYS_OF_WEEK, TaskType, UserRole } from './types';
import { supabase } from './supabase';
import TaskBoard from './components/TaskBoard';
import AddTaskModal from './components/AddTaskModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import AuthPage from './components/AuthPage';
import UserManagementModal from './components/UserManagementModal';

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalDay, setModalDay] = useState<DayOfWeek | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{ task: Task; day: DayOfWeek } | null>(null);
  const [isUserManagementModalOpen, setIsUserManagementModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchInitialData(session.user.id);
      } else {
        setCurrentUser(null);
        setTasks([]);
        setUsers([]);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchInitialData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchInitialData = async (authUserId: string) => {
    setLoading(true);
    try {
      const { data: usersData } = await supabase.from('users').select('*');
      if (usersData) {
        const mappedUsers: User[] = usersData.map(u => ({
          id: u.id,
          name: u.name,
          avatarColor: u.avatar_color,
          role: u.role as UserRole
        }));
        setUsers(mappedUsers);
        const me = mappedUsers.find(u => u.id === authUserId);
        if (me) setCurrentUser(me);
      }

      const { data: tasksData } = await supabase.from('tasks').select('*');
      const { data: assignments } = await supabase.from('task_assignments').select('*');
      const { data: completions } = await supabase.from('task_completions').select('*');

      if (tasksData) {
        const mappedTasks: Task[] = tasksData.map(t => {
          const assignedUserIds = assignments?.filter(a => a.task_id === t.id).map(a => a.user_id) || [];
          const completedByUserIds = completions?.filter(c => c.task_id === t.id).map(c => c.user_id) || [];
          
          return {
            id: t.id,
            title: t.title,
            description: t.description || '',
            day: t.day as DayOfWeek,
            type: t.type as TaskType,
            recurringDays: t.recurring_days || [],
            creatorId: t.creator_id,
            assignedUserIds,
            completedByUserIds
          };
        });
        setTasks(mappedTasks);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleDeleteUser = async (userIdToDelete: string) => {
    if (window.confirm('Tem certeza de que deseja excluir este usuário? Esta ação é irreversível.')) {
      setUsers(prev => prev.filter(user => user.id !== userIdToDelete));
      setTasks(prevTasks => prevTasks.map(task => ({
          ...task,
          assignedUserIds: task.assignedUserIds.filter(id => id !== userIdToDelete),
          completedByUserIds: task.completedByUserIds.filter(id => id !== userIdToDelete),
        }))
      );
      await supabase.from('users').delete().eq('id', userIdToDelete);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    await supabase.from('users').update({ role: newRole }).eq('id', userId);
  };

  const handleOpenModal = useCallback((day: DayOfWeek, task: Task | null) => {
    setModalDay(day);
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
    setModalDay(null);
  }, []);

  const handleSaveTask = async (taskToSave: Omit<Task, 'id' | 'creatorId' | 'completedByUserIds'> & { id?: string }) => {
    try {
      if (editingTask) {
        setTasks(prevTasks => prevTasks.map(task => 
          task.id === editingTask.id ? { ...task, ...taskToSave, id: editingTask.id } : task
        ));
        
        await supabase.from('tasks').update({
          title: taskToSave.title,
          description: taskToSave.description,
          day: taskToSave.day,
          type: taskToSave.type,
          recurring_days: taskToSave.recurringDays || []
        }).eq('id', editingTask.id);

        await supabase.from('task_assignments').delete().eq('task_id', editingTask.id);
        if (taskToSave.assignedUserIds.length > 0) {
          const inserts = taskToSave.assignedUserIds.map(uid => ({ task_id: editingTask.id, user_id: uid }));
          await supabase.from('task_assignments').insert(inserts);
        }

      } else {
        const id = crypto.randomUUID();
        const newTask: Task = {
          ...taskToSave,
          id,
          creatorId: currentUser!.id,
          completedByUserIds: [],
          day: modalDay!,
        };
        setTasks(prevTasks => [...prevTasks, newTask]);
        
        await supabase.from('tasks').insert({
          id,
          title: taskToSave.title,
          description: taskToSave.description,
          day: taskToSave.day,
          type: taskToSave.type,
          recurring_days: taskToSave.recurringDays || [],
          creator_id: currentUser!.id
        });

        if (taskToSave.assignedUserIds.length > 0) {
          const inserts = taskToSave.assignedUserIds.map(uid => ({ task_id: id, user_id: uid }));
          await supabase.from('task_assignments').insert(inserts);
        }
      }
    } catch (e) {
      console.error(e);
    }
    handleCloseModal();
  };

  const handleInitiateDelete = useCallback((task: Task, day: DayOfWeek) => {
    if (task.type === TaskType.RECURRING && task.recurringDays && task.recurringDays.length > 1) {
      setTaskToDelete({ task, day });
      setIsDeleteModalOpen(true);
    } else {
      setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));
      supabase.from('tasks').delete().eq('id', task.id).then();
    }
  }, []);
  
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleConfirmDeleteForDay = async () => {
    if (!taskToDelete) return;
    const { task, day } = taskToDelete;

    const taskToUpdate = tasks.find(t => t.id === task.id);
    if (!taskToUpdate || !taskToUpdate.recurringDays) {
      handleCloseDeleteModal();
      return;
    }

    const newRecurringDays = taskToUpdate.recurringDays.filter(d => d !== day);

    if (newRecurringDays.length > 0) {
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === task.id ? { ...t, recurringDays: newRecurringDays } : t)
      );
      await supabase.from('tasks').update({ recurring_days: newRecurringDays }).eq('id', task.id);
    } else {
      setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));
      await supabase.from('tasks').delete().eq('id', task.id);
    }

    handleCloseDeleteModal();
  };
  
  const handleConfirmDeleteAll = async () => {
    if (!taskToDelete) return;
    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskToDelete.task.id));
    await supabase.from('tasks').delete().eq('id', taskToDelete.task.id);
    handleCloseDeleteModal();
  };

  const handleToggleTaskCompletion = async (taskId: string, userId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const isCompleted = task.completedByUserIds.includes(userId);
    
    setTasks(prevTasks => 
      prevTasks.map(t => {
        if (t.id === taskId) {
          const completedBy = new Set(t.completedByUserIds);
          if (completedBy.has(userId)) completedBy.delete(userId);
          else completedBy.add(userId);
          return { ...t, completedByUserIds: Array.from(completedBy) };
        }
        return t;
      })
    );

    try {
      if (isCompleted) {
        await supabase.from('task_completions').delete().match({ task_id: taskId, user_id: userId });
      } else {
        await supabase.from('task_completions').insert({ task_id: taskId, user_id: userId });
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <p className="text-xl text-primary font-bold">Carregando...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen font-sans bg-gray-50 dark:bg-dark-bg">
      <header className="bg-white dark:bg-dark-card shadow-md p-4 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-20 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-primary text-center sm:text-left">
          Quadro de Tarefas da Casa
        </h1>
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
          <span className="font-medium text-gray-800 dark:text-gray-200">Olá, {currentUser.name.split(' ')[0]}!</span>
          {currentUser.role === UserRole.ADMIN && (
            <button
              onClick={() => setIsUserManagementModalOpen(true)}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Gerenciar Usuários
            </button>
          )}
          <button 
            onClick={handleLogout}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="p-2 sm:p-4">
        <TaskBoard
          tasks={tasks}
          users={users}
          currentUser={currentUser}
          days={DAYS_OF_WEEK}
          onEditTask={handleOpenModal}
          onDeleteTask={handleInitiateDelete}
          onToggleCompletion={handleToggleTaskCompletion}
          onAddTask={handleOpenModal}
        />
      </main>

      {isModalOpen && (
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
          task={editingTask}
          users={users}
          day={modalDay!}
        />
      )}

      {isDeleteModalOpen && taskToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirmDeleteDay={handleConfirmDeleteForDay}
          onConfirmDeleteAll={handleConfirmDeleteAll}
          taskTitle={taskToDelete.task.title}
          day={taskToDelete.day}
        />
      )}

      {isUserManagementModalOpen && (
        <UserManagementModal
          isOpen={isUserManagementModalOpen}
          onClose={() => setIsUserManagementModalOpen(false)}
          users={users}
          currentUser={currentUser}
          onDeleteUser={handleDeleteUser}
          onUpdateRole={handleUpdateUserRole}
        />
      )}
    </div>
  );
}