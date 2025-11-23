import React, { useState } from 'react';

import useKeyHook from '@hooks/useKeyHook';
import { cn } from '@utils/cn';
import Button from './Button';

type AlertType = 'info' | 'question';
type AlertVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';

interface AlertProps {
  type: AlertType;
  variant?: AlertVariant;
  callback?: () => void;
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

const Alert = ({
  type,
  variant = 'primary',
  callback,
  children,
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
}: AlertProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(true);

  // Support both controlled and uncontrolled modes
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledOnClose || (() => setInternalIsOpen(false));

  const handleClose = () => {
    setIsOpen();
  };

  const handleOk = () => {
    if (type === 'question' && callback) {
      callback();
    }
    handleClose();
  };

  useKeyHook({ key: 'Escape', callback: handleClose });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 px-4"
      onClick={handleClose}
    >
      <div
        className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">{children}</div>

        <div
          className={cn(
            'flex gap-3',
            type === 'question' ? 'justify-end' : 'justify-center'
          )}
        >
          {type === 'question' && (
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          )}
          <Button variant={variant} onClick={handleOk}>
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};

Alert.displayName = 'Alert';

export default Alert;
