import { useState } from 'react';

// Hook para manejar la visibilidad de un modal
export const useModal = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return { isOpen, openModal, closeModal };
};
