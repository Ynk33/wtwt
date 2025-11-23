import { useEffect, useRef, type RefObject } from 'react';

/**
 * Hook to detect clicks outside of specified elements
 * @param refs - Array of refs to check for outside clicks
 * @param handler - Callback function to execute when click is outside
 */
const useClickOutside = (
  refs: RefObject<HTMLElement | null>[],
  handler: (event: MouseEvent) => void
): void => {
  const handlerRef = useRef(handler);
  const refsRef = useRef(refs);

  // Update refs on each render
  useEffect(() => {
    handlerRef.current = handler;
    refsRef.current = refs;
  }, [handler, refs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = refsRef.current.every(
        (ref) => ref.current && !ref.current.contains(event.target as Node)
      );

      if (isOutside) {
        handlerRef.current(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty deps - we use refs to get latest values
};

export default useClickOutside;
