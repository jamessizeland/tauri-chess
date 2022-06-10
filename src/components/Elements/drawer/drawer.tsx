import React, { useEffect, useRef } from 'react';
import Portal from '@reach/portal';
import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
}

interface DrawerProps extends Props {
  isOpen: boolean;
  position?: 'left' | 'right' | 'top' | 'bottom';
  toggle: (isOpen?: boolean) => void;
}

const style = {
  body: `flex-shrink flex-grow p-4`,
  headerTitle: `text-2xl md:text-3xl font-light`,
  content: `relative flex flex-col bg-white pointer-events-auto w-full`,
  header: `items-start justify-between p-4 border-b border-gray-300`,
  container: `fixed top-0 left-0 z-40 w-full h-full m-0 overflow-hidden`,
  overlay: `fixed top-0 left-0 z-30 w-screen h-screen bg-black opacity-50`,
  footer: `flex flex-wrap items-center justify-end p-3 border-t border-gray-300`,
  animation: {
    top: 'animate-drawer-top',
    left: 'animate-drawer-left',
    right: 'animate-drawer-right',
    bottom: 'animate-drawer-bottom',
  },
  orientation: {
    top: `flex w-full h-auto absolute top-0 focus:outline-none `,
    bottom: `flex w-full h-auto absolute bottom-0 focus:outline-none `,
    left: `flex w-8/12 md:w-80 lg:w-96 h-full left-0 mx-0 my-0 absolute focus:outline-none `,
    right: `flex w-8/12 md:w-80 lg:w-96 h-full right-0 mx-0 my-0 absolute focus:outline-none `,
  },
};

/** Logic */

function Drawer({ children, isOpen, toggle, position = 'left' }: DrawerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: globalThis.MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        if (!isOpen) return;
        toggle(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isOpen, ref, toggle]);

  // close drawer when you click on "ESC" key
  useEffect(() => {
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        toggle(false);
      }
    };
    document.addEventListener('keyup', handleEscape);
    return () => document.removeEventListener('keyup', handleEscape);
  }, [isOpen, toggle]);

  // hide scrollbar and prevent body from moving when modal is open
  //put focus on modal dialogue
  useEffect(() => {
    if (!isOpen) return;
    ref.current?.focus();

    const html = document.documentElement;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    html.style.overflow = 'hidden';
    html.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      html.style.overflow = '';
      html.style.paddingRight = '';
    };
  }, [isOpen]);

  return (
    <Portal>
      {isOpen && (
        <>
          <div className={style.overlay} />
          <div className={style.container}>
            <div
              ref={ref}
              tabIndex={-1}
              role="alertdialog"
              aria-modal={true}
              className={style.orientation[position]}
            >
              <div className={clsx(style.animation[position], style.content)}>
                {children}
              </div>
            </div>
          </div>
        </>
      )}
    </Portal>
  );
}

function DrawerHeader({ children }: Props) {
  return (
    <div className={style.header}>
      <h4 className={style.headerTitle}>{children}</h4>
    </div>
  );
}

function DrawerBody({ children }: Props) {
  return <div className={style.body}>{children}</div>;
}

function DrawerFooter({ children }: Props) {
  return <div className={style.footer}>{children}</div>;
}

export { Drawer, DrawerHeader, DrawerBody, DrawerFooter };
