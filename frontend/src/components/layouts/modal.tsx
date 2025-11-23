import React from 'react';

import useKeyHook from '@hooks/useKeyHook';
import Button from '../ui/Button';

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}): React.ReactNode => {
  useKeyHook({ key: 'Escape', callback: onClose });

  return (
    isOpen && (
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 px-24"
        onClick={onClose}
      >
        <div
          className="relative bg-white p-4 pr-8 rounded-lg w-full aspect-video overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="tertiary"
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
          {children}
        </div>
      </div>
    )
  );
};

export default Modal;
