/**
 * https://usehooks-ts.com/react-hook/use-event-listener
 * Use EventListener easily with this React Hook.
 * It takes as parameters a eventName, a call-back functions (handler) and optionally a reference element.
 */

import { RefObject, useEffect, useRef } from 'react';

function useEventListener<T extends HTMLElement = HTMLDivElement>(
  eventName: keyof WindowEventMap | string, // string to allow custom event
  handler: (event: Event) => void,
  element?: RefObject<T>,
) {
  // Create a ref that stores handler
  const savedHandler = useRef<(event: Event) => void | null>(null);

  useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current || window;
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    // Update saved handler if necessary
    if (savedHandler.current !== handler) {
      savedHandler.current = handler;
    }

    // Create event listener that calls handler function stored in ref
    const eventListener = (event: Event) => {
      if (!!savedHandler?.current) {
        savedHandler.current(event);
      }
    };

    targetElement.addEventListener(eventName, eventListener);

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element, handler]);
}

export default useEventListener;
