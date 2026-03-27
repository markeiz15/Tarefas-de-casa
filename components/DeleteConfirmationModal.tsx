import React from 'react';
import { DayOfWeek } from '../types';
import { XIcon } from './Icons';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDeleteDay: () => void;
  onConfirmDeleteAll: () => void;
  taskTitle: string;
  day: DayOfWeek;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirmDeleteDay,
  onConfirmDeleteAll,
  taskTitle,
  day
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-2xl p-6 w-full max-w-sm relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
          <XIcon />
        </button>
        <h2 className="text-lg font-bold mb-2">Excluir Tarefa Recorrente</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          A tarefa "<strong>{taskTitle}</strong>" é uma tarefa recorrente. Como você gostaria de excluí-la?
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={onConfirmDeleteDay}
            className="w-full px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Excluir somente para {day}
          </button>
          <button
            onClick={onConfirmDeleteAll}
            className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Excluir todas as ocorrências
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 mt-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
