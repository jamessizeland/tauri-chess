import React, { useEffect, ReactNode, useRef } from 'react';
import Portal from '@reach/portal';
import clsx from 'clsx';

interface Props {
  children: ReactNode;
}

interface ModalProps extends Props {
  isOpen: boolean;
  position?: 'default' | 'large' | 'extraLarge';
  toggle: (isOpen?: boolean) => void;
  closeOnClickOutside?: boolean;
  animate?: boolean;
}

const style = {
  animate: 'animate-modal',
  body: `flex-shrink flex-grow p-4`,
  headerTitle: `text-2xl md:text-3xl font-light`,
  header: `items-start justify-between p-4 border-b border-gray-300`,
  container: `fixed top-0 left-0 z-40 w-full h-full m-0 overflow-y-auto`,
  overlay: `fixed top-0 left-0 z-30 w-screen h-screen backdrop-blur-sm`,
  footer: `flex flex-wrap items-center justify-end p-3 border-t border-gray-300`,
  content: {
    default: `relative flex flex-col bg-white pointer-events-auto`,
  },
  orientation: {
    default:
      'mt-24 mx-8 pb-0 md:m-auto md:w-6/12 lg:w-4/12 md:pt-0 focus:outline-none rounded-lg',
    large:
      'mt-24 mx-8 pb-0 md:m-auto md:w-8/12 lg:w-8/12 md:pt-0 focus:outline-none rounded-lg',
    extraLarge:
      'mt-24 mx-8 pb-0 md:w-12/12 md:pt-0 focus:outline-none rounded-lg',
  },
};

function Modal({
  isOpen,
  toggle,
  children,
  animate = false,
  closeOnClickOutside = false,
  position = 'default',
}: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  // close modal when you click outside the modal dialogue
  useEffect(() => {
    const handleOutsideClick = (event: globalThis.MouseEvent) => {
      if (closeOnClickOutside && !ref.current?.contains(event.target as Node)) {
        if (!isOpen) return;
        toggle(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [closeOnClickOutside, isOpen, ref, toggle]);

  // close modal when you click on "ESC" key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (!isOpen) return;
      if (event.key === 'Escape') {
        toggle(false);
      }
    };
    document.addEventListener('keyup', handleEscape);
    return () => document.removeEventListener('keyup', handleEscape);
  }, [isOpen, toggle]);

  // Put focus on modal dialogue, hide scrollbar and prevent body from moving when modal is open
  useEffect(() => {
    if (!isOpen) return;

    ref.current?.focus();

    const html = document.documentElement;
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    html.style.overflow = 'hidden';
    html.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = '';
    };
  }, [isOpen]);

  return (
    <Portal>
      {isOpen && (
        <>
          <div className={style.overlay} />
          <div className={clsx(style.container)}>
            <div
              className={style.orientation[position]}
              ref={closeOnClickOutside ? ref : null}
              role="dialogue"
              aria-modal={true}
            >
              <div
                className={clsx(
                  style.orientation[position],
                  style.content.default,
                  animate ? style.animate : '',
                )}
              >
                {children}
              </div>
            </div>
          </div>
        </>
      )}
    </Portal>
  );
}

function ModalHeader({ children }: Props) {
  return (
    <div className={style.header}>
      <h4 className={style.headerTitle}>{children}</h4>
    </div>
  );
}

function ModalBody({ children }: Props) {
  return <div className={style.body}>{children}</div>;
}

function ModalFooter({ children }: Props) {
  return <div className={style.footer}>{children}</div>;
}

export { Modal, ModalHeader, ModalBody, ModalFooter };
