
import React from 'react';
import { User } from '../types';

interface UserAvatarProps {
  user: User;
  isCompleted: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, isCompleted }) => {
  const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const ringColor = isCompleted ? 'ring-secondary' : 'ring-gray-300 dark:ring-gray-500';

  return (
    <div
      className={`relative w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ${ringColor} ${user.avatarColor}`}
      title={user.name}
    >
      {initials}
      {isCompleted && (
        <div className="absolute -bottom-1 -right-1 bg-secondary w-3 h-3 rounded-full border-2 border-light-card dark:border-dark-card"></div>
      )}
    </div>
  );
};

export default UserAvatar;
