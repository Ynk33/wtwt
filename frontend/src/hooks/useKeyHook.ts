import { useEffect } from 'react';

const useKeyHook = ({
  key,
  callback,
}: {
  key: string;
  callback: () => void;
}) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === key) callback();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [key, callback]);
};

export default useKeyHook;
