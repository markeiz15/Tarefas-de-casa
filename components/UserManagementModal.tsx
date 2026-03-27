
import React from 'react';
import { User, UserRole } from '../types';
import { XIcon, TrashIcon } from './Icons';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUser: User;
  onDeleteUser: (userId: string) => void;
  onUpdateRole: (userId: string, newRole: UserRole) => void;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onDeleteUser,
  onUpdateRole,
}) => {
  if (!isOpen) return null;

  const usersToDisplay = users.filter(user => user.id !== currentUser.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-2xl p-6 w-full max-w-lg relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
          <XIcon />
        </button>
        <h2 className="text-xl font-bold mb-4">Gerenciar Usuários</h2>
        
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {usersToDisplay.length > 0 ? (
            usersToDisplay.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</p>
                  <select
                    value={user.role}
                    onChange={(e) => onUpdateRole(user.id, e.target.value as UserRole)}
                    className="mt-1 text-xs bg-transparent border-none p-0 text-primary font-medium focus:ring-0 cursor-pointer"
                  >
                    <option value={UserRole.PERFORMER}>Performer</option>
                    <option value={UserRole.MANAGER}>Manager</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                  </select>
                </div>
                <button
                  onClick={() => onDeleteUser(user.id)}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                  aria-label={`Excluir ${user.name}`}
                >
                  <TrashIcon />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum outro usuário cadastrado.</p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementModal;