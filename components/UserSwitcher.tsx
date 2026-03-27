
// This component is no longer used and can be removed.
import React from 'react';
import { User } from '../types';

interface UserSwitcherProps {
  users: User[];
  currentUser: User;
  onUserChange: (user: User) => void;
}

const UserSwitcher: React.FC<UserSwitcherProps> = ({ users, currentUser, onUserChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = users.find(u => u.id === event.target.value);
    if (selectedUser) {
      onUserChange(selectedUser);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="user-select" className="text-sm font-medium">Usuário:</label>
      <select
        id="user-select"
        value={currentUser.id}
        onChange={handleChange}
        className="block w-full max-w-xs pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-light-card dark:bg-gray-700"
      >
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSwitcher;
